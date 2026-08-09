/**
 * Permanent (301) redirect map for CareNest simplification.
 * Keep in sync with deploy/nginx/redirects.map and generate-sitemap.js.
 *
 * Primary services:
 *   /services/home-nursing          → Nursing Care
 *   /services/patient-care          → Patient Care (new canonical)
 *   /services/elder-care            → Elder Care & Companionship
 */

/** Old service slug → primary service slug */
export const SERVICE_REDIRECTS = {
  // → Nursing Care
  "24x7-nursing-care": "home-nursing",
  "injection-dressing": "home-nursing",
  "post-operative-care": "home-nursing",
  "tracheostomy-care": "home-nursing",
  "ventilator-support": "home-nursing",
  "icu-at-home": "home-nursing",
  "critical-care": "home-nursing",

  // → Patient Care (new canonical)
  "bedridden-patient-care": "patient-care",
  "cancer-patient-care": "patient-care",
  "palliative-care": "patient-care",
  "stroke-rehabilitation": "patient-care",
  "paralysis-care": "patient-care",
  "physiotherapy-at-home": "patient-care",
  "doctor-at-home": "patient-care",
  "medical-equipment-rental": "patient-care",

  // → Elder Care & Companionship
  "caregiver-services": "elder-care",
  "attendant-services": "elder-care",
  "dementia-care": "elder-care",
  "alzheimer-care": "elder-care",
  "mother-baby-care": "elder-care",
};

/** Secondary marketing pages → keep-site destinations */
export const PAGE_REDIRECTS = {
  "/pricing": "/services",
  "/book-appointment": "/contact",
  "/gallery": "/",
  "/testimonials": "/",
  "/blog": "/",
  "/careers": "/about",
};

/** Resolve a service slug to its primary canonical slug (identity if already primary). */
export const resolvePrimaryServiceSlug = (slug) => {
  if (!slug) return null;
  if (SERVICE_REDIRECTS[slug]) return SERVICE_REDIRECTS[slug];
  return slug;
};

/** Flat list of path→path redirects for nginx / SPA (services + secondary pages). */
export const getAllPathRedirects = () => {
  const out = [];

  Object.entries(PAGE_REDIRECTS).forEach(([from, to]) => {
    out.push({ from, to });
  });

  Object.entries(SERVICE_REDIRECTS).forEach(([fromSlug, toSlug]) => {
    out.push({ from: `/services/${fromSlug}`, to: `/services/${toSlug}` });
  });

  return out;
};
