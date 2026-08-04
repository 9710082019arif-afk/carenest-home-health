// JSON-LD schema helpers for SEO rich results (Home Health Care, LocalBusiness, FAQ, Services).
import React from "react";
import { COMPANY, SERVICES, LOCATIONS, FAQS, TESTIMONIALS } from "@/data/content";

const SITE = COMPANY.website.replace(/\/$/, "");

const safeJsonForScript = (obj) =>
  JSON.stringify(obj)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");

const jsonLd = (obj) => safeJsonForScript(obj);

const NAP = {
  telephone: COMPANY.phone,
  email: COMPANY.email,
  url: SITE,
  priceRange: "₹₹",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Head Office",
    addressLocality: "Pune",
    addressRegion: "Maharashtra",
    postalCode: "411001",
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 18.5204,
    longitude: 73.8567,
  },
  sameAs: [
    COMPANY.socials.instagram,
    COMPANY.socials.facebook,
    COMPANY.socials.linkedin,
    COMPANY.socials.youtube,
  ],
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    opens: "00:00",
    closes: "23:59",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    bestRating: "5",
    worstRating: "1",
    reviewCount: "612",
  },
};

const areaServed = LOCATIONS.map((l) => ({
  "@type": "City",
  name: l.name,
  containedInPlace: {
    "@type": "State",
    name: l.state,
  },
}));

const offerCatalog = {
  "@type": "OfferCatalog",
  name: "CareNest Home Healthcare Services",
  itemListElement: SERVICES.map((s, i) => ({
    "@type": "OfferCatalog",
    name: s.name,
    position: i + 1,
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: s.name,
          description: s.short,
          url: `${SITE}/services/${s.slug}`,
          provider: { "@id": `${SITE}/#organization` },
          areaServed,
          ...(s.rate
            ? {
                offers: {
                  "@type": "Offer",
                  priceCurrency: "INR",
                  description: `${s.rate} ${s.rateUnit}`,
                  availability: "https://schema.org/InStock",
                },
              }
            : {}),
        },
      },
    ],
  })),
};

/** Primary organization — HomeHealthCareService + LocalBusiness + MedicalBusiness */
export const organizationSchema = () =>
  jsonLd({
    "@context": "https://schema.org",
    "@type": ["HomeHealthCareService", "MedicalBusiness", "LocalBusiness"],
    "@id": `${SITE}/#organization`,
    name: COMPANY.name,
    alternateName: COMPANY.short,
    description:
      "Premium home healthcare across India — home nursing, doctor-at-home, ICU-at-home, physiotherapy, caregivers and elder care with 24×7 care coordination.",
    image: `${SITE}/brand-kit/social/hero-banner.jpg`,
    logo: {
      "@type": "ImageObject",
      url: `${SITE}/brand-kit/logo/logo-icon-512.png`,
      width: 512,
      height: 512,
    },
    ...NAP,
    areaServed,
    hasOfferCatalog: offerCatalog,
    medicalSpecialty: [
      "Nursing",
      "Physiotherapy",
      "Geriatric Care",
      "Palliative Care",
      "Critical Care",
    ],
    foundingDate: "2020",
    founder: {
      "@type": "Person",
      name: "Riya Shaikh",
      jobTitle: "Founder & Managing Director",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: COMPANY.phone,
        contactType: "customer service",
        areaServed: "IN",
        availableLanguage: ["English", "Hindi", "Marathi"],
        contactOption: "TollFree",
      },
      {
        "@type": "ContactPoint",
        telephone: COMPANY.phone,
        contactType: "emergency",
        areaServed: "IN",
        availableLanguage: ["English", "Hindi"],
      },
    ],
  });

/** WebSite schema (no SearchAction — site has no on-site search UI) */
export const websiteSchema = () =>
  jsonLd({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE}/#website`,
    url: SITE,
    name: COMPANY.name,
    description: COMPANY.tagline,
    publisher: { "@id": `${SITE}/#organization` },
    inLanguage: "en-IN",
  });

/** ItemList of all services for the services index page */
export const servicesListSchema = () =>
  jsonLd({
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "CareNest Home Healthcare Services",
    description: "Complete catalogue of home healthcare services offered by CareNest Home Health.",
    numberOfItems: SERVICES.length,
    itemListElement: SERVICES.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: s.name,
      url: `${SITE}/services/${s.slug}`,
      item: {
        "@type": "Service",
        name: s.name,
        description: s.short,
        provider: { "@id": `${SITE}/#organization` },
        url: `${SITE}/services/${s.slug}`,
      },
    })),
  });

/** OfferCatalog schema for homepage / services */
export const offerCatalogSchema = () =>
  jsonLd({
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: "CareNest Home Healthcare Services",
    url: `${SITE}/services`,
    provider: { "@id": `${SITE}/#organization` },
    numberOfItems: SERVICES.length,
    itemListElement: SERVICES.map((s, i) => ({
      "@type": "Offer",
      position: i + 1,
      name: s.name,
      description: s.short,
      url: `${SITE}/services/${s.slug}`,
      category: s.category,
      ...(s.rate
        ? {
            priceSpecification: {
              "@type": "PriceSpecification",
              priceCurrency: "INR",
              description: `${s.rate} ${s.rateUnit}`,
            },
          }
        : {}),
      itemOffered: {
        "@type": "Service",
        "@id": `${SITE}/services/${s.slug}#service`,
        name: s.name,
        description: s.short,
        provider: { "@id": `${SITE}/#organization` },
      },
    })),
  });

