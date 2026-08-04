// Central SEO metadata helpers for CareNest Home Health.
import { COMPANY, SERVICES, LOCATIONS } from "@/data/content";

export const SITE_URL = COMPANY.website.replace(/\/$/, "");
export const DEFAULT_OG_IMAGE = `${SITE_URL}/brand-kit/social/hero-banner.jpg`;
export const DEFAULT_OG_IMAGE_ALT = "CareNest Home Health — premium home nursing and elder care across India";
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

// —— Static page SEO catalog ——
export const PAGE_SEO = {
  home: buildPageSeo({
    title: "CareNest Home Health · Premium Home Healthcare Services",
    description:
      "CareNest Home Health delivers premium home nursing, doctor-at-home, ICU-at-home, physiotherapy, caregivers and elder care across 12 Indian cities. 24×7 professional support at your doorstep.",
    path: "/",
    keywords:
      "home nursing, home healthcare India, doctor at home, ICU at home, physiotherapy at home, caregivers, elder care, Pune, Mumbai, Bengaluru, Hyderabad",
  }),
  about: buildPageSeo({
    title: "About CareNest Home Health",
    description:
      "Founded by Riya Shaikh, CareNest Home Health brings hospital-grade nursing, physicians and caregivers into Indian homes — with dignity, punctuality and a dedicated care manager per family.",
    path: "/about",
  }),
  services: buildPageSeo({
    title: "Home Healthcare Services — Nursing, ICU, Physio & More",
    description:
      "Explore 22 CareNest home healthcare services: home nursing, ICU-at-home, doctor visits, physiotherapy, elder care, palliative care, equipment rental and more across India.",
    path: "/services",
    keywords: "home healthcare services, home nursing, ICU at home, caregiver services, physiotherapy at home",
  }),
  pricing: buildPageSeo({
    title: "Home Healthcare Pricing — Transparent Rates",
    description:
      "View indicative CareNest rates for home nursing, caregivers, doctor-at-home, physiotherapy and more. No GST, no hidden charges. Free 10-minute consult for a written plan.",
    path: "/pricing",
  }),
  locations: buildPageSeo({
    title: "Home Healthcare Locations Across India",
    description:
      "CareNest Home Health serves Pune, Mumbai, Bengaluru, Hyderabad, Delhi NCR, Kolkata, Goa and more. Find local home nursing, ICU-at-home and elder care in your city.",
    path: "/locations",
    keywords: "home healthcare near me, home nursing Pune, home care Mumbai, elder care Bengaluru",
  }),
  book: buildPageSeo({
    title: "Book a Home Healthcare Appointment",
    description:
      "Book CareNest home nursing, doctor-at-home or caregiver services online. A care coordinator confirms within 15 minutes — same-day deployment across metros.",
    path: "/book-appointment",
  }),
  contact: buildPageSeo({
    title: "Contact CareNest Home Health",
    description:
      "Call, WhatsApp or email CareNest Home Health 24×7. Reach our care coordinators for home nursing, ICU setup, physiotherapy and elder care across India.",
    path: "/contact",
  }),
  faq: buildPageSeo({
    title: "Home Healthcare FAQ — CareNest Answers",
    description:
      "Answers to common questions about CareNest home nursing, pricing, insurance, emergencies, nurse qualifications and same-day deployment across India.",
    path: "/faq",
  }),
  gallery: buildPageSeo({
    title: "Care Gallery — Moments from Home Visits",
    description:
      "See CareNest Home Health in action — consented, anonymised moments from nursing, elder care, physiotherapy and ICU-at-home visits across India.",
    path: "/gallery",
  }),
  testimonials: buildPageSeo({
    title: "Patient & Family Testimonials",
    description:
      "Read real CareNest reviews from families in Pune, Mumbai, Bengaluru, Hyderabad and beyond — 4.9★ Google rating from 600+ reviews.",
    path: "/testimonials",
  }),
  blog: buildPageSeo({
    title: "Home Healthcare Blog & Care Guides",
    description:
      "Practical CareNest guides on bedsore prevention, post-stroke recovery, choosing attendants and more — written by our home-care team.",
    path: "/blog",
  }),
  careers: buildPageSeo({
    title: "Careers — Join CareNest Home Health",
    description:
      "Hiring nurses, ICU staff, caregivers, physiotherapists, doctors and care managers across India. Meaningful work with structured shifts and continuous training.",
    path: "/careers",
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
    description: "CareNest Home Health refund rules for deposits, deployments and medical equipment rentals.",
    path: "/refund-policy",
  }),
  cancellation: buildPageSeo({
    title: "Cancellation Policy",
    description: "How to cancel a CareNest booking and the timing rules for shift and long-term plan cancellations.",
    path: "/cancellation-policy",
  }),
  notFound: (() => {
    const base = buildPageSeo({
      title: "Page Not Found",
      description: "This CareNest page does not exist. Return home or browse our home healthcare services.",
      path: "/404",
      noindex: true,
    });
    // Omit canonical/og:url so unknown URLs are not marked as homepage duplicates.
    return { ...base, canonical: undefined, og: { ...base.og, url: undefined } };
  })(),
  admin: buildPageSeo({
    title: "Admin",
    description: "CareNest admin area.",
    path: "/admin",
    noindex: true,
  }),
};

