// JSON-LD schema helpers for SEO rich results.

const SITE = "https://javahomecare.in";

const jsonLd = (obj) => JSON.stringify(obj, null, 0);

export const faqPageSchema = (faqs) => jsonLd({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
});

export const breadcrumbSchema = (crumbs) => jsonLd({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: crumbs.map((c, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: c.label,
    item: c.to ? `${SITE}${c.to}` : undefined,
  })),
});

export const serviceSchema = ({ name, description, path, rating = 4.9, reviewCount = 612 }) => jsonLd({
  "@context": "https://schema.org",
  "@type": "MedicalTherapy",
  name,
  description,
  url: `${SITE}${path}`,
  provider: {
    "@type": "MedicalBusiness",
    name: "CareNest Home Health",
    telephone: "+91 9175724546",
    email: "info@javahomecare.in",
    url: SITE,
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: rating,
    reviewCount,
  },
});

export const cityServiceSchema = ({ svc, loc }) => jsonLd({
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  name: `CareNest Home Health — ${svc.name} in ${loc.name}`,
  description: `${svc.name} at home in ${loc.name}. ${svc.short}`,
  areaServed: { "@type": "City", name: loc.name, containedInPlace: loc.state },
  telephone: "+91 9175724546",
  email: "info@javahomecare.in",
  url: `${SITE}/locations/${loc.slug}/${svc.slug}`,
  medicalSpecialty: svc.name,
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: 4.9,
    reviewCount: 612,
  },
});

// Simple <Head>-less JSON-LD injector as a React component.
import React from "react";
export const JsonLd = ({ data }) => (
  <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: data }} />
);
