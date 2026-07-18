import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API_BASE = `${BACKEND_URL}/api`;

export const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

export const createLead = (payload) => api.post("/leads", payload).then((r) => r.data);
export const createAppointment = (payload) => api.post("/appointments", payload).then((r) => r.data);
export const createContact = (payload) => api.post("/contact", payload).then((r) => r.data);
export const subscribeNewsletter = (email) => api.post("/newsletter", { email }).then((r) => r.data);
export const applyCareer = (payload) => api.post("/careers/apply", payload).then((r) => r.data);

/**
 * Streaming chat via SSE using fetch (native).
 * Returns an async iterator of text chunks.
 */
export async function* streamChat(sessionId, message, signal) {
  const resp = await fetch(`${API_BASE}/chat/stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session_id: sessionId, message }),
    signal,
  });
  if (!resp.ok || !resp.body) {
    throw new Error(`Chat failed: ${resp.status}`);
  }
  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    // Split by double newline for SSE frames
    const frames = buffer.split("\n\n");
    buffer = frames.pop() || "";
    for (const frame of frames) {
      const lines = frame.split("\n");
      const dataLines = lines.filter((l) => l.startsWith("data:"));
      if (dataLines.length === 0) continue;
      const payload = dataLines.map((l) => l.slice(5).replace(/^ /, "")).join("\n");
      if (payload === "[DONE]") return;
      yield payload;
    }
  }
}
