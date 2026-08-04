import React, { useState, useMemo } from "react";
import Layout from "@/components/Layout";
import ServiceCard from "@/components/ServiceCard";
import { SERVICES, SERVICE_CATEGORIES } from "@/data/content";
import PageHeader from "@/components/PageHeader";
import SEOHead from "@/components/SEOHead";
import { PAGE_SEO } from "@/lib/seo";
import { JsonLd, servicesListSchema, offerCatalogSchema, breadcrumbSchema } from "@/lib/schema";

const Services = () => {
  const [cat, setCat] = useState("all");
  const filtered = useMemo(() => cat === "all" ? SERVICES : SERVICES.filter((s) => s.category === cat), [cat]);

  return (
    <Layout>
      <SEOHead seo={PAGE_SEO.services} />
      <JsonLd data={servicesListSchema()} />
      <JsonLd data={offerCatalogSchema()} />
      <JsonLd data={breadcrumbSchema([{ label: "Home", to: "/" }, { label: "Services", to: "/services" }])} />
      <PageHeader
        eyebrow="Care catalogue"
        title="Twenty-two services, one team."
        subtitle="Every service is delivered by verified professionals with a dedicated care manager on call. Explore what we offer, or ask us — we'll design a personalised plan."
      />
      <section className="container-lux pb-24">
        <div className="flex items-center gap-2 overflow-x-auto pb-4 -mb-4 mb-8">
          {SERVICE_CATEGORIES.map((c) => (
            <button
              key={c.key}
              data-testid={`service-filter-${c.key}`}
              onClick={() => setCat(c.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors whitespace-nowrap ${cat === c.key ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:bg-muted"}`}
            >{c.label}</button>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filtered.map((s) => <ServiceCard key={s.slug} service={s} />)}
        </div>
      </section>
    </Layout>
  );
};

export default Services;