export const faqPageSchema = (faqs = FAQS) =>
  jsonLd({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  });

export const breadcrumbSchema = (crumbs) =>
  jsonLd({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      ...(c.to ? { item: `${SITE}${c.to}` } : {}),
    })),
  });

/** Individual service page — Service + MedicalTherapy */
export const serviceSchema = ({ name, description, path, rate, rateUnit, rating = 4.9, reviewCount = 612 }) =>
  jsonLd({
    "@context": "https://schema.org",
    "@type": ["Service", "MedicalTherapy"],
    "@id": `${SITE}${path}#service`,
    name,
    description,
    url: `${SITE}${path}`,
    provider: { "@id": `${SITE}/#organization` },
    areaServed,
    serviceType: "Home Healthcare",
    category: "Home Health Care",
    ...(rate
      ? {
          offers: {
            "@type": "Offer",
            priceCurrency: "INR",
            description: `${rate} ${rateUnit || ""}`.trim(),
            availability: "https://schema.org/InStock",
            url: `${SITE}${path}`,
          },
        }
      : {}),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: String(rating),
      bestRating: "5",
      worstRating: "1",
      reviewCount: String(reviewCount),
    },
  });

/** City hub — LocalBusiness serving that city */
export const locationBusinessSchema = (loc) =>
  jsonLd({
    "@context": "https://schema.org",
    "@type": ["HomeHealthCareService", "MedicalBusiness", "LocalBusiness"],
    "@id": `${SITE}/locations/${loc.slug}#localbusiness`,
    name: `CareNest Home Health — ${loc.name}`,
    description: `Premium home healthcare in ${loc.name}, ${loc.state}. Home nursing, ICU-at-home, doctor visits, physiotherapy, caregivers and elder care with same-day deployment.`,
    url: `${SITE}/locations/${loc.slug}`,
    image: `${SITE}/brand-kit/social/hero-banner.jpg`,
    telephone: COMPANY.phone,
    email: COMPANY.email,
    priceRange: "₹₹",
    parentOrganization: { "@id": `${SITE}/#organization` },
    address: {
      "@type": "PostalAddress",
      addressLocality: loc.name,
      addressRegion: loc.state,
      addressCountry: "IN",
    },
    areaServed: {
      "@type": "City",
      name: loc.name,
      containedInPlace: { "@type": "State", name: loc.state },
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `Home Healthcare Services in ${loc.name}`,
      itemListElement: SERVICES.slice(0, 12).map((s, i) => ({
        "@type": "Offer",
        position: i + 1,
        name: `${s.name} in ${loc.name}`,
        url: `${SITE}/locations/${loc.slug}/${s.slug}`,
        itemOffered: {
          "@type": "Service",
          name: s.name,
          description: s.short,
        },
      })),
    },
    openingHoursSpecification: NAP.openingHoursSpecification,
    aggregateRating: NAP.aggregateRating,
    sameAs: NAP.sameAs,
  });

/** City × service landing page */
export const cityServiceSchema = ({ svc, loc }) =>
  jsonLd({
    "@context": "https://schema.org",
    "@type": ["Service", "MedicalBusiness"],
    "@id": `${SITE}/locations/${loc.slug}/${svc.slug}#service`,
    name: `${svc.name} in ${loc.name}`,
    description: `${svc.name} at home in ${loc.name}. ${svc.short}`,
    url: `${SITE}/locations/${loc.slug}/${svc.slug}`,
    provider: { "@id": `${SITE}/#organization` },
    areaServed: {
      "@type": "City",
      name: loc.name,
      containedInPlace: { "@type": "State", name: loc.state },
    },
    serviceType: svc.name,
    medicalSpecialty: svc.name,
    telephone: COMPANY.phone,
    email: COMPANY.email,
    ...(svc.rate
      ? {
          offers: {
            "@type": "Offer",
            priceCurrency: "INR",
            description: `${svc.rate} ${svc.rateUnit}`,
            availability: "https://schema.org/InStock",
          },
        }
      : {}),
    aggregateRating: NAP.aggregateRating,
  });

/** Locations index ItemList */
export const locationsListSchema = () =>
  jsonLd({
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "CareNest Home Health Service Locations",
    description: "Cities across India where CareNest provides home healthcare.",
    numberOfItems: LOCATIONS.length,
    itemListElement: LOCATIONS.map((l, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: l.name,
      url: `${SITE}/locations/${l.slug}`,
    })),
  });

/** Review / testimonial schema */
export const reviewsSchema = (reviews = TESTIMONIALS) =>
  jsonLd({
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE}/#organization`,
    name: COMPANY.name,
    aggregateRating: NAP.aggregateRating,
    review: reviews.map((t) => ({
      "@type": "Review",
      author: { "@type": "Person", name: t.name },
      reviewBody: t.text,
      reviewRating: {
        "@type": "Rating",
        ratingValue: String(t.rating),
        bestRating: "5",
      },
      locationCreated: { "@type": "City", name: t.city },
    })),
  });

/** ContactPage schema */
export const contactPageSchema = () =>
  jsonLd({
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact CareNest Home Health",
    url: `${SITE}/contact`,
    mainEntity: { "@id": `${SITE}/#organization` },
  });

/** AboutPage schema */
export const aboutPageSchema = () =>
  jsonLd({
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About CareNest Home Health",
    url: `${SITE}/about`,
    mainEntity: { "@id": `${SITE}/#organization` },
  });

export const JsonLd = ({ data }) => (
  <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: data }} />
);
