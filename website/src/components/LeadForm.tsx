"use client";

import { FormEvent, useState } from "react";
import { SERVICES } from "@/data/services";
import { trackContactSubmit, trackEnquirySubmit } from "@/lib/analytics";

type Mode = "enquiry" | "contact";

type Props = {
  mode?: Mode;
  defaultService?: string;
  id?: string;
};

export function LeadForm({ mode = "enquiry", defaultService = "", id }: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    // Honeypot
    if (String(data.get("company_website") || "").trim()) {
      setStatus("success");
      setMessage("Thank you. We will contact you shortly.");
      form.reset();
      return;
    }

    setStatus("loading");
    setMessage("");

    const payload = {
      name: String(data.get("name") || "").trim(),
      phone: String(data.get("phone") || "").trim(),
      email: String(data.get("email") || "").trim(),
      service: String(data.get("service") || "").trim(),
      city: String(data.get("city") || "Pune").trim(),
      subject: String(data.get("subject") || "").trim(),
      message: String(data.get("message") || "").trim(),
      source: mode,
    };

    try {
      const endpoint = mode === "contact" ? "/api/contact" : "/api/enquiry";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(json.error || "Something went wrong. Please call or WhatsApp us.");
      }
      setStatus("success");
      setMessage("Thank you. A CareNest coordinator will respond shortly.");
      if (mode === "contact") trackContactSubmit();
      else trackEnquirySubmit(payload.service || undefined);
      form.reset();
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Could not send. Please call or WhatsApp.");
    }
  }

  return (
    <form id={id} onSubmit={onSubmit} className="card-soft space-y-4 shadow-[0_20px_50px_-30px_rgba(13,59,102,0.45)]" noValidate>
      <div>
        <p className="eyebrow">Enquiry</p>
        <h2 className="text-3xl mt-2 text-[var(--royal)]">
          {mode === "contact" ? "Send us a message" : "Tell us how we can help"}
        </h2>
        <p className="prose-cn mt-2">Share basic contact details only — no medical records in this form.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="form-field">
          <label htmlFor={`${mode}-name`}>Full name</label>
          <input id={`${mode}-name`} name="name" required autoComplete="name" minLength={2} maxLength={120} />
        </div>
        <div className="form-field">
          <label htmlFor={`${mode}-phone`}>Phone</label>
          <input id={`${mode}-phone`} name="phone" type="tel" required autoComplete="tel" minLength={8} maxLength={20} />
        </div>
        <div className="form-field">
          <label htmlFor={`${mode}-email`}>Email (optional)</label>
          <input id={`${mode}-email`} name="email" type="email" autoComplete="email" maxLength={120} />
        </div>
        <div className="form-field">
          <label htmlFor={`${mode}-city`}>City</label>
          <input id={`${mode}-city`} name="city" defaultValue="Pune" maxLength={80} />
        </div>
      </div>

      {mode === "enquiry" ? (
        <div className="form-field">
          <label htmlFor={`${mode}-service`}>Service</label>
          <select id={`${mode}-service`} name="service" defaultValue={defaultService}>
            <option value="">Select a service</option>
            {SERVICES.map((s) => (
              <option key={s.slug} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div className="form-field">
          <label htmlFor={`${mode}-subject`}>Subject</label>
          <input id={`${mode}-subject`} name="subject" required maxLength={160} />
        </div>
      )}

      <div className="form-field">
        <label htmlFor={`${mode}-message`}>Message</label>
        <textarea
          id={`${mode}-message`}
          name="message"
          rows={4}
          maxLength={2000}
          placeholder="Share care timing and locality — please avoid sensitive medical details."
        />
      </div>

      {/* Honeypot */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor={`${mode}-company`}>Company website</label>
        <input id={`${mode}-company`} name="company_website" tabIndex={-1} autoComplete="off" />
      </div>

      <button type="submit" className="btn btn-gold" disabled={status === "loading"}>
        {status === "loading" ? "Sending…" : mode === "contact" ? "Send message" : "Submit enquiry"}
      </button>

      {message && (
        <p
          role="status"
          className={status === "error" ? "text-red-700 font-semibold" : "text-[var(--teal-deep)] font-semibold"}
        >
          {message}
        </p>
      )}
    </form>
  );
}
