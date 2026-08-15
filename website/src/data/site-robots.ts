/**
 * Indexing robots for HTML metadata.
 * Preview / local: noindex.
 * Vercel Production OR explicit NEXT_PUBLIC_ALLOW_INDEXING=true: index.
 *
 * Canonical URLs ALWAYS use https://carenesthomehealth.in regardless.
 * Middleware also sends X-Robots-Tag: noindex on non-production hosts.
 */
export function getRobotsDirective():
  | {
      index: true;
      follow: true;
      googleBot: {
        index: true;
        follow: true;
        "max-image-preview": "large";
        "max-snippet": number;
        "max-video-preview": number;
      };
    }
  | { index: false; follow: false } {
  const allowIndexing =
    process.env.VERCEL_ENV === "production" ||
    process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";

  if (!allowIndexing) {
    return { index: false, follow: false };
  }

  return {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  };
}
