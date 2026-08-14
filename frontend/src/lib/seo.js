// Central SEO metadata helpers for CareNest Home Health.
import { COMPANY, SERVICES, LOCATIONS, SERVICE_PAGE_CONTENT } from "@/data/content";

export const SITE_URL = COMPANY.website.replace(/\/$/, "");
export const DEFAULT_OG_IMAGE = `${SITE_URL}/brand-kit/social/hero-banner.jpg`;
export const DEFAULT_OG_IMAGE_ALT = "CareNest Home Health — nursing, patient and elder care at home in Pune";
export const TWITTER_HANDLE = "@carenesthomehealth";
export const SITE_NAME = COMPANY.name;
export const DEFAULT_ROBOTS = "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1";

const truncate = (str, max = 155) => {
  if (!str) return "";
  const clean = str.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).replace(/\s+\S*$/, "")}…`;
};

export const absoluteUrl = (path = "/") => {
  if (!path || path === "/") return `${SITE_URL}/`;
  if (path.startsWith("http")) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
};

export const absoluteImage = (src) => {
  if (!src) return DEFAULT_OG_IMAGE;
  if (src.startsWith("http")) return src;
  return `${SITE_URL}${src.startsWith("/") ? src : `/${src}`}`;
};

/** Build a full SEO payload for SEOHead. */
export const buildPageSeo = ({
  title,
  description,
  path = "/",
  image,
  imageAlt,
  type = "website",
  noindex = false,
  keywords,
}) => {
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} · ${SITE_NAME}`;
  const desc = truncate(description, 160);
  const url = absoluteUrl(path);
  const ogImage = absoluteImage(image);
  return {
    title: fullTitle,
    description: desc,
    canonical: url,
    keywords: keywords || undefined,
    robots: noindex ? "noindex,nofollow" : DEFAULT_ROBOTS,
    og: {
      type,
      siteName: SITE_NAME,
      title: fullTitle,
      description: desc,
      url,
      image: ogImage,
      imageAlt: imageAlt || DEFAULT_OG_IMAGE_ALT,
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: desc,
      image: ogImage,
      imageAlt: imageAlt || DEFAULT_OG_IMAGE_ALT,
      site: TWITTER_HANDLE,
    },
  };
};

export const PAGE_SEO = {
  home: buildPageSeo({
    title: "Care at Home in Pune · CareNest Home Health",
    description:
      "CareNest Home Health provides Nursing Care, Patient Care, and Elder Care & Companionship at home in Pune. Call or WhatsApp for a free care consult.",
    path: "/",
    keywords: "home nursing Pune, patient care at home Pune, elder care Pune, CareNest Home Health",
  }),
  about: buildPageSeo({
    title: "About CareNest Home Health",
    description:
      "Founded by Riya Shaikh, CareNest brings Nursing Care, Patient Care and Elder Care & Companionship into homes — with dignity and clear coordination in Pune.",
    path: "/about",
  }),
  services: buildPageSeo({
    title: "Home Healthcare Services — Nursing, Patient & Elder Care",
    description:
      "Explore CareNest’s three primary services: Nursing Care, Patient Care, and Elder Care & Companionship at home in Pune.",
    path: "/services",
    keywords: "home nursing, patient care at home, elder care companionship, CareNest services Pune",
  }),
  locations: buildPageSeo({
    title: "CareNest Locations — Pune Primary",
    description:
      "Pune is CareNest’s primary service area. Browse city pages for Nursing Care, Patient Care and Elder Care & Companionship enquiries.",
    path: "/locations",
    keywords: "home healthcare Pune, home nursing Pune, elder care Pune",
  }),
  contact: buildPageSeo({
    title: "Contact CareNest Home Health",
    description:
      "Call, WhatsApp or message CareNest for Nursing Care, Patient Care and Elder Care & Companionship in Pune.",
    path: "/contact",
  }),
  faq: buildPageSeo({
    title: "Home Healthcare FAQ",
    description:
      "Answers about CareNest nursing, patient care, elder companionship, pricing and how care starts in Pune.",
    path: "/faq",
  }),
  privacy: buildPageSeo({
    title: "Privacy Policy",
    description: "How CareNest Home Health collects, uses and protects your personal and care-related information.",
    path: "/privacy-policy",
  }),
  terms: buildPageSeo({
    title: "Terms & Conditions",
    description: "Terms governing CareNest Home Health services, payments, limitations and governing law in India.",
    path: "/terms",
  }),
  refund: buildPageSeo({
    title: "Refund Policy",
    description: "CareNest Home Health refund rules for deposits and deployments.",
    path: "/refund-policy",
  }),
  cancellation: buildPageSeo({
    title: "Cancellation Policy",
    description: "How to cancel a CareNest booking and timing rules for shift cancellations.",
    path: "/cancellation-policy",
  }),
  notFound: (() => {
    const base = buildPageSeo({
      title: "Page Not Found",
      description: "This CareNest page does not exist. Return home or browse our home healthcare services.",
      path: "/404",
      noindex: true,
    });
    return { ...base, canonical: undefined, og: { ...base.og, url: undefined } };
  })(),
  admin: buildPageSeo({
    title: "Admin",
    description: "CareNest admin area.",
    path: "/admin",
    noindex: true,
  }),
};

