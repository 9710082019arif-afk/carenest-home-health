import React from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import Layout from "@/components/Layout";
import PageHeader from "@/components/PageHeader";
import LeadForm from "@/components/LeadForm";
import SEOHead from "@/components/SEOHead";
import { SERVICES, SERVICE_PAGE_CONTENT, COMPANY, IMAGES, HOW_IT_WORKS } from "@/data/content";
import { SERVICE_REDIRECTS } from "@/data/redirects";
import { Stethoscope, HeartPulse, Users, CheckCircle2, Phone, MessageCircle, ArrowRight } from "lucide-react";
import { JsonLd, faqPageSchema, breadcrumbSchema, serviceSchema } from "@/lib/schema";
import { serviceSeo } from "@/lib/seo";

const ICONS = { Stethoscope, HeartPulse, Users };

const ServiceDetail = () => {
  const { slug } = useParams();
  if (SERVICE_REDIRECTS[slug]) {
    return <Navigate to={`/services/${SERVICE_REDIRECTS[slug]}`} replace />;
  }
  const svc = SERVICES.find((s) => s.slug === slug);
  if (!svc) return <Navigate to="/services" replace />;

  const content = SERVICE_PAGE_CONTENT[svc.slug];
  const Icon = ICONS[svc.icon] || HeartPulse;
  const image = svc.image || IMAGES.nurseCare;
  const faqs = content?.faqs || [];

  return (
    <Layout>
      <SEOHead seo={serviceSeo(svc)} />
      <JsonLd
        data={serviceSchema({
          name: svc.name,
          description: content?.overview || svc.short,
          path: `/services/${svc.slug}`,
          rate: svc.rate,
          rateUnit: svc.rateUnit,
        })}
      />
      {faqs.length > 0 && <JsonLd data={faqPageSchema(faqs)} />}
      <JsonLd
        data={breadcrumbSchema([
          { label: "Home", to: "/" },
          { label: "Services", to: "/services" },
          { label: svc.name, to: `/services/${svc.slug}` },
        ])}
      />
      <PageHeader
        eyebrow="Service · Pune"
        title={svc.name}
        subtitle={svc.tagline}
        image={image}
        imageAlt={`${svc.name} at home in Pune by CareNest Home Health`}
        crumbs={[{ label: "Services", to: "/services" }, { label: svc.name }]}
      />

      <section className="container-lux grid lg:grid-cols-12 gap-10 pb-20">
        <div className="lg:col-span-8 space-y-10">
          <div className="rounded-3xl border border-border/70 bg-card p-6 md:p-8">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary grid place-items-center">
              <Icon size={22} />
            </div>
            <h2 className="font-serif text-3xl md:text-4xl mt-5 tracking-tight">Service overview</h2>
            <p className="mt-4 text-muted-foreground text-[17px] leading-relaxed font-light">
              {content?.overview || svc.short}
            </p>
          </div>

          {content?.whoNeeds && (
            <div>
              <h2 className="font-serif text-2xl md:text-3xl tracking-tight">Who needs {svc.name.toLowerCase()}?</h2>
              <ul className="mt-5 space-y-3">
                {content.whoNeeds.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[15px] text-foreground/90 leading-relaxed">
                    <CheckCircle2 size={18} className="text-secondary mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {content?.included && (
            <div>
              <h2 className="font-serif text-2xl md:text-3xl tracking-tight">What is included</h2>
              <div className="mt-5 grid sm:grid-cols-2 gap-3">
                {content.included.map((it) => (
                  <div key={it} className="flex items-start gap-3 rounded-2xl border border-border/70 bg-card/50 p-4">
                    <CheckCircle2 size={18} className="text-secondary mt-0.5 shrink-0" />
                    <div className="text-sm leading-relaxed">{it}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h2 className="font-serif text-2xl md:text-3xl tracking-tight">How CareNest works</h2>
            <div className="mt-5 grid sm:grid-cols-2 gap-4">
              {(content?.howItWorks || HOW_IT_WORKS.map((s) => s.d)).map((step, i) => (
                <div key={i} className="rounded-2xl border border-border/70 bg-card/50 p-5">
                  <div className="font-serif text-2xl text-gold">{String(i + 1).padStart(2, "0")}</div>
                  <p className="mt-2 text-sm text-foreground/90 leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {content?.benefits && (
            <div>
              <h2 className="font-serif text-2xl md:text-3xl tracking-tight">Benefits for families</h2>
              <ul className="mt-5 space-y-3">
                {content.benefits.map((b) => (
                  <li key={b} className="flex items-start gap-3 text-[15px] leading-relaxed">
                    <CheckCircle2 size={18} className="text-secondary mt-0.5 shrink-0" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {content?.puneContext && (
            <div className="rounded-3xl border border-primary/15 bg-primary/[0.03] p-6 md:p-8">
              <div className="overline text-accent">Pune focus</div>
              <h2 className="font-serif text-2xl md:text-3xl mt-3 tracking-tight">{svc.name} in Pune</h2>
              <p className="mt-4 text-muted-foreground text-[16px] leading-relaxed font-light">{content.puneContext}</p>
              <Link
                to={`/locations/pune/${svc.slug}`}
                className="inline-flex items-center gap-1 mt-5 text-sm font-semibold text-primary hover:underline underline-offset-4"
              >
                {svc.name} in Pune <ArrowRight size={14} />
              </Link>
            </div>
          )}

          {faqs.length > 0 && (
            <div>
              <h2 className="font-serif text-2xl md:text-3xl tracking-tight">Frequently asked questions</h2>
              <div className="mt-5 space-y-3">
                {faqs.map((f, i) => (
                  <details key={i} className="group rounded-2xl border border-border/70 bg-card p-5">
                    <summary className="cursor-pointer font-serif text-lg font-medium text-foreground">{f.q}</summary>
                    <p className="mt-3 text-muted-foreground font-light leading-relaxed text-[15px]">{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-3xl border border-border/70 bg-royal text-white p-6 md:p-8">
            <h2 className="font-serif text-2xl md:text-3xl tracking-tight">Ready to enquire?</h2>
            <p className="mt-3 text-white/80 font-light leading-relaxed">
              Speak with a CareNest coordinator about {svc.name.toLowerCase()} in Pune — call, WhatsApp, or send a short
              enquiry.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={`tel:${COMPANY.phone.replace(/\s/g, "")}`} className="btn-gold">
                <Phone size={15} /> {COMPANY.phone}
              </a>
              <a
                href={`https://wa.me/${COMPANY.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline border-white/30 text-white hover:bg-white/10"
              >
                <MessageCircle size={15} /> WhatsApp
              </a>
              <Link to="/contact" className="btn-outline border-white/30 text-white hover:bg-white/10">
                Contact us <ArrowRight size={14} />
              </Link>
              <a href="#enquire" className="btn-outline border-white/30 text-white hover:bg-white/10">
                Enquiry form
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-serif text-xl tracking-tight">Other CareNest services</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {SERVICES.filter((s) => s.slug !== svc.slug).map((s) => (
                <Link
                  key={s.slug}
                  to={`/services/${s.slug}`}
                  className="rounded-full border border-border px-4 py-1.5 text-xs hover:bg-muted transition-colors"
                >
                  {s.name}
                </Link>
              ))}
              <Link
                to="/services"
                className="rounded-full border border-border px-4 py-1.5 text-xs text-primary hover:bg-primary/5 transition-colors"
              >
                All services
              </Link>
            </div>
          </div>
        </div>

        <aside className="lg:col-span-4 space-y-4" id="enquire">
          <div className="lg:sticky lg:top-28">
            {svc.rate && (
              <div className="rounded-3xl border border-accent/40 bg-gradient-to-br from-accent/10 via-background to-background p-6 mb-4 shadow-lux">
                <div className="overline text-accent">Indicative rate</div>
                <div className="mt-3 flex items-baseline gap-2 flex-wrap">
                  <span className="font-serif text-4xl font-medium text-foreground">{svc.rate}</span>
                  <span className="text-sm text-muted-foreground">{svc.rateUnit}</span>
                </div>
                {svc.rateNote && <p className="text-xs text-muted-foreground mt-2 font-light">{svc.rateNote}</p>}
              </div>
            )}
            <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-lux">
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
                <Link to="/contact" className="btn-outline w-full border-white/30 text-white hover:bg-white/10 justify-center">
                  Contact page
                </Link>
              </div>
            </div>
          </div>
        </aside>
      </section>
    </Layout>
  );
};

export default ServiceDetail;
