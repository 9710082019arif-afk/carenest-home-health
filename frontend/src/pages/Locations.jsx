import React from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import PageHeader from "@/components/PageHeader";
import SEOHead from "@/components/SEOHead";
import { LOCATIONS, COMPANY } from "@/data/content";
import { PAGE_SEO } from "@/lib/seo";
import { JsonLd, locationsListSchema, breadcrumbSchema } from "@/lib/schema";
import { MapPin, Phone } from "lucide-react";

const Locations = () => (
  <Layout>
    <SEOHead seo={PAGE_SEO.locations} />
    <JsonLd data={locationsListSchema()} />
    <JsonLd
      data={breadcrumbSchema([
        { label: "Home", to: "/" },
        { label: "Locations", to: "/locations" },
      ])}
    />
    <PageHeader
      eyebrow="Locations"
      title={
        <>
          Care at home — <span className="text-gold italic">Pune first.</span>
        </>
      }
      subtitle="Pune and Pimpri-Chinchwad (PCMC) are our primary service areas. Other city pages remain available for enquiries and search visitors."
      crumbs={[{ label: "Locations" }]}
    />

    <section className="container-lux pb-10 max-w-3xl">
      <p className="text-muted-foreground font-light leading-relaxed">
        Looking for Patient Care at Home, Elder Care at Home, or Nursing Care at Home? Start with{" "}
        <Link to="/locations/pune" className="text-primary font-medium hover:underline underline-offset-4">
          Pune
        </Link>
        ,{" "}
        <Link to="/locations/pimpri-chinchwad" className="text-primary font-medium hover:underline underline-offset-4">
          Pimpri-Chinchwad (PCMC)
        </Link>
        , or{" "}
        <Link to="/contact" className="text-primary font-medium hover:underline underline-offset-4">
          contact CareNest
        </Link>{" "}
        / call{" "}
        <a className="text-primary font-medium hover:underline underline-offset-4" href={`tel:${COMPANY.phone.replace(/\s/g, "")}`}>
          {COMPANY.phone}
        </a>
        .
      </p>
    </section>

    <section className="container-lux pb-20" aria-labelledby="cities-heading">
      <h2 id="cities-heading" className="font-serif text-2xl tracking-tight mb-6">
        City pages
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {LOCATIONS.map((l) => (
          <Link
            key={l.slug}
            to={`/locations/${l.slug}`}
            data-testid={`locations-hub-${l.slug}`}
            className="group rounded-2xl border border-border/70 bg-card/60 p-5 hover:shadow-lux transition-shadow"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-serif text-xl tracking-tight">
                  {l.name}
                  {l.slug === "pune" && <span className="ml-2 text-xs text-gold font-sans font-semibold">Primary</span>}
                </div>
                <div className="text-sm text-muted-foreground mt-1">{l.state}</div>
              </div>
              <MapPin size={16} className="text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
            </div>
          </Link>
        ))}
      </div>
      <a href={`tel:${COMPANY.phone.replace(/\s/g, "")}`} className="btn-gold mt-8 inline-flex">
        <Phone size={15} /> Call {COMPANY.phone}
      </a>
    </section>
  </Layout>
);

export default Locations;
