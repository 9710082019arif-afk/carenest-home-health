"""
CareNest Home Health — brand kit generator.

Generates:
- Hero banner (wide)
- 8 category images (Nursing, Elder, ICU, Physio, Patient Care, Doctor Visit, Medical Equipment, Home Care)
- Google Business Profile cover
- PNG conversions of the SVG logo at multiple sizes
- Colour palette poster

Run once: `python /app/scripts/generate_brand_kit.py`
"""
import asyncio
import base64
import os
import uuid
from pathlib import Path

from dotenv import load_dotenv

from emergentintegrations.llm.chat import LlmChat, UserMessage

ROOT = Path("/app")
load_dotenv(ROOT / "backend" / ".env")

API_KEY = os.getenv("EMERGENT_LLM_KEY")
if not API_KEY:
    raise SystemExit("EMERGENT_LLM_KEY missing in /app/backend/.env")

OUT = ROOT / "brand-kit"
IMG_DIR = OUT / "images"
SOCIAL_DIR = OUT / "social"
IMG_DIR.mkdir(parents=True, exist_ok=True)
SOCIAL_DIR.mkdir(parents=True, exist_ok=True)

STYLE = (
    "Editorial healthcare marketing photograph. Warm natural light. Photorealistic, "
    "shallow depth of field, professional, dignified, aspirational. Colour palette: "
    "soft teal, royal blue, cream, warm gold accents. Indian setting, Indian people. "
    "Clean composition, no visible text or logos."
)

PROMPTS = {
    "hero-banner": (
        "Wide 16:9 hero banner photograph. A young Indian female registered nurse in "
        "teal scrubs stands smiling gently beside an elderly Indian gentleman with silver "
        "hair, seated in an armchair in a bright modern Indian home. Large windows behind them "
        "with soft morning light. The nurse rests one hand reassuringly on the man's shoulder. "
        "Warm, dignified, luxury healthcare feel. Room for text on the left. "
        + STYLE
    ),
    "nursing-care": (
        "A young Indian female registered nurse in teal scrubs checking the blood pressure "
        "of an elderly Indian patient seated on a sofa in a well-lit home living room. Cuff on "
        "the patient's arm, stethoscope around the nurse's neck. Warm afternoon light. "
        + STYLE
    ),
    "elder-care": (
        "An Indian female caregiver in her thirties (kurta) gently supporting an elderly Indian "
        "woman with grey hair as she walks in a sunlit Indian home living room. Wooden floor, "
        "plants in the background, an area rug. Tender, compassionate moment. "
        + STYLE
    ),
    "icu-at-home": (
        "A hospital-grade ICU setup at home in India — a hospital bed with a vital-signs monitor "
        "showing waveforms next to it, an oxygen concentrator, IV drip stand, in a clean Indian "
        "home bedroom. An Indian ICU nurse in navy scrubs is calmly adjusting the monitor. "
        "Cool clinical lighting mixed with warm home tones. "
        + STYLE
    ),
    "physiotherapy": (
        "An Indian male physiotherapist in his thirties (polo shirt) guiding an elderly Indian "
        "man through gentle leg-strengthening exercises in a bright home living room. A yoga mat "
        "on the floor and an exercise resistance band in use. Encouraging, positive atmosphere. "
        + STYLE
    ),
    "patient-care": (
        "A young Indian female nurse gently repositioning an elderly bedridden Indian patient in "
        "a clean home bedroom. Fresh cream and soft-teal linens. Bedside table with a glass of "
        "water. Professional but tender moment. Soft ambient light. "
        + STYLE
    ),
    "doctor-visit": (
        "An Indian male doctor in his forties, formal shirt and stethoscope around his neck, "
        "seated on a sofa examining an elderly Indian woman with a warm smile. A leather doctor's "
        "bag beside him. Warm afternoon light through windows. Trust and reassurance. "
        + STYLE
    ),
    "medical-equipment": (
        "A clean editorial flat-lay photograph of home medical equipment neatly arranged on a "
        "light-wood surface: an oxygen concentrator, a BiPAP machine, a folding wheelchair, a "
        "digital blood-pressure monitor, a pulse oximeter, a stethoscope, a small hospital-bed "
        "remote. Minimal, well-lit, product photography. Subtle gold accents. "
        + STYLE
    ),
    "home-care": (
        "A wide-angle photograph of an Indian nurse in teal scrubs and an Indian caregiver in a "
        "kurta warmly tending to an elderly Indian couple in their bright living room. Multiple "
        "generations, warm lighting, plants, family photos in soft focus on the wall. "
        "Aspirational Indian family healthcare scene. "
        + STYLE
    ),
    "gbp-cover": (
        "A wide 16:9 editorial photograph of a smiling Indian female nurse in teal scrubs "
        "with a stethoscope, standing with arms gently folded, in front of a soft-focus bright "
        "Indian home interior. Space on the left third of the image for a text overlay. "
        "Warm, welcoming, trustworthy. "
        + STYLE
    ),
}

MODEL = "gemini-3.1-flash-image-preview"  # nano banana latest


async def gen_one(name: str, prompt: str) -> Path:
    """Generate one image and save to disk."""
    session_id = f"brandkit-{name}-{uuid.uuid4().hex[:6]}"
    chat = LlmChat(
        api_key=API_KEY,
        session_id=session_id,
        system_message="You are a professional healthcare brand photographer creating high-end editorial images.",
    ).with_model("gemini", MODEL).with_params(modalities=["image", "text"])

    msg = UserMessage(text=prompt)
    try:
        _text, images = await chat.send_message_multimodal_response(msg)
    except Exception as e:
        print(f"  ! {name}: FAILED — {e}")
        return None

    if not images:
        print(f"  ! {name}: no image returned")
        return None

    img = images[0]
    ext = "png" if "png" in img.get("mime_type", "").lower() else "jpg"
    out_dir = SOCIAL_DIR if name in {"gbp-cover", "hero-banner"} else IMG_DIR
    out_path = out_dir / f"{name}.{ext}"
    out_path.write_bytes(base64.b64decode(img["data"]))
    print(f"  ✓ {name} → {out_path}  ({out_path.stat().st_size // 1024} KB)")
    return out_path


async def main():
    print(f"Generating {len(PROMPTS)} brand images via Nano Banana ({MODEL})…\n")
    # Sequential (to avoid rate-limits and keep logs tidy)
    for name, prompt in PROMPTS.items():
        await gen_one(name, prompt)
    print("\nAll AI images done.")


if __name__ == "__main__":
    asyncio.run(main())
