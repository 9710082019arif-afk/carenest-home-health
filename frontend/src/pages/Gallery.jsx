import React from "react";
import Layout from "@/components/Layout";
import PageHeader from "@/components/PageHeader";
import { IMAGES } from "@/data/content";

const Gallery = () => (
  <Layout>
    <PageHeader eyebrow="Gallery" title="Moments from the field." subtitle="Anonymised, consented images from our care visits across India." crumbs={[{ label: "Gallery" }]} />
    <section className="container-lux pb-24">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {IMAGES.gallery.map((src, i) => (
          <div key={i} className={`rounded-2xl overflow-hidden shadow-lux ${i % 5 === 0 ? "row-span-2" : ""}`}>
            <img src={src} alt={`CareNest visit ${i+1}`} loading="lazy" className="h-full w-full object-cover hover:scale-105 transition-transform duration-700" />
          </div>
        ))}
      </div>
    </section>
  </Layout>
);

export default Gallery;