export const serviceSeo = (svc) =>
  buildPageSeo({
    title: `${svc.name} at Home`,
    description: `${svc.name} at home by CareNest — ${svc.short} Available across 12 Indian cities with 24×7 care coordination. ${svc.rate ? `From ${svc.rate} ${svc.rateUnit}.` : ""}`,
    path: `/services/${svc.slug}`,
    keywords: `${svc.name}, ${svc.name} at home, home healthcare ${svc.name}, CareNest ${svc.name}`,
    imageAlt: `${svc.name} at home by CareNest Home Health`,
  });

export const locationSeo = (loc) =>
  buildPageSeo({
    title: `Home Healthcare in ${loc.name}`,
    description: `CareNest Home Health in ${loc.name}, ${loc.state} — home nursing, ICU-at-home, doctor visits, physiotherapy, caregivers and elder care with same-day deployment.`,
    path: `/locations/${loc.slug}`,
    keywords: `home healthcare ${loc.name}, home nursing ${loc.name}, ICU at home ${loc.name}, elder care ${loc.name}, caregiver ${loc.name}`,
    imageAlt: `Home healthcare services in ${loc.name} by CareNest`,
  });

export const cityServiceSeo = (svc, loc) =>
  buildPageSeo({
    title: `${svc.name} in ${loc.name}`,
    description: `${svc.name} at home in ${loc.name}, ${loc.state}. ${svc.short} Local CareNest care manager, verified professionals, same-day deployment.`,
    path: `/locations/${loc.slug}/${svc.slug}`,
    keywords: `${svc.name} ${loc.name}, ${svc.name} at home ${loc.name}, home healthcare ${loc.name}`,
    imageAlt: `${svc.name} at home in ${loc.name} — CareNest Home Health`,
  });

export const LEGAL_SEO = {
  "privacy-policy": PAGE_SEO.privacy,
  terms: PAGE_SEO.terms,
  "refund-policy": PAGE_SEO.refund,
  "cancellation-policy": PAGE_SEO.cancellation,
};

/** All public indexable paths (for sitemap generation). */
export const getAllPublicPaths = () => {
  const staticPaths = [
    { path: "/", priority: "1.0", changefreq: "weekly" },
    { path: "/about", priority: "0.8", changefreq: "monthly" },
    { path: "/services", priority: "0.9", changefreq: "weekly" },
    { path: "/pricing", priority: "0.8", changefreq: "weekly" },
    { path: "/locations", priority: "0.9", changefreq: "weekly" },
    { path: "/book-appointment", priority: "0.8", changefreq: "monthly" },
    { path: "/contact", priority: "0.8", changefreq: "monthly" },
    { path: "/faq", priority: "0.8", changefreq: "monthly" },
    { path: "/gallery", priority: "0.6", changefreq: "monthly" },
    { path: "/testimonials", priority: "0.7", changefreq: "monthly" },
    { path: "/blog", priority: "0.7", changefreq: "weekly" },
    { path: "/careers", priority: "0.6", changefreq: "monthly" },
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
    priority: "0.9",
    changefreq: "weekly",
  }));
  const cityServicePaths = LOCATIONS.flatMap((l) =>
    SERVICES.map((s) => ({
      path: `/locations/${l.slug}/${s.slug}`,
      priority: "0.8",
      changefreq: "weekly",
    }))
  );
  return [...staticPaths, ...servicePaths, ...locationPaths, ...cityServicePaths];
};
