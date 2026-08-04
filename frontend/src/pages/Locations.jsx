import React from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import PageHeader from "@/components/PageHeader";
import SEOHead from "@/components/SEOHead";
import { LOCATIONS, SERVICES, IMAGES } from "@/data/content";
import { PAGE_SEO } from "@/lib/seo";
import { JsonLd, locationsListSchema, breadcrumbSchema, organizationSchema } from "@/lib/schema";
import { MapPin, ArrowRight } from "lucide-react";

const featured = ["home-nursing", "icu-at-home", "doctor-at-home", "elder-care", "physiotherapy-at-home", "caregiver-services"];

const Locations = () => (
  <Layout>
    <SEOHead seo={PAGE_SEO.locations} />
    <JsonLd data={organizationSchema()} />
    <JsonLd data={locationsListSchema()} />
    <JsonLd data={breadcrumbSchema([{ label: "Home", to: "/" }, { label: "Locations", to: "/locations" }])} />
    <PageHeader
      eyebrow="Where we care"
      title={<>Home healthcare across <span className="text-gold italic">12 Indian cities.</span></>}
      subtitle="Local care managers, background-verified staff and same-day deployment — wherever your family needs us."
      image={IMAGES.doctorHome}
      imageAlt="CareNest home healthcare across Indian cities"
      crumbs={[{ label: "Locations" }]}
    />

    <section className="container-lux pb-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {LOCATIONS.map((l) => (
          <Link
            key={l.slug}
            to={`/locations/${l.slug}`}
            data-testid={`locations-hub-${l.slug}`}
            className="group rounded-3xl border border-border/70 bg-card/60 p-7 hover:shadow-lux-hover hover:-translate-y-0.5 transition-all"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-serif text-2xl tracking-tight">{l.name}</div>
                <div className="text-sm text-muted-foreground mt-1">{l.state}</div>
              </div>
              <MapPin size={18} className="text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
            </div>
            <p className="mt-4 text-sm text-muted-foreground font-light leading-relaxed">
              Home nursing, ICU-at-home, doctor visits, physiotherapy and elder care across {l.name} & suburbs.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {featured.slice(0, 3).map((slug) => {
                const s = SERVICES.find((x) => x.slug === slug);
                if (!s) return null;
                return (
                  <span
                    key={slug}
                    className="rounded-full border border-border/70 px-2.5 py-1 text-[11px] text-muted-foreground"
                  >
                    {s.name}
                  </span>
                );
              })}
            </div>
            <div className="mt-6 text-sm font-medium text-primary flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
              Explore care in {l.name} <ArrowRight size={14} />
            </div>
          </Link>
        ))}
      </div>
    </section>

    <section className="container-lux pb-24">
      <div className="rounded-3xl border border-border/70 bg-muted/30 p-8 md:p-10">
        <div className="overline text-accent">Popular city × service pages</div>
        <h2 className="font-serif text-2xl md:text-3xl mt-3 tracking-tight">Jump to care near you</h2>
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {LOCATIONS.filter((l) => l.featured).flatMap((l) =>
            featured.map((slug) => {
              const s = SERVICES.find((x) => x.slug === slug);
              if (!s) return null;
              return (
                <Link
                  key={`${l.slug}-${slug}`}
                  to={`/locations/${l.slug}/${slug}`}
                  className="rounded-2xl border border-border/70 bg-background p-4 text-sm hover:shadow-lux transition-shadow"
                >
                  <span className="font-medium">{s.name}</span>
                  <span className="text-muted-foreground"> in {l.name}</span>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </section>
  </Layout>
);

export default Locations;
