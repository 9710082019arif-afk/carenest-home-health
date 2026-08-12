import React from "react";
import Layout from "@/components/Layout";
import ServiceCard from "@/components/ServiceCard";
import { SERVICES } from "@/data/content";
import PageHeader from "@/components/PageHeader";
import SEOHead from "@/components/SEOHead";
import { PAGE_SEO } from "@/lib/seo";
import { JsonLd, servicesListSchema, offerCatalogSchema, breadcrumbSchema } from "@/lib/schema";

const Services = () => (
  <Layout>
    <SEOHead seo={PAGE_SEO.services} />
    <JsonLd data={servicesListSchema()} />
    <JsonLd data={offerCatalogSchema()} />
    <JsonLd
      data={breadcrumbSchema([
        { label: "Home", to: "/" },
        { label: "Services", to: "/services" },
      ])}
    />
    <PageHeader
      eyebrow="Services"
      title="Three primary care services."
      subtitle="Nursing Care, Patient Care, and Elder Care — delivered at home in Pune with a dedicated care coordinator."
    />
    <section className="container-lux pb-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {SERVICES.map((s) => (
          <ServiceCard key={s.slug} service={s} />
        ))}
      </div>
    </section>
  </Layout>
);

export default Services;
