# CareNest Main Website — Delivery Report

**Branch:** `cursor/main-website-vercel-5f8b`  
**App root:** `/website` (Next.js App Router)  
**Status:** Ready for temporary Vercel preview review  
**Production cutover:** **NOT done** (awaiting `APPROVED FOR DOMAIN CUTOVER`)

---

## Architecture decision (resolved)

| Concern | Decision |
|---|---|
| Conflict with CRA `/frontend` | Build separately in `/website` — old stack untouched |
| Conflict with `landing-page` / `care.carenesthomehealth.in` | Separate Vercel project; do not use `landing-page` branch |
| `main` currently has 3-service simplification | New site restores approved **11** services; old `frontend/` unchanged |
| Hosting | New Vercel project, Root Directory = `website` |
| Forms | Vercel Route Handlers + Resend (documented in `FORMS.md`) |

**No destructive changes** were made to the live Emergent/AWS site, DNS, or landing page.

---

## 1. Temporary Vercel preview URL

Deploy a **new** Vercel project (do not reuse the landing-page project):

```bash
cd website
npx vercel --yes
# Root Directory: website
# Do NOT add carenesthomehealth.in until approved
```

Required secrets on that project:

- `RESEND_API_KEY` (forms)
- `LEAD_NOTIFY_EMAIL=info@carenesthomehealth.in`
- `LEAD_FROM_EMAIL` (verified Resend sender)
- Optional: `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`

Preview hosts automatically receive `X-Robots-Tag: noindex` via middleware.

---

## 2. GitHub branch / PR

- Branch: `cursor/main-website-vercel-5f8b`
- PR: created against `main`

---

## 3. Exact page list (20 indexable)

- `/`
- `/about`
- `/services`
- `/contact`
- `/faq`
- `/privacy-policy`
- `/terms`
- `/refund-policy`
- `/cancellation-policy`
- 11 service pages under `/services/{slug}`

Plus real `404` via `not-found.tsx`.

---

## 4. Exact final 11 services

1. Elder Care — `/services/elder-care`
2. Caregiver Services — `/services/caregiver-services`
3. Attendant Services — `/services/attendant-services`
4. Home Nursing — `/services/home-nursing`
5. 24×7 Nursing Care — `/services/24x7-nursing-care`
6. Post-Operative Care — `/services/post-operative-care`
7. Bedridden Patient Care — `/services/bedridden-patient-care`
8. Dementia Care — `/services/dementia-care`
9. Alzheimer’s Care — `/services/alzheimer-care` (preserves indexed slug)
10. Paralysis Care — `/services/paralysis-care`
11. Mother & Baby Care — `/services/mother-baby-care`

---

## 5. Redirect map summary

- **320** permanent **301** rules (see `REDIRECTS.md` + `src/data/redirects.ts`)
- Removed services → closest retained service
- City doorway URLs → `/`, `/contact`, or matching `/services/*`
- No redirect chains/loops by construction (single hop to retained targets)

---

## 6. Technical SEO implementation

- Central `SITE` + `COMPANY` + `SERVICES` config
- Unique titles/descriptions per page
- Self-referencing canonicals always on `https://carenesthomehealth.in`
- Auto `sitemap.xml` + gated `robots.txt`
- Breadcrumbs + JSON-LD (Organization / HomeHealthCareService / WebSite / Service / BreadcrumbList / FAQ where visible)
- Open Graph + Twitter cards
- Internal links: nav, footer, related services, CTAs
- `npm run seo:audit` fails build on critical issues (`prebuild`)

---

## 7. SEO audit results (`npm run seo:audit`)

- Indexable pages: **20**
- Service pages: **11**
- Critical issues: **0**
- Warnings: **0**

---

## 8. Sitemap

- URL (production): `https://carenesthomehealth.in/sitemap.xml`
- Count: **20**
- Hostname: production only (no vercel.app)

---

## 9. robots.txt

- Preview/local: `Disallow: /` (prevent accidental indexing)
- Vercel Production (`VERCEL_ENV=production`): Allow public pages; Disallow `/api/` and `/admin`
- Sitemap reference always production hostname

---

## 10. Schema implemented

- Organization
- HomeHealthCareService (local business style)
- WebSite
- Service (per service page)
- BreadcrumbList
- FAQPage (where FAQs are visible)

No fake ratings, reviews, prices, or credentials.

---

## 11. GA4 status

- Default ID in code: **G-2YMJF3VYZ2**
- Override: `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- Events: `page_view`, `phone_click`, `whatsapp_click`, `enquiry_submit`, `contact_submit`
- No PII/health payload fields

Verify in GA4 Realtime after Vercel deploy.

---

## 12. Form status

- `/api/enquiry` + `/api/contact` working locally with `FORM_DEV_ACCEPT`
- Production needs `RESEND_API_KEY`
- Honeypot + rate limit included
- Old AWS/Mongo backend **not** deleted

---

## 13. Mobile testing status

Verified locally:

- Homepage, 11 services, About, Contact, FAQ, legal, 404
- Mobile accordion services menu
- Desktop services dropdown (no hover gap; Escape; ARIA)
- Call/WhatsApp CTAs + mobile bottom bar
- Contact phone high-contrast block (`phone-emphasis`, royal on white, `tel:` link)

Browser device lab screenshots pending your Vercel preview review.

---

## 14. Lighthouse results (measured, mobile, local production server)

| Metric | Result |
|---|---|
| Performance | **0.96** |
| Accessibility | **1.00** |
| SEO | **0.69** (lab only — intentional `noindex` on non-production host) |
| LCP | **2.7 s** |
| CLS | **~0** |
| TBT | **80 ms** (lab proxy; INP not populated in this Lighthouse run) |

On `carenesthomehealth.in` production host, `is-crawlable` should pass and SEO score should rise accordingly.

---

## 15. Build size (measured from `.next/static`)

| Asset | Size |
|---|---|
| Total JS (all chunks on disk) | ~681 KB |
| Total CSS | ~38 KB |
| Hero image source | ~124 KB |
| Service images | ~92–124 KB each |

First-load JS for a single route is a subset of total chunk bytes (Next splits by route).

---

## 16. Remaining risks

1. **Resend not configured yet** — forms fail closed in production until `RESEND_API_KEY` is set
2. **Vercel project not created from this agent** — needs `VERCEL_TOKEN` or dashboard import
3. **GSC verification meta** — set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` if HTML tag verification is required
4. **Next 16 middleware deprecation warning** — still functional; can migrate to `proxy` later
5. **Old Emergent sitemap still live** — expected until cutover

---

## 17. Exact steps to move `carenesthomehealth.in` (ONLY after approval)

1. Confirm preview approved: `APPROVED FOR DOMAIN CUTOVER`
2. In the **new** Vercel project: add domain `carenesthomehealth.in` (+ `www` if desired)
3. In Cloudflare DNS: point apex/www to Vercel (do not touch `care` subdomain)
4. Set Vercel Production env: Resend + optional GSC verification
5. Confirm `VERCEL_ENV=production` deploy serves indexable `robots.txt`
6. Verify canonicals, sitemap (20 URLs), sample 301s, forms, GA4 realtime
7. Submit sitemap in Google Search Console
8. Keep Emergent/AWS online briefly as rollback until Search Console looks healthy
9. Only then decommission old host

**Do not** modify `care.carenesthomehealth.in` / `landing-page` project during cutover.
