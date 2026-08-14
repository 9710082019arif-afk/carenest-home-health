/**
 * Shared Resend form delivery for Vercel serverless functions.
 * No FastAPI / Mongo dependency for public leads.
 */

const buckets = new Map();

function rateLimit(key, { limit = 8, windowMs = 60_000 } = {}) {
  const now = Date.now();
  const existing = buckets.get(key);
  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true };
  }
  if (existing.count >= limit) {
    return { ok: false, retryAfterSec: Math.ceil((existing.resetAt - now) / 1000) };
  }
  existing.count += 1;
  return { ok: true };
}

function readBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  return {};
}

function validate(body, mode) {
  const name = String(body.name || "").trim();
  const phone = String(body.phone || "").trim();
  const email = String(body.email || "").trim();
  const message = String(body.message || "").trim();
  const subject = String(body.subject || "").trim();

  if (name.length < 2 || name.length > 120) return "Please enter a valid name.";
  if (phone.length < 6 || phone.length > 20) return "Please enter a valid phone number.";
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Please enter a valid email.";
  if (message.length > 2000) return "Message is too long.";
  if (mode === "contact" && subject.length < 2) return "Please enter a subject.";
  return null;
}

async function sendViaResend(mode, body) {
  const notifyTo = (process.env.LEAD_NOTIFY_EMAIL || "info@carenesthomehealth.in").trim();
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
    `Urgency: ${body.urgency || "-"}`,
    `Message: ${body.message || "-"}`,
    `Source: ${body.source || mode}`,
    `Received: ${new Date().toISOString()}`,
  ].join("\n");

  if (!apiKey) {
    if (process.env.FORM_DEV_ACCEPT === "true" || process.env.VERCEL_ENV !== "production") {
      console.info("[lead-dev-accept]", subject, text);
      return { ok: true, mode: "dev-log" };
    }
    return {
      ok: false,
      error: "Form delivery is not configured yet. Please call or WhatsApp CareNest.",
    };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to: [notifyTo], subject, text }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    console.error("Resend error", res.status, detail);
    return { ok: false, error: "Could not send right now. Please call or WhatsApp us." };
  }
  return { ok: true, mode: "resend" };
}

async function handleForm(req, res, mode) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const ip =
    (req.headers["x-forwarded-for"] || "").split(",")[0].trim() ||
    req.socket?.remoteAddress ||
    "unknown";
  const limited = rateLimit(`form:${mode}:${ip}`);
  if (!limited.ok) {
    res.setHeader("Retry-After", String(limited.retryAfterSec));
    res.status(429).json({ error: "Too many requests. Please try again shortly or call us." });
    return;
  }

  const body = readBody(req);

  // Honeypot
  if (String(body.company_website || "").trim()) {
    res.status(200).json({ ok: true });
    return;
  }

  const error = validate(body, mode);
  if (error) {
    res.status(400).json({ error });
    return;
  }

  const result = await sendViaResend(mode, body);
  if (!result.ok) {
    res.status(503).json({ error: result.error });
    return;
  }
  res.status(200).json({ ok: true });
}

module.exports = { handleForm };
