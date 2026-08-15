/**
 * Central site configuration — single source of truth for production hostname,
 * indexing rules, and shared SEO defaults.
 */

export const SITE = {
  name: "CareNest Home Health",
  shortName: "CareNest",
  /** Always use this hostname for canonicals and sitemap — never preview URLs */
  url: "https://carenesthomehealth.in",
  locale: "en_IN",
  language: "en-IN",
  gaMeasurementId: "G-2YMJF3VYZ2",
  defaultOgImage: "/brand-kit/social/hero-banner.jpg",
  themeColor: "#0D3B66",
} as const;

export { getRobotsDirective } from "./site-robots";

export const absoluteUrl = (path = "/") => {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (clean === "/") return `${SITE.url}/`;
  return `${SITE.url}${clean.replace(/\/$/, "")}`;
};