export const serviceSeo = (svc) => {
  const long = SERVICE_PAGE_CONTENT?.[svc.slug]?.overview;
  return buildPageSeo({
    title: `${svc.name} at Home in Pune`,
    description:
      long ||
      `${svc.name} at home by CareNest — ${svc.short} ${svc.rate ? `From ${svc.rate} ${svc.rateUnit}.` : ""}`,
    path: `/services/${svc.slug}`,
    keywords: `${svc.name}, ${svc.name} Pune, home healthcare ${svc.name}, CareNest`,
    imageAlt: `${svc.name} at home by CareNest Home Health`,
  });
};

export const locationSeo = (loc) =>
  buildPageSeo({
    title: `Home Healthcare in ${loc.name}`,
    description: `CareNest Nursing Care, Patient Care and Elder Care & Companionship in ${loc.name}, ${loc.state}. Enquire for availability — Pune is our primary service area.`,
    path: `/locations/${loc.slug}`,
    keywords: `home healthcare ${loc.name}, home nursing ${loc.name}, elder care ${loc.name}`,
    imageAlt: `Home healthcare services in ${loc.name} by CareNest`,
  });

export const cityServiceSeo = (svc, loc) =>
  buildPageSeo({
    title: `${svc.name} in ${loc.name}`,
    description: `${svc.name} at home in ${loc.name}, ${loc.state}. ${svc.short}`,
    path: `/locations/${loc.slug}/${svc.slug}`,
    keywords: `${svc.name} ${loc.name}, ${svc.name} at home ${loc.name}`,
    imageAlt: `${svc.name} at home in ${loc.name} — CareNest Home Health`,
  });

export const LEGAL_SEO = {
  "privacy-policy": PAGE_SEO.privacy,
  terms: PAGE_SEO.terms,
  "refund-policy": PAGE_SEO.refund,
  "cancellation-policy": PAGE_SEO.cancellation,
};

/** Indexable paths for sitemap (primaries only; redirected URLs omitted). */
export const getAllPublicPaths = () => {
  const staticPaths = [
    { path: "/", priority: "1.0", changefreq: "weekly" },
    { path: "/about", priority: "0.8", changefreq: "monthly" },
    { path: "/services", priority: "0.9", changefreq: "weekly" },
    { path: "/locations", priority: "0.7", changefreq: "monthly" },
    { path: "/contact", priority: "0.8", changefreq: "monthly" },
    { path: "/faq", priority: "0.6", changefreq: "monthly" },
    { path: "/privacy-policy", priority: "0.3", changefreq: "yearly" },
    { path: "/terms", priority: "0.3", changefreq: "yearly" },
    { path: "/refund-policy", priority: "0.3", changefreq: "yearly" },
    { path: "/cancellation-policy", priority: "0.3", changefreq: "yearly" },
  ];
  const servicePaths = SERVICES.map((s) => ({
    path: `/services/${s.slug}`,
    priority: "0.9",
    changefreq: "weekly",
  }));
  const locationPaths = LOCATIONS.map((l) => ({
    path: `/locations/${l.slug}`,
    priority: l.slug === "pune" ? "0.9" : "0.6",
    changefreq: "monthly",
  }));
  const cityServicePaths = LOCATIONS.flatMap((l) =>
    SERVICES.map((s) => ({
      path: `/locations/${l.slug}/${s.slug}`,
      priority: l.slug === "pune" ? "0.8" : "0.5",
      changefreq: "monthly",
    }))
  );
  return [...staticPaths, ...servicePaths, ...locationPaths, ...cityServicePaths];
};
