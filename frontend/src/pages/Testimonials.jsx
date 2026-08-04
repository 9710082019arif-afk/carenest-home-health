import React from "react";
import Layout from "@/components/Layout";
import PageHeader from "@/components/PageHeader";
import { TESTIMONIALS } from "@/data/content";
import { Star, Quote } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import { PAGE_SEO } from "@/lib/seo";
import { JsonLd, reviewsSchema, breadcrumbSchema } from "@/lib/schema";

const Testimonials = () => (
  <Layout>
    <SEOHead seo={PAGE_SEO.testimonials} />
    <JsonLd data={reviewsSchema()} />
    <JsonLd data={breadcrumbSchema([{ label: "Home", to: "/" }, { label: "Testimonials", to: "/testimonials" }])} />
    <PageHeader eyebrow="Patient stories" title="Care that people write about." subtitle="Real families, real recoveries, in their own words." crumbs={[{ label: "Testimonials" }]} />
    <section className="container-lux pb-24">
      <div className="grid md:grid-cols-2 gap-5">
        {TESTIMONIALS.map((t) => (
          <div key={t.id} className="rounded-3xl border border-border/70 bg-card/60 p-8 relative shadow-lux">
            <Quote className="text-accent absolute top-6 right-6 opacity-30" size={40}/>
            <div className="flex items-center gap-1 mb-3">
              {Array.from({ length: t.rating }).map((_, k) => (<Star key={k} size={14} className="fill-accent text-accent"/>))}
            </div>
            <p className="font-serif text-xl leading-snug">{t.text}</p>
            <div className="mt-5 pt-5 border-t border-border">
              <div className="font-semibold">{t.name}</div>
              <div className="text-xs text-muted-foreground">{t.relation} · {t.city}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  </Layout>
);

export default Testimonials;
