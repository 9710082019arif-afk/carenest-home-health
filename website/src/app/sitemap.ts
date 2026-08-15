import type { MetadataRoute } from "next";
import { SERVICE_SLUGS } from "@/data/services";
import { SITE, absoluteUrl } from "@/data/site";

/** Automatic sitemap — production hostname only: https://carenesthomehealth.in */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticRoutes = [
    "/",
    "/about",
    "/services",
    "/contact",
    "/faq",
    "/privacy-policy",
    "/terms",
    "/refund-policy",
    "/cancellation-policy",
  ];

  const entries: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
    url: absoluteUrl(path),
    lastModified,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path.startsWith("/services") ? 0.9 : 0.7,
  }));

  for (const slug of SERVICE_SLUGS) {
    entries.push({
      url: absoluteUrl(`/services/${slug}`),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    });
  }

  // Guarantee production hostname only
  return entries.map((e) => ({
    ...e,
    url: e.url.replace(/^https?:\/\/[^/]+/, SITE.url),
  }));
}
