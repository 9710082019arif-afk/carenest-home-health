# CareNest main site — Vercel deploy (3-service CRA)

## Goal

Deploy the lightweight marketing site from `frontend/` to a **new** Vercel project for `carenesthomehealth.in`.

Do **not** modify the existing Google Ads landing project (`carenest-home-health-landing-page` → `care.carenesthomehealth.in` / branch `landing-page`).

## Project settings

| Setting | Value |
|--------|--------|
| Root Directory | `frontend` |
| Framework | Create React App |
| Build Command | `yarn build` (or default) |
| Output Directory | `build` |
| Node | 20.x recommended |
| Git branch | `main` (after merge) or this prep branch for preview |

## Environment variables

**Build (Production + Preview):**

- `REACT_APP_GA_MEASUREMENT_ID` = `G-2YMJF3VYZ2` (also in committed `.env.production`)
- `REACT_APP_GTM_ID` — **optional**; leave empty unless a **main-site** container is intentionally configured. Do **not** reuse the Ads LP container `GTM-KZH5PCBS`.
- `REACT_APP_META_PIXEL_ID` — optional
- `REACT_APP_BACKEND_URL` — leave empty for public Vercel forms (admin/legacy only)

**Runtime (serverless forms):**

- `RESEND_API_KEY` — required for real email delivery in production
- `LEAD_NOTIFY_EMAIL` — default `info@carenesthomehealth.in`
- `LEAD_FROM_EMAIL` — optional (Resend-verified sender)
- `FORM_DEV_ACCEPT=true` — optional on Preview when Resend is not set yet

Without `RESEND_API_KEY`, non-production (`VERCEL_ENV !== production`) accepts forms and logs them. Preview deploys targeting “production” anonymously need `FORM_DEV_ACCEPT=true` until Resend is configured.

## SEO / routing

- `vercel.json` is generated from `scripts/seo-data.js` (~266 redirects with `statusCode: 301`).
- Regenerate: `yarn redirects` or `yarn vercel-config`.
- SPA rewrite falls back to `index.html` (API routes preferred by Vercel).
- Preview hosts (`*.vercel.app`) get `X-Robots-Tag: noindex, nofollow`.
- Do not attach the apex domain until preview QA is approved.

## Forms

- `POST /api/enquiry` — lead / enquiry (`LeadForm`)
- `POST /api/contact` — contact page
- Implementation: `api/*.js` + `lib/server-form.js` (Resend + honeypot + rate limit)
- Client: `src/lib/api.js` posts same-origin (no backend URL required)

## Isolation checklist

1. Create a **new** Vercel project (e.g. `carenest-home-health-main`).
2. Connect this repo; Root Directory = `frontend`.
3. Do **not** claim/deploy into `carenest-home-health-landing-page`.
4. Restrict the landing-page project to the `landing-page` branch only.
5. Preview on `*.vercel.app` only until explicit DNS approval.

## Cutover checklist (manual; not part of this PR)

1. Preview QA (home, 3 services, contact, forms, mobile, sample 301s, GA4).
2. User approval.
3. Attach `carenesthomehealth.in` (+ www) to the **new** project only.
4. DNS cutover when ready — do not shut down Emergent/AWS until apex serves correctly.
