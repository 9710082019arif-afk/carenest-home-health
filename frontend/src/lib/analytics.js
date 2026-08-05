/**
 * Lightweight analytics helpers for GA4 / GTM / Google Ads / Meta.
 * Safe no-ops when tags are not configured yet.
 */

const pushDataLayer = (payload) => {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
};

const gtagEvent = (eventName, params = {}) => {
  if (typeof window === "undefined") return;
  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
    return;
  }
  // Queue via dataLayer so GTM can pick up events even if gtag isn't loaded yet.
  pushDataLayer({ event: eventName, ...params });
};

/**
 * Fire Google Ads conversion if AW conversion label is provided via env/config later.
 * Prefer configuring the conversion in GTM listening to these event names.
 */
export const trackLeadSubmit = ({ city = "", service = "", source = "", urgency = "" } = {}) => {
  const params = {
    event_category: "lead",
    city,
    service,
    source,
    urgency,
  };
  gtagEvent("lead_submit", params);
  gtagEvent("generate_lead", params);
  pushDataLayer({ event: "lead_submit", ...params });
  if (typeof window.fbq === "function") {
    window.fbq("track", "Lead", { content_name: service || source, city });
  }
};

export const trackAppointmentBooked = ({ city = "", service = "" } = {}) => {
  const params = {
    event_category: "appointment",
    city,
    service,
  };
  gtagEvent("appointment_booked", params);
  gtagEvent("generate_lead", { ...params, lead_type: "appointment" });
  pushDataLayer({ event: "appointment_booked", ...params });
  if (typeof window.fbq === "function") {
    window.fbq("track", "Schedule", { content_name: service, city });
  }
};

export const trackPhoneClick = ({ location = "unknown" } = {}) => {
  const params = {
    event_category: "contact",
    method: "phone",
    location,
  };
  gtagEvent("phone_click", params);
  gtagEvent("contact", params);
  pushDataLayer({ event: "phone_click", ...params });
  if (typeof window.fbq === "function") {
    window.fbq("track", "Contact", { content_name: "phone", location });
  }
};

export const trackWhatsAppClick = ({ location = "unknown" } = {}) => {
  const params = {
    event_category: "contact",
    method: "whatsapp",
    location,
  };
  gtagEvent("whatsapp_click", params);
  gtagEvent("contact", params);
  pushDataLayer({ event: "whatsapp_click", ...params });
  if (typeof window.fbq === "function") {
    window.fbq("track", "Contact", { content_name: "whatsapp", location });
  }
};
