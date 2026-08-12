# CareNest URL migration / redirect map

Production hostname: `https://carenesthomehealth.in`

Generated at runtime by `src/data/redirects.ts` → `next.config.ts` `redirects()` (HTTP 301).

## Retained indexable service URLs (11)

| Service | Canonical URL |
|---|---|
| Elder Care | `/services/elder-care` |
| Caregiver Services | `/services/caregiver-services` |
| Attendant Services | `/services/attendant-services` |
| Home Nursing | `/services/home-nursing` |
| 24×7 Nursing Care | `/services/24x7-nursing-care` |
| Post-Operative Care | `/services/post-operative-care` |
| Bedridden Patient Care | `/services/bedridden-patient-care` |
| Dementia Care | `/services/dementia-care` |
| Alzheimer’s Care | `/services/alzheimer-care` |
| Paralysis Care | `/services/paralysis-care` |
| Mother & Baby Care | `/services/mother-baby-care` |

Note: Alzheimer’s keeps the **indexed** slug `alzheimer-care`. `/services/alzheimers-care` → 301 → `/services/alzheimer-care`.

## Removed services → closest retained targets

| Old URL | 301 → |
|---|---|
| `/services/icu-at-home` | `/services/24x7-nursing-care` |
| `/services/critical-care` | `/services/24x7-nursing-care` |
| `/services/ventilator-support` | `/services/24x7-nursing-care` |
| `/services/tracheostomy-care` | `/services/home-nursing` |
| `/services/injection-dressing` | `/services/home-nursing` |
| `/services/doctor-at-home` | `/services/home-nursing` |
| `/services/medical-equipment-rental` | `/services/home-nursing` |
| `/services/palliative-care` | `/services/bedridden-patient-care` |
| `/services/cancer-patient-care` | `/services/bedridden-patient-care` |
| `/services/patient-care` | `/services/bedridden-patient-care` |
| `/services/stroke-rehabilitation` | `/services/paralysis-care` |
| `/services/physiotherapy-at-home` | `/services/paralysis-care` |

## Secondary pages

| Old URL | 301 → |
|---|---|
| `/pricing` | `/services` |
| `/book-appointment` | `/contact` |
| `/gallery` | `/` |
| `/testimonials` | `/` |
| `/blog` | `/` |
| `/careers` | `/about` |
| `/locations` | `/` |

## Location / city doorways

Live production indexed many `/locations/{city}` and `/locations/{city}/{service}` URLs.

Strategy (Pune-first, no thin doorway pages):

- `/locations/pune` → `/`
- `/locations/{other-city}` → `/contact`
- `/locations/{city}/{service}` → `/services/{resolved-service}`

Cities covered: pune, pimpri-chinchwad, mumbai, navi-mumbai, thane, bengaluru, hyderabad, delhi-ncr, ranchi, bhubaneswar, kolkata, goa.

## Indexable pages on the new site

- `/`
- `/about`
- `/services`
- `/services/{11 slugs}`
- `/contact`
- `/faq`
- `/privacy-policy`
- `/terms`
- `/refund-policy`
- `/cancellation-policy`

Sitemap: `https://carenesthomehealth.in/sitemap.xml` (auto-generated; production hostname only).
