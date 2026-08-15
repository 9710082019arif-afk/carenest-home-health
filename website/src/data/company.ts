/**
 * Central business details — do not duplicate across components.
 */

export const COMPANY = {
  name: "CareNest Home Health",
  short: "CareNest",
  legalName: "CareNest Home Health",
  phoneDisplay: "+91 91757 24546",
  phoneTel: "+919175724546",
  phoneDigits: "919175724546",
  whatsapp: "919175724546",
  email: "info@carenesthomehealth.in",
  website: "https://carenesthomehealth.in",
  tagline: "Care at home in Pune",
  description:
    "CareNest Home Health arranges professional home care support for families in Pune — nursing, caregiving, attendant support and specialised care coordination.",
  address: {
    locality: "Pune",
    region: "Maharashtra",
    country: "IN",
    areaServed: "Pune and surrounding areas",
  },
  /** Human-readable service area for UI */
  serviceArea: "Pune and nearby localities",
  socials: {
    instagram: "https://www.instagram.com/carenesthomehealth",
    facebook: "https://www.facebook.com/carenesthomehealth",
    linkedin: "https://www.linkedin.com/company/carenesthomehealth",
    youtube: "https://www.youtube.com/@carenesthomehealth",
  },
  logo: "/logo.svg",
  logoWordmark: "/logo-wordmark.svg",
  founder: {
    name: "Riya Shaikh",
    role: "Founder & Managing Director",
  },
} as const;

export const telHref = `tel:${COMPANY.phoneTel}`;
export const whatsappHref = (message?: string) => {
  const base = `https://wa.me/${COMPANY.whatsapp}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
};
