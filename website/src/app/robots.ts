import type { MetadataRoute } from "next";
import { SITE } from "@/data/site";

export default function robots(): MetadataRoute.Robots {
  const vercelEnv = process.env.VERCEL_ENV;
  const allowIndex =
    vercelEnv === "production" || process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";

  // Preview / non-production: disallow all to prevent duplicate indexing
  if (!allowIndex) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
      // Still reference production sitemap for operators; preview itself stays closed
      sitemap: `${SITE.url}/sitemap.xml`,
      host: SITE.url,
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin", "/admin/"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/api/", "/admin", "/admin/"],
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
