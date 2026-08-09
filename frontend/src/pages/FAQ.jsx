import React from "react";
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
    <section className="container-lux pb-20 max-w-3xl space-y-3">
      {FAQS.map((f, i) => (
        <details key={i} className="group rounded-2xl border border-border/70 bg-card/60 p-5">
          <summary data-testid={`faqpage-q-${i}`} className="cursor-pointer font-serif text-xl font-medium">
            {f.q}
          </summary>
          <p className="mt-3 text-muted-foreground font-light leading-relaxed">{f.a}</p>
        </details>
      ))}
    </section>
  </Layout>
);

export default FAQ;
