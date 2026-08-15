import React from "react";
import { Link } from "react-router-dom";
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
      subtitle="Patient Care at Home, Elder Care at Home, and Nursing Care at Home — including 24 Hour Home Care options — delivered in Pune and PCMC with a dedicated care coordinator."
    />
    <section className="container-lux pb-10 max-w-3xl">
      <p className="text-muted-foreground font-light leading-relaxed">
        <b className="text-foreground font-medium">Nursing Care</b> is for clinical nursing by an RN.{" "}
        <b className="text-foreground font-medium">Patient Care</b> supports recovery and personal care.{" "}
        <b className="text-foreground font-medium">Elder Care</b> focuses on senior caregivers and companionship. Open
        any service page for what is included and what is not.
      </p>
    </section>
    <section className="container-lux pb-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {SERVICES.map((s) => (
          <ServiceCard key={s.slug} service={s} />
        ))}
      </div>
      <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm">
        <Link to="/locations" className="font-semibold text-primary hover:underline underline-offset-4">
          All locations →
        </Link>
        <Link to="/locations/pune" className="font-semibold text-primary hover:underline underline-offset-4">
          Home care in Pune →
        </Link>
        <Link to="/locations/pimpri-chinchwad" className="font-semibold text-primary hover:underline underline-offset-4">
          Home care in PCMC →
        </Link>
        <Link to="/contact" className="font-semibold text-primary hover:underline underline-offset-4">
          Contact CareNest →
        </Link>
      </div>
    </section>
  </Layout>
);

export default Services;
