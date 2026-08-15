import React from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import PageHeader from "@/components/PageHeader";
import { FAQS } from "@/data/content";
import { JsonLd, faqPageSchema, breadcrumbSchema } from "@/lib/schema";
import SEOHead from "@/components/SEOHead";
import { PAGE_SEO } from "@/lib/seo";

const FAQ = () => (
  <Layout>
    <SEOHead seo={PAGE_SEO.faq} />
    <JsonLd data={faqPageSchema(FAQS)} />
    <JsonLd data={breadcrumbSchema([{ label: "Home", to: "/" }, { label: "FAQ", to: "/faq" }])} />
    <PageHeader
      eyebrow="FAQ"
      title="Common questions."
      subtitle="Still unsure? Call or WhatsApp — a CareNest coordinator will help."
      crumbs={[{ label: "FAQ" }]}
    />
    <section className="container-lux pb-10 max-w-3xl space-y-3">
      {FAQS.map((f, i) => (
        <details key={i} className="group rounded-2xl border border-border/70 bg-card/60 p-5">
          <summary data-testid={`faqpage-q-${i}`} className="cursor-pointer font-serif text-xl font-medium">
            {f.q}
          </summary>
          <p className="mt-3 text-muted-foreground font-light leading-relaxed">{f.a}</p>
        </details>
      ))}
    </section>
    <section className="container-lux pb-20 max-w-3xl">
      <h2 className="font-serif text-2xl tracking-tight">Next steps</h2>
      <p className="mt-3 text-muted-foreground font-light leading-relaxed">
        Compare our three services, explore care in Pune or PCMC, or contact a CareNest coordinator.
      </p>
      <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm">
        <Link to="/services" className="font-semibold text-primary hover:underline underline-offset-4">
          View services →
        </Link>
        <Link to="/services/patient-care" className="font-semibold text-primary hover:underline underline-offset-4">
          Patient Care →
        </Link>
        <Link to="/services/elder-care" className="font-semibold text-primary hover:underline underline-offset-4">
          Elder Care →
        </Link>
        <Link to="/services/home-nursing" className="font-semibold text-primary hover:underline underline-offset-4">
          Nursing Care →
        </Link>
        <Link to="/locations/pune" className="font-semibold text-primary hover:underline underline-offset-4">
          Care in Pune →
        </Link>
        <Link to="/locations/pimpri-chinchwad" className="font-semibold text-primary hover:underline underline-offset-4">
          Care in PCMC →
        </Link>
        <Link to="/contact" className="font-semibold text-primary hover:underline underline-offset-4">
          Contact CareNest →
        </Link>
      </div>
    </section>
  </Layout>
);

export default FAQ;
