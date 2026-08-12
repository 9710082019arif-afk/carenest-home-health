import { COMPANY } from "@/data/company";
import { SITE, absoluteUrl } from "@/data/site";
import type { ServiceContent, ServiceFAQ } from "@/data/services";

export type Crumb = { name: string; path: string };

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: COMPANY.name,
    url: SITE.url,
    logo: absoluteUrl(COMPANY.logo),
    email: COMPANY.email,
    telephone: COMPANY.phoneTel,
    sameAs: Object.values(COMPANY.socials),
  };
}

export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "HomeHealthCareService",
    name: COMPANY.name,
    description: COMPANY.description,
    url: SITE.url,
    image: absoluteUrl(SITE.defaultOgImage),
    telephone: COMPANY.phoneTel,
    email: COMPANY.email,
    areaServed: {
      "@type": "City",
      name: COMPANY.address.locality,
      containedInPlace: {
        "@type": "State",
        name: COMPANY.address.region,
      },
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: COMPANY.address.locality,
      addressRegion: COMPANY.address.region,
      addressCountry: COMPANY.address.country,
    },
    parentOrganization: {
      "@type": "Organization",
      name: COMPANY.name,
    },
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: COMPANY.name,
    url: SITE.url,
    inLanguage: SITE.language,
    publisher: {
      "@type": "Organization",
      name: COMPANY.name,
    },
  };
}

export function breadcrumbSchema(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  };
}

export function serviceSchema(service: ServiceContent) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.summary,
    url: absoluteUrl(`/services/${service.slug}`),
    image: absoluteUrl(service.image),
    provider: {
      "@type": "HomeHealthCareService",
      name: COMPANY.name,
      telephone: COMPANY.phoneTel,
      url: SITE.url,
    },
    areaServed: {
      "@type": "City",
      name: "Pune",
    },
    serviceType: service.name,
  };
}

export function faqSchema(faqs: ServiceFAQ[]) {
  if (!faqs.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };
}
