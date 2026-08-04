import React from "react";
import Layout from "@/components/Layout";
import PageHeader from "@/components/PageHeader";
import { IMAGES } from "@/data/content";
import SEOHead from "@/components/SEOHead";
import { PAGE_SEO } from "@/lib/seo";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";

const Gallery = () => (
  <Layout>
    <SEOHead seo={PAGE_SEO.gallery} />
    <JsonLd data={breadcrumbSchema([{ label: "Home", to: "/" }, { label: "Gallery", to: "/gallery" }])} />
    <PageHeader eyebrow="Gallery" title="Moments from the field." subtitle="Anonymised, consented images from our care visits across India." crumbs={[{ label: "Gallery" }]} />
    <section className="container-lux pb-24">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {IMAGES.gallery.map((src, i) => (
          <div key={i} className={`rounded-2xl overflow-hidden shadow-lux ${i % 5 === 0 ? "row-span-2" : ""}`}>
            <img src={src} alt={["Home nursing visit","Elder care at home","ICU setup at home","Physiotherapy session","Patient care","Doctor at home visit","Medical equipment delivery","Home healthcare team"][i] || `CareNest home healthcare visit ${i+1}`} loading="lazy" className="h-full w-full object-cover hover:scale-105 transition-transform duration-700" />
          </div>
        ))}
      </div>
    </section>
  </Layout>
);

export default Gallery;
