import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { COMPANY } from "@/data/company";

type Body = {
  name?: string;
  phone?: string;
  email?: string;
  service?: string;
  city?: string;
  subject?: string;
  message?: string;
  source?: string;
  company_website?: string;
};

function validate(body: Body, mode: "enquiry" | "contact") {
  const name = (body.name || "").trim();
  const phone = (body.phone || "").trim();
  const email = (body.email || "").trim();
  const message = (body.message || "").trim();
  const subject = (body.subject || "").trim();

  if (name.length < 2 || name.length > 120) return "Please enter a valid name.";
  if (phone.length < 8 || phone.length > 20) return "Please enter a valid phone number.";
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Please enter a valid email.";
  if (message.length > 2000) return "Message is too long.";
  if (mode === "contact" && subject.length < 2) return "Please enter a subject.";
  return null;
}

async function sendLeadEmail(mode: "enquiry" | "contact", body: Body) {
  const notifyTo = (process.env.LEAD_NOTIFY_EMAIL || COMPANY.email).trim();
  const from = (process.env.LEAD_FROM_EMAIL || "CareNest Website <onboarding@resend.dev>").trim();
  const apiKey = (process.env.RESEND_API_KEY || "").trim();

  const subject =
    mode === "enquiry"
      ? `[CareNest Enquiry] ${body.service || "General"} — ${body.name}`
      : `[CareNest Contact] ${body.subject || "Message"} — ${body.name}`;

  const text = [
    `Mode: ${mode}`,
    `Name: ${body.name}`,
    `Phone: ${body.phone}`,
    `Email: ${body.email || "-"}`,
    `City: ${body.city || "-"}`,
    `Service: ${body.service || "-"}`,
    `Subject: ${body.subject || "-"}`,
    `Message: ${body.message || "-"}`,
    `Source: ${body.source || mode}`,
    `Received: ${new Date().toISOString()}`,
  ].join("\n");

  if (!apiKey) {
    if (process.env.NODE_ENV !== "production" || process.env.FORM_DEV_ACCEPT === "true") {
      console.info("[lead-dev-accept]", subject, text);
      return { ok: true as const };
    }
    return {
      ok: false as const,
      error: "Form delivery is not configured yet. Please call or WhatsApp CareNest.",
    };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [notifyTo],
      subject,
      text,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    console.error("Resend error", res.status, detail);
    return { ok: false as const, error: "Could not send right now. Please call or WhatsApp us." };
  }

  return { ok: true as const };
}

export async function handleLeadForm(req: Request, mode: "enquiry" | "contact") {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const limited = rateLimit(`form:${mode}:${ip}`, { limit: 8, windowMs: 60_000 });
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many requests. Please try again shortly or call us." },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSec) } }
    );
  }

  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if ((body.company_website || "").trim()) {
    return NextResponse.json({ ok: true });
  }

  const error = validate(body, mode);
  if (error) return NextResponse.json({ error }, { status: 400 });

  const result = await sendLeadEmail(mode, body);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 503 });

  return NextResponse.json({ ok: true });
}
