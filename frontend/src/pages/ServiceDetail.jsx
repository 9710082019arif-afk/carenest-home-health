import React from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import Layout from "@/components/Layout";
import PageHeader from "@/components/PageHeader";
import LeadForm from "@/components/LeadForm";
import SEOHead from "@/components/SEOHead";
import { SERVICES, COMPANY, IMAGES } from "@/data/content";
import { SERVICE_REDIRECTS } from "@/data/redirects";
import { Stethoscope, HeartPulse, Users, CheckCircle2, XCircle, Phone, MessageCircle, ArrowRight } from "lucide-react";
import { JsonLd, breadcrumbSchema, serviceSchema, faqPageSchema } from "@/lib/schema";
import { serviceSeo } from "@/lib/seo";

const ICONS = { Stethoscope, HeartPulse, Users };

const ServiceDetail = () => {
  const { slug } = useParams();
  if (SERVICE_REDIRECTS[slug]) {
    return <Navigate to={`/services/${SERVICE_REDIRECTS[slug]}`} replace />;
  }
  const svc = SERVICES.find((s) => s.slug === slug);
  if (!svc) return <Navigate to="/services" replace />;
  const Icon = ICONS[svc.icon] || HeartPulse;
  const image = svc.image || IMAGES.nurseCare;
  const planIncludes = [
    "Verified & background-checked professional",
    "Care coordinator on call",
    "Clear plan and timing for Pune & PCMC deployments",
    "Insurance-ready invoices & documentation",
    "Family updates via call or WhatsApp",
    "Same-day / next-day deployment when available",
    "Continuous care/support when a 24-hour plan is agreed",
  ];

  return (
    <Layout>
      <SEOHead seo={serviceSeo(svc)} />
      <JsonLd
        data={serviceSchema({
          name: svc.name,
          description: svc.short,
          path: `/services/${svc.slug}`,
          rate: svc.rate,
          rateUnit: svc.rateUnit,
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { label: "Home", to: "/" },
          { label: "Services", to: "/services" },
          { label: svc.name, to: `/services/${svc.slug}` },
        ])}
      />
      {svc.faqs?.length > 0 && <JsonLd data={faqPageSchema(svc.faqs)} />}
      <PageHeader
        eyebrow="Service"
        title={svc.name}
        subtitle={svc.tagline}
        image={image}
        imageAlt={`${svc.name} in Pune by CareNest Home Health`}
        crumbs={[{ label: "Services", to: "/services" }, { label: svc.name }]}
      />

      <section className="container-lux grid lg:grid-cols-12 gap-10 pb-20">
        <div className="lg:col-span-8 space-y-8">
          <div className="rounded-3xl border border-border/70 bg-card/60 p-6 md:p-8">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary grid place-items-center">
              <Icon size={22} />
            </div>
            <h2 className="font-serif text-3xl md:text-4xl mt-5 tracking-tight">What this service is</h2>
            <p className="mt-4 text-muted-foreground text-[17px] leading-relaxed font-light">{svc.short}</p>
            {svc.differentiation && (
              <>
                <h3 className="font-serif text-2xl mt-8 tracking-tight">How it differs from our other services</h3>
                <p className="mt-3 text-muted-foreground text-[17px] leading-relaxed font-light">{svc.differentiation}</p>
              </>
            )}
            {svc.suitability && (
              <>
                <h3 className="font-serif text-2xl mt-8 tracking-tight">Who it is suitable for</h3>
                <p className="mt-3 text-muted-foreground text-[17px] leading-relaxed font-light">{svc.suitability}</p>
              </>
            )}
            <p className="mt-6 text-muted-foreground text-[17px] leading-relaxed font-light">
              Our team designs a plan for families in Pune and Pimpri-Chinchwad (PCMC) — scope, timing and preferences —
              with a care coordinator to keep everything clear. Plans can include 24 Hour Home Care when continuous
              support is needed.
            </p>
          </div>

          {svc.includesList?.length > 0 && (
            <div>
              <h3 className="font-serif text-2xl md:text-3xl tracking-tight">What is included</h3>
              <div className="mt-5 grid sm:grid-cols-2 gap-3">
                {svc.includesList.map((it) => (
                  <div key={it} className="flex items-start gap-3 rounded-2xl border border-border/70 bg-card/50 p-4">
                    <CheckCircle2 size={18} className="text-secondary mt-0.5 shrink-0" />
                    <div className="text-sm">{it}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {svc.excludesList?.length > 0 && (
            <div>
              <h3 className="font-serif text-2xl md:text-3xl tracking-tight">What is not included</h3>
              <div className="mt-5 grid sm:grid-cols-2 gap-3">
                {svc.excludesList.map((it) => (
                  <div key={it} className="flex items-start gap-3 rounded-2xl border border-border/70 bg-card/50 p-4">
                    <XCircle size={18} className="text-muted-foreground/70 mt-0.5 shrink-0" />
                    <div className="text-sm text-muted-foreground">{it}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="font-serif text-2xl md:text-3xl tracking-tight">Every {svc.name.toLowerCase()} plan includes</h3>
            <div className="mt-5 grid sm:grid-cols-2 gap-3">
              {planIncludes.map((it) => (
                <div key={it} className="flex items-start gap-3 rounded-2xl border border-border/70 bg-card/50 p-4">
                  <CheckCircle2 size={18} className="text-secondary mt-0.5 shrink-0" />
                  <div className="text-sm">{it}</div>
                </div>
              ))}
            </div>
          </div>

          {svc.faqs?.length > 0 && (
            <div>
              <h3 className="font-serif text-2xl md:text-3xl tracking-tight">Frequently asked questions</h3>
              <div className="mt-5 space-y-3">
                {svc.faqs.map((faq, i) => (
                  <details
                    key={faq.q}
                    className="group rounded-2xl border border-border/70 bg-card/60 p-5"
                    data-testid={`service-faq-${svc.slug}-${i}`}
                  >
                    <summary className="cursor-pointer font-serif text-xl font-medium">{faq.q}</summary>
                    <p className="mt-3 text-muted-foreground font-light leading-relaxed">{faq.a}</p>
                  </details>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="font-serif text-2xl tracking-tight">Available in Pune &amp; PCMC</h3>
            <p className="mt-3 text-muted-foreground text-[15px] leading-relaxed font-light">
              Explore local pages for {svc.name}, or contact us to discuss a care plan for your family.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                to={`/locations/pune/${svc.slug}`}
                className="inline-flex items-center gap-1 rounded-full border border-primary/25 bg-primary/5 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {svc.name} in Pune <ArrowRight size={14} />
              </Link>
              <Link
                to={`/locations/pimpri-chinchwad/${svc.slug}`}
                className="inline-flex items-center gap-1 rounded-full border border-primary/25 bg-primary/5 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {svc.name} in PCMC <ArrowRight size={14} />
              </Link>
              <Link
                to="/locations/pune"
                className="inline-flex items-center gap-1 rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
              >
                Home care in Pune
              </Link>
              <Link
                to="/locations/pimpri-chinchwad"
                className="inline-flex items-center gap-1 rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
              >
                Home care in PCMC
              </Link>
              <Link
                to="/locations"
                className="inline-flex items-center gap-1 rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
              >
                All locations
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-1 rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
              >
                Contact CareNest
              </Link>
              {SERVICES.filter((s) => s.slug !== svc.slug).map((s) => (
                <Link
                  key={s.slug}
                  to={`/services/${s.slug}`}
                  className="rounded-full border border-border px-4 py-2 text-sm hover:bg-muted transition-colors"
                >
                  {s.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <aside className="lg:col-span-4 space-y-4">
          <div className="lg:sticky lg:top-28">
            {svc.rate && (
              <div className="rounded-3xl border border-accent/40 bg-gradient-to-br from-accent/10 via-background to-background p-6 mb-4 shadow-lux">
                <div className="overline text-accent">Indicative rate</div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="font-serif text-4xl font-medium text-foreground">{svc.rate}</span>
                  <span className="text-sm text-muted-foreground">{svc.rateUnit}</span>
                </div>
                {svc.rateNote && <p className="text-xs text-muted-foreground mt-2 font-light">{svc.rateNote}</p>}
              </div>
            )}
            <div className="rounded-3xl border border-border/70 bg-card/70 p-6 shadow-lux">
              <LeadForm variant={`service-${svc.slug}`} defaultService={svc.name} title={`Enquire about ${svc.name}`} />
            </div>
            <div className="mt-4 rounded-3xl bg-primary text-primary-foreground p-5">
              <div className="overline text-gold-light">Prefer to talk?</div>
              <div className="mt-3 flex flex-col gap-2">
                <a href={`tel:${COMPANY.phone.replace(/\s/g, "")}`} className="btn-gold w-full">
                  <Phone size={15} /> {COMPANY.phone}
                </a>
                <a
                  href={`https://wa.me/${COMPANY.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline w-full border-white/30 text-white hover:bg-white/10"
                >
                  <MessageCircle size={15} /> WhatsApp us
                </a>
              </div>
            </div>
          </div>
        </aside>
      </section>
    </Layout>
  );
};

export default ServiceDetail;
