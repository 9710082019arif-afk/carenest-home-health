import React from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import PageHeader from "@/components/PageHeader";
import LeadForm from "@/components/LeadForm";
import SEOHead from "@/components/SEOHead";
import { SERVICES, LOCATIONS, COMPANY, FAQS } from "@/data/content";
import { resolvePrimaryServiceSlug } from "@/data/redirects";
import { Stethoscope, HeartPulse, Users, Phone, MessageCircle, CheckCircle2 } from "lucide-react";
import { JsonLd, cityServiceSchema, faqPageSchema, breadcrumbSchema } from "@/lib/schema";
import { cityServiceSeo } from "@/lib/seo";

const ICONS = { Stethoscope, HeartPulse, Users };

const CityService = () => {
  const { city, slug } = useParams();
  const loc = LOCATIONS.find((l) => l.slug === city);
  const primarySlug = resolvePrimaryServiceSlug(slug);
  if (slug && primarySlug && primarySlug !== slug) {
    return <Navigate to={`/locations/${city}/${primarySlug}`} replace />;
  }
  const svc = SERVICES.find((s) => s.slug === slug);

  if (!loc || !svc) return <Navigate to="/services" replace />;
  const Icon = ICONS[svc.icon] || HeartPulse;
  const title = `${svc.name} in ${loc.name}`;
  const subtitle = `${svc.tagline} Delivered at home in ${loc.name} by verified professionals — with CareNest coordination.`;

  const includes = [
    `Care coordination for families in ${loc.name}`,
    "Background-verified professional",
    "Clear plan and timing",
    "Insurance-ready invoices",
    "Call / WhatsApp updates for family",
    "Enquire for same-day or next-day start",
  ];

  return (
    <Layout>
      <SEOHead seo={cityServiceSeo(svc, loc)} />
      <JsonLd data={cityServiceSchema({ svc, loc })} />
      <JsonLd data={faqPageSchema(FAQS.slice(0, 5))} />
      <JsonLd
        data={breadcrumbSchema([
          { label: "Home", to: "/" },
          { label: "Locations", to: "/locations" },
          { label: loc.name, to: `/locations/${loc.slug}` },
          { label: svc.name, to: `/locations/${loc.slug}/${svc.slug}` },
        ])}
      />
      <PageHeader
        eyebrow={`${loc.name} · ${loc.state}`}
        title={title}
        subtitle={subtitle}
        image={svc.image}
        imageAlt={`${svc.name} in ${loc.name} by CareNest Home Health`}
        crumbs={[
          { label: "Locations", to: "/locations" },
          { label: loc.name, to: `/locations/${loc.slug}` },
          { label: svc.name },
        ]}
      />

      <section className="container-lux pb-20 grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-8">
          <div className="rounded-3xl border border-border/70 bg-card/60 p-6 md:p-8">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary grid place-items-center">
              <Icon size={22} />
            </div>
            <h2 className="font-serif text-3xl mt-5 tracking-tight">
              {svc.name} for families in {loc.name}
            </h2>
            <p className="mt-4 text-muted-foreground text-[17px] leading-relaxed font-light">
              {svc.short}{" "}
              {loc.slug === "pune"
                ? "Pune is our primary service area — we prioritise fast, local coordination."
                : `CareNest’s primary focus is Pune; enquire for availability and timing in ${loc.name}.`}
            </p>
            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              <Link to={`/services/${svc.slug}`} className="text-primary font-medium hover:underline underline-offset-4">
                About {svc.name} →
              </Link>
              <Link to={`/locations/${loc.slug}`} className="text-primary font-medium hover:underline underline-offset-4">
                Care in {loc.name} →
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-serif text-2xl tracking-tight">Included</h3>
            <div className="mt-5 grid sm:grid-cols-2 gap-3">
              {includes.map((it) => (
                <div key={it} className="flex items-start gap-3 rounded-2xl border border-border/70 bg-card/50 p-4">
                  <CheckCircle2 size={18} className="text-secondary mt-0.5 shrink-0" />
                  <div className="text-sm">{it}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-serif text-2xl tracking-tight">Other services in {loc.name}</h3>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {SERVICES.filter((s) => s.slug !== slug).map((s) => (
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
          </div>
        </div>

        <aside className="lg:col-span-4">
          <div className="lg:sticky lg:top-28 space-y-4">
            <div className="rounded-3xl border border-border/70 bg-card/70 p-6 shadow-lux">
              <LeadForm
                variant={`city-service-${loc.slug}-${svc.slug}`}
                defaultService={svc.name}
                defaultCity={loc.name}
                title={`${svc.name} in ${loc.name}?`}
              />
            </div>
            <div className="rounded-3xl bg-primary text-primary-foreground p-5">
              <div className="overline text-gold-light">{loc.name} enquiries</div>
              <a href={`tel:${COMPANY.phone.replace(/\s/g, "")}`} className="btn-gold w-full mt-4">
                <Phone size={15} /> {COMPANY.phone}
              </a>
              <a
                href={`https://wa.me/${COMPANY.whatsapp}?text=${encodeURIComponent(`Hi, I need ${svc.name} in ${loc.name}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline w-full mt-3 border-white/30 text-white hover:bg-white/10"
              >
                <MessageCircle size={15} /> WhatsApp
              </a>
            </div>
          </div>
        </aside>
      </section>
    </Layout>
  );
};

export default CityService;
