# CareNest main site — Vercel deploy (3-service CRA)

## Goal

Deploy the lightweight marketing site from `frontend/` to a **new** Vercel project for `carenesthomehealth.in`.

Do **not** modify the existing Google Ads landing project (`carenest-home-health-landing-page` → `care.carenesthomehealth.in`).

## Project settings

| Setting | Value |
|--------|--------|
| Root Directory | `frontend` |
| Framework | Create React App |
| Build Command | `yarn build` (or default) |
| Output Directory | `build` |
| Node | 20.x recommended |

## Environment variables

**Build (Production + Preview):**

- `REACT_APP_GA_MEASUREMENT_ID` = `G-2YMJF3VYZ2`

**Runtime (serverless forms):**

- `RESEND_API_KEY` — required for real email delivery
- `LEAD_NOTIFY_EMAIL` — default `info@carenesthomehealth.in`
- `LEAD_FROM_EMAIL` — optional (Resend-verified sender)

Without `RESEND_API_KEY`, preview/non-production accepts forms and logs them (`FORM_DEV_ACCEPT` / `VERCEL_ENV !== production`).

## SEO

- `vercel.json` is generated from `scripts/seo-data.js` (~269 permanent redirects).
- Regenerate: `yarn redirects` or `yarn vercel-config`.
- Preview hosts (`*.vercel.app`) get `X-Robots-Tag: noindex, nofollow`.
- Do not attach the apex domain until preview QA is approved.

## Forms

- `POST /api/enquiry` — lead / enquiry
- `POST /api/contact` — contact page
- Implementation: `api/*.js` + `lib/server-form.js` (Resend)

## Cutover checklist (manual; not automatic)

1. Preview QA on `*.vercel.app` (home, 3 services, contact, forms, mobile, sample 301s, GA4).
2. User approval.
3. Attach `carenesthomehealth.in` (+ www) to this **new** project only.
4. DNS cutover when ready — do not shut down Emergent/AWS until apex serves correctly.
