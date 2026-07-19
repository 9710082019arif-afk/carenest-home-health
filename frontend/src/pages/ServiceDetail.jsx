import React from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import Layout from "@/components/Layout";
import PageHeader from "@/components/PageHeader";
import LeadForm from "@/components/LeadForm";
import { SERVICES, IMAGES, FAQS, COMPANY, LOCATIONS } from "@/data/content";
import * as Icons from "lucide-react";
import { CheckCircle2, Phone, MessageCircle } from "lucide-react";
import { JsonLd, faqPageSchema, breadcrumbSchema, serviceSchema } from "@/lib/schema";

const ServiceDetail = () => {
  const { slug } = useParams();
  const svc = SERVICES.find((s) => s.slug === slug);
  if (!svc) return <Navigate to="/services" replace />;
  const Icon = Icons[svc.icon] || Icons.HeartPulse;

  const includes = [
    "Verified & background-checked professional",
    "Daily digital case notes shared with the family",
    "Care manager on call 24×7",
    "Insurance-ready invoices & documentation",
    "Emergency escalation to consultant within minutes",
    "Same-day / next-day deployment across metros",
  ];

  return (
    <Layout>
      <JsonLd data={serviceSchema({ name: svc.name, description: svc.short, path: `/services/${svc.slug}` })} />
      <JsonLd data={faqPageSchema(FAQS.slice(0, 5))} />
      <JsonLd data={breadcrumbSchema([{ label: "Home", to: "/" }, { label: "Services", to: "/services" }, { label: svc.name }])} />
      <PageHeader
        eyebrow={svc.category}
        title={svc.name}
        subtitle={svc.tagline}
        image={IMAGES.nurseCare}
        crumbs={[{ label: "Services", to: "/services" }, { label: svc.name }]}
      />

      <section className="container-lux grid lg:grid-cols-12 gap-10 pb-24">
        <div className="lg:col-span-8 space-y-10">
          <div className="rounded-3xl border border-border/70 bg-card/60 p-6 md:p-8">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary grid place-items-center"><Icon size={22}/></div>
            <h2 className="font-serif text-3xl md:text-4xl mt-5 tracking-tight">What this looks like at home</h2>
            <p className="mt-4 text-muted-foreground text-[17px] leading-relaxed font-light">
              {svc.short} Our team designs a personalised plan built around your loved one — hours, clinical scope, equipment and family preferences. A dedicated care manager coordinates every visit and adjusts the plan as recovery evolves.
            </p>
          </div>

          <div>
            <h3 className="font-serif text-2xl md:text-3xl tracking-tight">Every {svc.name.toLowerCase()} plan includes</h3>
            <div className="mt-6 grid sm:grid-cols-2 gap-3">
              {includes.map((it) => (
                <div key={it} className="flex items-start gap-3 rounded-2xl border border-border/70 bg-card/50 p-4">
                  <CheckCircle2 size={18} className="text-secondary mt-0.5 shrink-0" />
                  <div className="text-sm">{it}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-serif text-2xl md:text-3xl tracking-tight">Common questions</h3>
            <div className="mt-6 space-y-3">
              {FAQS.slice(0, 5).map((f, i) => (
                <details key={i} className="group rounded-2xl border border-border/70 bg-card/60 p-5">
                  <summary className="cursor-pointer font-serif text-lg font-medium">{f.q}</summary>
                  <p className="mt-3 text-muted-foreground font-light leading-relaxed">{f.a}</p>
                </details>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-serif text-2xl md:text-3xl tracking-tight">Available in</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {LOCATIONS.map((l) => (
                <Link key={l.slug} to={`/locations/${l.slug}`} className="rounded-full border border-border px-4 py-1.5 text-xs hover:bg-primary hover:text-primary-foreground transition-colors">{l.name}</Link>
              ))}
            </div>
          </div>
        </div>

        <aside className="lg:col-span-4 space-y-4">
          <div className="sticky top-32">
            {svc.rate ? (
              <div className="rounded-3xl border border-accent/40 bg-gradient-to-br from-accent/10 via-background to-background p-6 mb-4 shadow-lux">
                <div className="overline text-accent">Indicative rate</div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="font-serif text-4xl font-medium text-foreground">{svc.rate}</span>
                  <span className="text-sm text-muted-foreground">{svc.rateUnit}</span>
                </div>
                {svc.rateNote && <p className="text-xs text-muted-foreground mt-2 font-light">{svc.rateNote}</p>}
                <p className="text-[11px] text-muted-foreground mt-3">Final plan shared after a free 10-minute consultation.</p>
              </div>
            ) : (
              <div className="rounded-3xl border border-border/70 bg-card/60 p-6 mb-4">
                <div className="overline text-accent">Pricing</div>
                <div className="mt-3 font-serif text-2xl">Personalised plan</div>
                <p className="text-sm text-muted-foreground mt-2 font-light">Rates depend on hours, clinical scope and equipment. Free 10-minute consult · we share a written plan the same day.</p>
              </div>
            )}
            <div className="rounded-3xl border border-border/70 bg-card/70 backdrop-blur-sm p-6 shadow-lux">
              <LeadForm variant={`service-${svc.slug}`} defaultService={svc.name} title={`Enquire about ${svc.name}`} />
            </div>
            <div className="mt-4 rounded-3xl bg-primary text-primary-foreground p-5">
              <div className="overline text-gold-light">Prefer to talk?</div>
              <div className="mt-3 flex flex-col gap-2">
                <a href={`tel:${COMPANY.phone.replace(/\s/g,'')}`} className="btn-gold w-full"><Phone size={15}/> {COMPANY.phone}</a>
                <a href={`https://wa.me/${COMPANY.whatsapp}`} target="_blank" rel="noreferrer" className="btn-outline w-full border-white/30 text-white hover:bg-white/10"><MessageCircle size={15}/> WhatsApp us</a>
              </div>
            </div>
          </div>
        </aside>
      </section>
    </Layout>
  );
};

export default ServiceDetail;
