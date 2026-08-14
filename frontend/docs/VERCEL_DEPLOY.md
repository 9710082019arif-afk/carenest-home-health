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

- `REACT_APP_GA_MEASUREMENT_ID` = `G-2YMJF3VYZ2` (also in committed `.env.production`)

**Runtime (serverless forms):**

- `RESEND_API_KEY` — required for real email delivery
- `LEAD_NOTIFY_EMAIL` — default `info@carenesthomehealth.in`
- `LEAD_FROM_EMAIL` — optional (Resend-verified sender)
- `FORM_DEV_ACCEPT=true` — optional on temporary previews without Resend

Without `RESEND_API_KEY`, non-production accepts forms and logs them. Anonymous “production” previews need `FORM_DEV_ACCEPT=true` until Resend is configured.

## SEO

- `vercel.json` is generated from `scripts/seo-data.js` (~266 redirects with `statusCode: 301`).
- Regenerate: `yarn redirects` or `yarn vercel-config`.
- Preview hosts (`*.vercel.app`) get `X-Robots-Tag: noindex, nofollow`.
- Do not attach the apex domain until preview QA is approved.

## Forms

- `POST /api/enquiry` — lead / enquiry
- `POST /api/contact` — contact page
- Implementation: `api/*.js` + `lib/server-form.js` (Resend)

## Preview without a linked project

```bash
cd frontend
npx vercel build --yes --target=production
npx vercel deploy --prebuilt --yes -e FORM_DEV_ACCEPT=true
```

Or source deploy:

```bash
cd frontend
npx vercel deploy --yes -e FORM_DEV_ACCEPT=true
```

Claim the deployment into a **new** Vercel project (not `carenest-home-health-landing-page`). Do not attach `carenesthomehealth.in` until QA is approved.

### Important: keep landing-page project separate

The existing project `carenest-home-health-landing-page` serves `care.carenesthomehealth.in` (Google Ads). Do not point it at this main-site branch, and do not claim main-site previews into that project. Prefer a dedicated project (e.g. `carenest-home-health-main`) with Root Directory `frontend`.

If GitHub auto-deploys this repo into the landing-page project, restrict that project to the `landing-page` branch only (or add an Ignored Build Step for other branches).

## Cutover checklist (manual; not automatic)

1. Preview QA on `*.vercel.app` (home, 3 services, contact, forms, mobile, sample 301s, GA4).
2. User approval.
3. Attach `carenesthomehealth.in` (+ www) to this **new** project only.
4. DNS cutover when ready — do not shut down Emergent/AWS until apex serves correctly.
