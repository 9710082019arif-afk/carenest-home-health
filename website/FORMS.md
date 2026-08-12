# Form delivery architecture (Vercel)

## Recommendation (safe, no Emergent/AWS EC2 dependency)

```
Browser form
  → Next.js Route Handler (/api/enquiry or /api/contact)
  → validation + honeypot + rate limit
  → Resend API
  → email to info@carenesthomehealth.in
```

### Why Resend

- Native fit for Vercel serverless
- No MongoDB required for first-line lead capture
- Secrets stay server-side (`RESEND_API_KEY`)

### Optional later upgrade

If you need an admin CRM again:

1. Keep Resend email as the primary alert
2. Add a Vercel Postgres / Supabase table for lead storage
3. Do **not** reconnect Emergent runtime

### Do not delete old AWS/Mongo lead data yet

Existing `/backend` FastAPI + Mongo remains the production lead store until domain cutover and a migration plan is approved.
