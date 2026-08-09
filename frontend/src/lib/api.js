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
