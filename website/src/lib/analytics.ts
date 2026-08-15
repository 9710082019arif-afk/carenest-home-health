"use client";

type TrackParams = Record<string, string | undefined>;

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
  }
}

function gtagEvent(name: string, params: TrackParams = {}) {
  if (typeof window === "undefined") return;
  const clean = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v != null && v !== "")
  );
  if (typeof window.gtag === "function") {
    window.gtag("event", name, clean);
    return;
  }
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: name, ...clean });
}

/** Never send names, phones, emails, messages, or health details */
export function trackPhoneClick(location = "unknown") {
  gtagEvent("phone_click", { event_category: "contact", method: "phone", location });
}

export function trackWhatsAppClick(location = "unknown") {
  gtagEvent("whatsapp_click", { event_category: "contact", method: "whatsapp", location });
}

export function trackEnquirySubmit(service?: string) {
  gtagEvent("enquiry_submit", {
    event_category: "lead",
    service: service || "general",
  });
  gtagEvent("generate_lead", { event_category: "lead", service: service || "general" });
}

export function trackContactSubmit() {
  gtagEvent("contact_submit", { event_category: "lead" });
  gtagEvent("generate_lead", { event_category: "lead", lead_type: "contact" });
}
