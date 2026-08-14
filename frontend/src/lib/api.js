/**
 * Public form/API helpers for the Vercel-hosted frontend.
 * Enquiry + contact use same-origin Vercel serverless (Resend).
 * Admin/other legacy endpoints still optionally use REACT_APP_BACKEND_URL when set.
 */

const jsonPost = async (path, payload) => {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || "Request failed");
  }
  return data;
};

/** Enquiry / lead form → Vercel serverless + Resend */
export const createLead = (payload) => jsonPost("/api/enquiry", payload);

/** Contact form → Vercel serverless + Resend */
export const createContact = (payload) => jsonPost("/api/contact", payload);

/** Optional legacy FastAPI base (admin only; not required for public site) */
const BACKEND_URL = (process.env.REACT_APP_BACKEND_URL || "").replace(/\/$/, "");
export const API_BASE = BACKEND_URL ? `${BACKEND_URL}/api` : "";

export const createAppointment = (payload) => {
  if (!API_BASE) return Promise.reject(new Error("Backend not configured"));
  return fetch(`${API_BASE}/appointments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).then(async (r) => {
    const d = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(dataError(d));
    return d;
  });
};

export const subscribeNewsletter = (email) => {
  if (!API_BASE) return Promise.reject(new Error("Backend not configured"));
  return fetch(`${API_BASE}/newsletter`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  }).then(async (r) => {
    const d = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(dataError(d));
    return d;
  });
};

export const applyCareer = (payload) => {
  if (!API_BASE) return Promise.reject(new Error("Backend not configured"));
  return fetch(`${API_BASE}/careers/apply`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).then(async (r) => {
    const d = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(dataError(d));
    return d;
  });
};

function dataError(d) {
  return d.error || d.detail || "Request failed";
}
