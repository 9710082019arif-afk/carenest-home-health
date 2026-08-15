import React from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import PageHeader from "@/components/PageHeader";
import LeadForm from "@/components/LeadForm";
import SEOHead from "@/components/SEOHead";
import { LOCATIONS, SERVICES, COMPANY, IMAGES } from "@/data/content";
import { Phone, MessageCircle, MapPin, CheckCircle2 } from "lucide-react";
import { JsonLd, breadcrumbSchema, locationBusinessSchema } from "@/lib/schema";
import { locationSeo } from "@/lib/seo";

const LocationDetail = () => {
  const { slug } = useParams();
  const loc = LOCATIONS.find((l) => l.slug === slug);
  if (!loc) return <Navigate to="/locations" replace />;
  const isPune = loc.slug === "pune";

  return (
    <Layout>
      <SEOHead seo={locationSeo(loc)} />
      <JsonLd data={locationBusinessSchema(loc)} />
      <JsonLd
        data={breadcrumbSchema([
          { label: "Home", to: "/" },
          { label: "Locations", to: "/locations" },
          { label: loc.name, to: `/locations/${loc.slug}` },
        ])}
      />
      <PageHeader
        eyebrow={loc.state}
        title={
          <>
            Care at home in <span className="text-gold italic">{loc.name}</span>
          </>
        }
        subtitle={
          isPune
            ? "Patient Care at Home, Elder Care at Home, and Nursing Care at Home — including 24 Hour Home Care options — coordinated for families across Pune and nearby PCMC."
            : loc.slug === "pimpri-chinchwad"
              ? "Patient Care at Home, Elder Care at Home, and Nursing Care at Home for families in Pimpri-Chinchwad (PCMC). Pune and PCMC are our primary service areas."
              : `Enquire for CareNest Patient Care at Home, Elder Care at Home, and Nursing Care at Home in ${loc.name}. Pune and PCMC are our primary service areas.`
        }
        image={IMAGES.elderCare}
        imageAlt={`Home healthcare in ${loc.name} by CareNest`}
        crumbs={[{ label: "Locations", to: "/locations" }, { label: loc.name }]}
      />

      <section className="container-lux pb-16 grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-8">
          <div className="rounded-3xl border border-border/70 bg-card/60 p-6 md:p-8">
            <h2 className="font-serif text-3xl tracking-tight">
              {isPune
                ? "Why families in Pune & PCMC choose CareNest"
                : loc.slug === "pimpri-chinchwad"
                  ? "Home care for families in Pimpri-Chinchwad (PCMC)"
                  : `Home care enquiries for ${loc.name}`}
            </h2>
            <div className="mt-6 grid md:grid-cols-2 gap-3">
              {[
                isPune || loc.slug === "pimpri-chinchwad"
                  ? "Local Pune & PCMC care coordination"
                  : `Availability check for ${loc.name}`,
                "Verified nurses and caregivers",
                "Clear plans and indicative rates",
                "Call / WhatsApp family updates",
                "Insurance-ready invoices",
                "24 Hour Home Care options when continuous support is needed",
              ].map((it) => (
                <div key={it} className="flex items-start gap-3 rounded-2xl border border-border/60 p-4 bg-background/50">
                  <CheckCircle2 size={18} className="text-secondary mt-0.5 shrink-0" />
                  <div className="text-sm">{it}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="overline text-accent">Services in {loc.name}</div>
            <h3 className="font-serif text-2xl mt-3 tracking-tight">Three primary services</h3>
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {SERVICES.map((s) => (
                <Link
                  key={s.slug}
                  to={`/locations/${loc.slug}/${s.slug}`}
                  className="rounded-2xl border border-border/70 bg-card/50 p-4 hover:shadow-lux transition-shadow"
                >
                  <div className="font-medium">{s.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">in {loc.name}</div>
                </Link>
              ))}
            </div>
            {(isPune || loc.slug === "pimpri-chinchwad") && (
              <div className="mt-5 flex flex-wrap gap-3 text-sm">
                <Link to="/contact" className="text-primary font-semibold hover:underline underline-offset-4">
                  Contact CareNest →
                </Link>
                <Link to="/services" className="text-primary font-semibold hover:underline underline-offset-4">
                  View all services →
                </Link>
              </div>
            )}
          </div>
        </div>

        <aside className="lg:col-span-4">
          <div className="lg:sticky lg:top-28 space-y-4">
            <div className="rounded-3xl border border-border/70 bg-card/70 p-6 shadow-lux">
              <LeadForm variant={`location-${loc.slug}`} defaultCity={loc.name} title={`Care in ${loc.name}?`} />
            </div>
            <div className="rounded-3xl bg-primary text-primary-foreground p-5">
              <div className="overline text-gold-light">Reach us</div>
              <a href={`tel:${COMPANY.phone.replace(/\s/g, "")}`} className="btn-gold w-full mt-4">
                <Phone size={15} /> {COMPANY.phone}
              </a>
              <a
                href={`https://wa.me/${COMPANY.whatsapp}?text=${encodeURIComponent("Hi, I need home healthcare in " + loc.name)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline w-full mt-3 border-white/30 text-white hover:bg-white/10"
              >
                <MessageCircle size={15} /> WhatsApp
              </a>
              <div className="mt-4 flex items-center gap-2 text-xs text-white/80">
                <MapPin size={13} /> {loc.name}, {loc.state}
              </div>
            </div>
          </div>
        </aside>
      </section>
    </Layout>
  );
};

export default LocationDetail;
