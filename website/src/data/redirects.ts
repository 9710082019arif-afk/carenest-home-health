/**
 * Permanent 301 redirect map for SEO-safe migration.
 * Live production (Emergent) still indexes many legacy URLs.
 *
 * Rules:
 * - Retained services keep their existing slugs (no redirect).
 * - Removed services → closest semantically related retained service.
 * - Location/city doorways → Pune focus or matching service page.
 * - No chains, no loops, no blanket homepage dumps for valuable service URLs.
 */

import { SERVICE_SLUGS, type ServiceSlug } from "./services";

/** Removed / legacy service slug → retained canonical service slug */
export const REMOVED_SERVICE_REDIRECTS: Record<string, ServiceSlug> = {
  "icu-at-home": "24x7-nursing-care",
  "critical-care": "24x7-nursing-care",
  "ventilator-support": "24x7-nursing-care",
  "tracheostomy-care": "home-nursing",
  "injection-dressing": "home-nursing",
  "doctor-at-home": "home-nursing",
  "palliative-care": "bedridden-patient-care",
  "cancer-patient-care": "bedridden-patient-care",
  "stroke-rehabilitation": "paralysis-care",
  "physiotherapy-at-home": "paralysis-care",
  "medical-equipment-rental": "home-nursing",
  /** Introduced briefly on simplified main; not in approved 11 */
  "patient-care": "bedridden-patient-care",
  /** Alternate spelling → indexed slug */
  "alzheimers-care": "alzheimer-care",
};

export const PAGE_REDIRECTS: Record<string, string> = {
  "/pricing": "/services",
  "/book-appointment": "/contact",
  "/gallery": "/",
  "/testimonials": "/",
  "/blog": "/",
  "/careers": "/about",
  "/locations": "/",
};

/** Cities that appeared in the live sitemap */
export const LEGACY_CITIES = [
  "pune",
  "pimpri-chinchwad",
  "mumbai",
  "navi-mumbai",
  "thane",
  "bengaluru",
  "hyderabad",
  "delhi-ncr",
  "ranchi",
  "bhubaneswar",
  "kolkata",
  "goa",
] as const;

/** All service slugs that existed on the live site (retained + removed) */
export const LEGACY_SERVICE_SLUGS = [
  ...SERVICE_SLUGS,
  ...Object.keys(REMOVED_SERVICE_REDIRECTS).filter((s) => s !== "alzheimers-care" && s !== "patient-care"),
] as const;

export function resolveServiceSlug(slug: string): ServiceSlug | null {
  if ((SERVICE_SLUGS as readonly string[]).includes(slug)) return slug as ServiceSlug;
  if (REMOVED_SERVICE_REDIRECTS[slug]) return REMOVED_SERVICE_REDIRECTS[slug];
  return null;
}

export type RedirectRule = { source: string; destination: string; statusCode: 301 };

/**
 * Build complete Next.js redirect list (HTTP 301).
 * City×service URLs map to the national/service page (Pune-first site).
 * Non-Pune city hubs redirect to contact; Pune hub redirects to home.
 */
export function buildRedirectRules(): RedirectRule[] {
  const rules: RedirectRule[] = [];
  const seen = new Set<string>();

  const add = (source: string, destination: string) => {
    if (seen.has(source) || source === destination) return;
    seen.add(source);
    rules.push({ source, destination, statusCode: 301 });
  };

  Object.entries(PAGE_REDIRECTS).forEach(([from, to]) => add(from, to));

  Object.entries(REMOVED_SERVICE_REDIRECTS).forEach(([fromSlug, toSlug]) => {
    add(`/services/${fromSlug}`, `/services/${toSlug}`);
  });

  for (const city of LEGACY_CITIES) {
    add(`/locations/${city}`, city === "pune" ? "/" : "/contact");

    for (const legacySlug of LEGACY_SERVICE_SLUGS) {
      const resolved = resolveServiceSlug(legacySlug);
      if (!resolved) continue;
      add(`/locations/${city}/${legacySlug}`, `/services/${resolved}`);
    }

    // Also map removed aliases under locations
    Object.entries(REMOVED_SERVICE_REDIRECTS).forEach(([fromSlug, toSlug]) => {
      add(`/locations/${city}/${fromSlug}`, `/services/${toSlug}`);
    });
  }

  return rules;
}

/** Human-readable redirect documentation for delivery report */
export function getRedirectSummary() {
  return {
    retainedServices: [...SERVICE_SLUGS],
    removedServiceRedirects: { ...REMOVED_SERVICE_REDIRECTS },
    pageRedirects: { ...PAGE_REDIRECTS },
    locationStrategy:
      "All /locations/* URLs 301 to Home (Pune), Contact, or the matching /services/* page. No thin city doorway pages.",
    totalRules: buildRedirectRules().length,
  };
}
