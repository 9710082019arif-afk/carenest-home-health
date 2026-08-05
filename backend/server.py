from fastapi import FastAPI, APIRouter, HTTPException, Query, Header, Depends
from fastapi.responses import StreamingResponse
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import asyncio
import uuid
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr, ConfigDict, field_validator
from typing import List, Optional, Literal
from datetime import datetime, timezone

from aws_integrations import send_email_ses, stream_anthropic_chat
from env_utils import env_str, load_environment

ROOT_DIR = Path(__file__).parent
load_environment(ROOT_DIR)


def _blank_str_to_none(v):
    """Coerce empty strings from web forms into None for optional Pydantic fields.

    Frontend forms serialise unfilled optional inputs as '' rather than omitting
    them; Pydantic v2 EmailStr rejects '' as invalid. This validator normalises
    the common '' case for any optional field that uses it via `mode='before'`.
    """
    if isinstance(v, str) and v.strip() == "":
        return None
    return v

# MongoDB — short timeouts so /api/health fails fast instead of hanging
mongo_url = os.environ["MONGO_URL"]
mongo_client = AsyncIOMotorClient(
    mongo_url,
    serverSelectionTimeoutMS=5000,
    connectTimeoutMS=5000,
)
db = mongo_client[os.environ["DB_NAME"]]

# Integrations (AWS SES + Anthropic — Emergent keys are no longer used)
EMAIL_FROM_NAME = env_str("EMAIL_FROM_NAME", "CareNest Home Health")
LEAD_NOTIFY_EMAIL = env_str("LEAD_NOTIFY_EMAIL", "info@carenesthomehealth.in")
ADMIN_TOKEN = env_str("ADMIN_TOKEN")


def require_admin(x_admin_token: str = Header(default="")):
    if not ADMIN_TOKEN or x_admin_token != ADMIN_TOKEN:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return True

# Logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

app = FastAPI(title="CareNest Home Health API")
api = APIRouter(prefix="/api")


# ------------------------- Models -------------------------
def now_iso():
    return datetime.now(timezone.utc).isoformat()


