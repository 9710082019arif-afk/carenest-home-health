# CareNest Main Website (Vercel-native)

This directory is the **new main website** for CareNest Home Health.

It is intentionally separate from:

- `/frontend` + `/backend` (current Emergent/AWS production stack — do not take offline yet)
- `landing-page` branch / `care.carenesthomehealth.in` (CPC landing — do not overwrite)

## Architecture decision

| Item | Choice |
|---|---|
| Framework | Next.js App Router (static + serverless) |
| Hosting | **New Vercel project** rooted at `/website` |
| Git branch | `cursor/main-website-vercel-5f8b` (or main after merge) |
| Production domain | Attach `carenesthomehealth.in` **only after approval** |
| Canonical hostname | Always `https://carenesthomehealth.in` |
| Landing page | Remains a separate Vercel project on `landing-page` |

## Local development

```bash
cd website
cp .env.example .env.local
npm install
npm run dev
```

## Scripts

```bash
npm run dev          # local server
npm run build        # production build (includes redirect generation via next.config)
npm run start        # serve build
npm run seo:audit    # technical SEO checks (fails on critical issues)
npm run lint
```

## Forms (Vercel-compatible)

API routes:

- `POST /api/enquiry`
- `POST /api/contact`

Delivery: **Resend** email to `LEAD_NOTIFY_EMAIL` (default `info@carenesthomehealth.in`).

Required production secrets:

- `RESEND_API_KEY`
- `LEAD_NOTIFY_EMAIL` (optional override)
- `LEAD_FROM_EMAIL` (verified Resend from-address)

Without Resend, production forms return a clear error asking users to call/WhatsApp. Locally, `FORM_DEV_ACCEPT=true` logs submissions.

Spam controls: honeypot field + per-IP rate limit.

## GA4

Measurement ID **G-2YMJF3VYZ2** is embedded as the default (`SITE.gaMeasurementId`), overridable with `NEXT_PUBLIC_GA_MEASUREMENT_ID`.

Tracked events (no PII/health content): `page_view`, `phone_click`, `whatsapp_click`, `enquiry_submit`, `contact_submit`.

## Indexing safeguards

- Canonicals always use `https://carenesthomehealth.in`
- Middleware sends `X-Robots-Tag: noindex` on non-production hosts (`*.vercel.app`, localhost)
- `robots.txt` disallows all when `VERCEL_ENV !== production` (unless `NEXT_PUBLIC_ALLOW_INDEXING=true`)
- Sitemap lists only canonical indexable routes (no redirects, no locations doorways)

## Do not cut over yet

Do **not** change Cloudflare DNS, Emergent, AWS, or `care.carenesthomehealth.in` until explicit approval:

> APPROVED FOR DOMAIN CUTOVER