class LeadCreate(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    phone: str = Field(min_length=6, max_length=20)
    email: Optional[EmailStr] = None
    city: Optional[str] = None
    service: Optional[str] = None
    message: Optional[str] = None
    source: Optional[str] = "website"
    urgency: Optional[Literal["standard", "urgent", "emergency"]] = "standard"

    _norm_email = field_validator("email", mode="before")(_blank_str_to_none)


class Lead(LeadCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: str = Field(default_factory=now_iso)
    status: Literal["new", "contacted", "closed"] = "new"


class AppointmentCreate(BaseModel):
    patient_name: str
    phone: str
    email: Optional[EmailStr] = None
    city: str
    service: str
    preferred_date: Optional[str] = None
    preferred_time: Optional[str] = None
    patient_age: Optional[int] = None
    patient_condition: Optional[str] = None
    address: Optional[str] = None
    notes: Optional[str] = None

    _norm_email = field_validator("email", mode="before")(_blank_str_to_none)


class Appointment(AppointmentCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: str = Field(default_factory=now_iso)
    status: Literal["pending", "confirmed", "completed", "cancelled"] = "pending"


class NewsletterCreate(BaseModel):
    email: EmailStr


class ContactCreate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    subject: Optional[str] = None
    message: str


class CareerApplication(BaseModel):
    name: str
    phone: str
    email: Optional[EmailStr] = None
    role: str
    experience_years: Optional[int] = None
    city: Optional[str] = None
    resume_url: Optional[str] = None
    cover_letter: Optional[str] = None

    _norm_email = field_validator("email", mode="before")(_blank_str_to_none)


class ChatMessage(BaseModel):
    session_id: str
    message: str


# ------------------------- Helpers -------------------------
async def send_email_async(to_email: str, subject: str, html: str, reply_to: Optional[str] = None):
    return await send_email_ses(
        to_email=to_email,
        subject=subject,
        html=html,
        reply_to=reply_to,
    )


def render_lead_email_html(payload: dict, kind: str = "Lead") -> str:
    rows = "".join(
        f'<tr><td style="padding:8px 12px;border-bottom:1px solid #eee;font-weight:600;color:#0D3B66">{k}</td>'
        f'<td style="padding:8px 12px;border-bottom:1px solid #eee;color:#111">{v if v not in (None, "") else "-"}</td></tr>'
        for k, v in payload.items()
    )
    return f"""
    <table cellpadding="0" cellspacing="0" style="width:100%;max-width:640px;margin:0 auto;font-family:Arial,sans-serif;background:#FAFAFA;border:1px solid #E2E8F0;border-radius:8px;overflow:hidden">
      <tr><td style="background:#0D3B66;padding:22px 24px;color:#fff">
        <div style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#D4AF37">New {kind}</div>
        <div style="font-size:22px;font-weight:600;margin-top:4px">CareNest Home Health</div>
      </td></tr>
      <tr><td style="padding:20px 24px">
        <table style="width:100%;border-collapse:collapse;font-size:14px">{rows}</table>
      </td></tr>
      <tr><td style="padding:14px 24px;background:#F1F5F9;font-size:12px;color:#64748B">
        Received {datetime.now(timezone.utc).strftime('%d %b %Y, %H:%M UTC')} · carenesthomehealth.in
      </td></tr>
    </table>
    """


# ------------------------- Routes -------------------------
@api.get("/")
async def root():
    return {"service": "CareNest Home Health API", "status": "ok", "timestamp": now_iso()}


@api.get("/health")
async def health():
    try:
        await db.command({"ping": 1})
        mongo_status = "ok"
    except Exception as exc:
        logger.error("Mongo health check failed: %s", exc)
        raise HTTPException(status_code=503, detail=f"mongo unavailable: {exc}") from exc
    return {"status": "healthy", "mongo": mongo_status, "timestamp": now_iso()}


@api.post("/leads", response_model=Lead)
async def create_lead(data: LeadCreate):
    lead = Lead(**data.model_dump())
    await db.leads.insert_one(lead.model_dump())
    # Notify (fire-and-forget so response stays fast)
    html = render_lead_email_html(lead.model_dump(), kind="Enquiry")
    asyncio.create_task(
        send_email_async(
            LEAD_NOTIFY_EMAIL,
            f"New Enquiry · {lead.name} · {lead.service or 'General'}",
            html,
            reply_to=lead.email,
        )
    )
    return lead


@api.get("/leads", response_model=List[Lead])
async def list_leads(limit: int = Query(100, ge=1, le=500), _: bool = Depends(require_admin)):
    docs = await db.leads.find({}, {"_id": 0}).sort("created_at", -1).to_list(limit)
    return docs


@api.post("/appointments", response_model=Appointment)
async def create_appointment(data: AppointmentCreate):
    appt = Appointment(**data.model_dump())
    await db.appointments.insert_one(appt.model_dump())
    html = render_lead_email_html(appt.model_dump(), kind="Appointment")
    asyncio.create_task(
        send_email_async(
            LEAD_NOTIFY_EMAIL,
            f"New Appointment · {appt.patient_name} · {appt.service}",
            html,
            reply_to=appt.email,
        )
    )
    return appt


@api.get("/appointments", response_model=List[Appointment])
async def list_appointments(limit: int = Query(100, ge=1, le=500), _: bool = Depends(require_admin)):
    docs = await db.appointments.find({}, {"_id": 0}).sort("created_at", -1).to_list(limit)
    return docs


@api.get("/admin/verify")
async def admin_verify(_: bool = Depends(require_admin)):
    return {"ok": True}


@api.get("/admin/stats")
async def admin_stats(_: bool = Depends(require_admin)):
    from datetime import timedelta
    now = datetime.now(timezone.utc)
    since = (now - timedelta(days=7)).isoformat()
    return {
        "leads_total": await db.leads.count_documents({}),
        "leads_last_7d": await db.leads.count_documents({"created_at": {"$gte": since}}),
        "appointments_total": await db.appointments.count_documents({}),
        "appointments_last_7d": await db.appointments.count_documents({"created_at": {"$gte": since}}),
        "contacts_total": await db.contacts.count_documents({}),
        "careers_total": await db.careers.count_documents({}),
        "newsletter_total": await db.newsletter.count_documents({}),
    }


@api.get("/admin/contacts")
async def list_contacts(limit: int = Query(100, ge=1, le=500), _: bool = Depends(require_admin)):
    docs = await db.contacts.find({}, {"_id": 0}).sort("created_at", -1).to_list(limit)
    return docs


@api.get("/admin/careers")
async def list_careers(limit: int = Query(100, ge=1, le=500), _: bool = Depends(require_admin)):
    docs = await db.careers.find({}, {"_id": 0}).sort("created_at", -1).to_list(limit)
    return docs


@api.get("/admin/newsletter")
async def list_newsletter(limit: int = Query(500, ge=1, le=2000), _: bool = Depends(require_admin)):
    docs = await db.newsletter.find({}, {"_id": 0}).sort("created_at", -1).to_list(limit)
    return docs


@api.post("/contact")
async def create_contact(data: ContactCreate):
    doc = {"id": str(uuid.uuid4()), "created_at": now_iso(), **data.model_dump()}
    await db.contacts.insert_one(doc)
    html = render_lead_email_html(doc, kind="Contact Message")
    asyncio.create_task(
        send_email_async(
            LEAD_NOTIFY_EMAIL,
            f"Contact · {data.name}",
            html,
            reply_to=data.email,
        )
    )
    return {"ok": True, "id": doc["id"]}


@api.post("/newsletter")
async def newsletter_subscribe(data: NewsletterCreate):
    existing = await db.newsletter.find_one({"email": data.email}, {"_id": 0})
    if existing:
        return {"ok": True, "already_subscribed": True}
    doc = {"id": str(uuid.uuid4()), "email": data.email, "created_at": now_iso()}
    await db.newsletter.insert_one(doc)
    return {"ok": True, "already_subscribed": False}


@api.post("/careers/apply")
async def apply_career(data: CareerApplication):
    doc = {"id": str(uuid.uuid4()), "created_at": now_iso(), **data.model_dump()}
    await db.careers.insert_one(doc)
    html = render_lead_email_html(doc, kind="Career Application")
    asyncio.create_task(
        send_email_async(
            LEAD_NOTIFY_EMAIL,
            f"Career Application · {data.name} · {data.role}",
            html,
            reply_to=data.email,
        )
    )
    return {"ok": True, "id": doc["id"]}


# ------------------------- AI Chat (SSE stream) -------------------------
CHAT_SYSTEM_PROMPT = """You are 'Care Concierge' — a warm, precise virtual assistant for CareNest Home Health in India.

About the company:
- 24x7 professional home healthcare across Pune, Pimpri-Chinchwad, Mumbai, Navi Mumbai, Thane, Bengaluru, Hyderabad, Delhi NCR, Ranchi, Bhubaneswar, Kolkata, Goa and expanding.
- Services: Home Nursing, Caregiver, Doctor-at-Home, ICU-at-Home, Physiotherapy, Medical Equipment Rental, Bedridden / Stroke / Paralysis / Cancer / Palliative / Dementia / Alzheimer / Post-op / Tracheostomy / Ventilator care, Mother & Baby Care, Attendant, Elder Care.
- Phone/WhatsApp: +91 9175724546  ·  Email: info@carenesthomehealth.in

Indicative starting rates (share only when the user asks about pricing; always clarify the final plan is personalised):
- Home Nursing / 24x7 Nursing Care: ₹2,800 – ₹3,000 per day (varies by patient condition)
- Elder Care: ₹850 for 12-hour shift · ₹900 for 24-hour
- Critical Care: from ₹1,200 per day (equipment billed separately)
- Physiotherapy at Home: ₹800 per session
- Injection: ₹600 per injection · Dressing: ₹600 per visit
- All other services (Doctor-at-Home, ICU-at-Home, Ventilator, Caregiver, Mother & Baby, etc.): custom plan shared after a free 10-minute consultation.
- IMPORTANT: We do NOT charge GST. Rates are all-inclusive of taxes.

Guidelines:
1. Speak like an empathetic care coordinator — never robotic, never clinical.
2. Keep replies short (3-5 sentences) unless the user explicitly asks for depth.
3. NEVER provide medical diagnosis, drug dosage, or emergency instructions beyond 'please call 112 / your nearest ER right away'.
4. Always end with a helpful next step (book appointment, WhatsApp, or call).
5. If the user shares a phone number or clear intent, invite them to book via the Book Appointment page.
6. When quoting a rate, always add: 'this is indicative — the final plan is personalised after a free 10-minute consult.' Never invent rates for services not listed above; for those, say 'we share a personalised plan after a free 10-minute consult'.
"""


@api.post("/chat/stream")
async def chat_stream(payload: ChatMessage):
    if not env_str("ANTHROPIC_API_KEY"):
        raise HTTPException(status_code=500, detail="LLM key not configured")

    await db.chat_messages.insert_one({
        "id": str(uuid.uuid4()),
        "session_id": payload.session_id,
        "role": "user",
        "content": payload.message,
        "created_at": now_iso(),
    })

    assistant_buffer = {"text": ""}

    async def event_generator():
        try:
            async for chunk in stream_anthropic_chat(
                session_id=payload.session_id,
                user_message=payload.message,
                system_prompt=CHAT_SYSTEM_PROMPT,
            ):
                assistant_buffer["text"] += chunk
                yield f"data: {chunk}\n\n"
        except Exception as e:
            logger.error(f"chat stream error: {e}")
            yield f"data: [error] {str(e)}\n\n"
        finally:
            if assistant_buffer["text"]:
                await db.chat_messages.insert_one({
                    "id": str(uuid.uuid4()),
                    "session_id": payload.session_id,
                    "role": "assistant",
                    "content": assistant_buffer["text"],
                    "created_at": now_iso(),
                })
            yield "event: done\ndata: [DONE]\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no", "Connection": "keep-alive"},
    )


@api.get("/chat/history/{session_id}")
async def chat_history(session_id: str):
    docs = await db.chat_messages.find({"session_id": session_id}, {"_id": 0}).sort("created_at", 1).to_list(500)
    return docs


# ------------------------- SEO helpers -------------------------
@api.get("/config/public")
async def public_config():
    # Re-apply .env on each request so preview/workspace edits to analytics IDs
    # show up without a full process restart. Blank process-env placeholders are
    # overwritten by non-empty file values (see env_utils.apply_dotenv_file).
    load_environment(ROOT_DIR)
    return {
        "company": "CareNest Home Health",
        "phone": "+919175724546",
        "whatsapp": "+919175724546",
        "email": LEAD_NOTIFY_EMAIL,
        "ga_id": env_str("GA_MEASUREMENT_ID"),
        "gtm_id": env_str("GTM_ID"),
        "meta_pixel_id": env_str("META_PIXEL_ID"),
    }


app.include_router(api)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=env_str("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown():
    mongo_client.close()
