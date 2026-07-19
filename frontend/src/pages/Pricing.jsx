import React from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import PageHeader from "@/components/PageHeader";
import { SERVICES, COMPANY, FAQS } from "@/data/content";
import { Phone, MessageCircle, CheckCircle2, ArrowRight } from "lucide-react";
import { JsonLd, faqPageSchema, breadcrumbSchema } from "@/lib/schema";

const inclusions = [
  "Background-verified professional",
  "Care manager on call 24×7",
  "Daily digital case notes",
  "Insurance-ready invoices",
  "Emergency escalation to consultant",
];

const Pricing = () => {
  const priced = SERVICES.filter((s) => s.rate);
  const custom = SERVICES.filter((s) => !s.rate);

  return (
    <Layout>
      <JsonLd data={breadcrumbSchema([{ label: "Home", to: "/" }, { label: "Pricing" }])} />
      <JsonLd data={faqPageSchema([
        { q: "Do rates include equipment?", a: "No. Medical equipment (oxygen, BiPAP, hospital bed, monitors) is billed separately at our sanitised rental rates. Consumables are billed at actual cost." },
        { q: "Are there hidden charges?", a: "None. You receive an itemised written plan before care begins, with taxes and any add-ons clearly listed." },
        { q: "How do I get a personalised quote?", a: "Call or WhatsApp us at +91 9175724546 for a free 10-minute consult. We share a written plan the same day." },
        ...FAQS.slice(0, 3),
      ])} />

      <PageHeader
        eyebrow="Transparent pricing"
        title={<>Simple, honest <span className="text-gold italic">rates.</span></>}
        subtitle="Indicative rates for our most enquired services. Final plans are personalised to your patient's condition, hours and clinical scope — always shared in writing before care begins."
        crumbs={[{ label: "Pricing" }]}
      />

      <section className="container-lux pb-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {priced.map((s) => (
            <Link key={s.slug} to={`/services/${s.slug}`} data-testid={`pricing-card-${s.slug}`}
              className="group rounded-3xl border border-border/70 bg-card/70 backdrop-blur-sm p-7 hover:-translate-y-1 hover:shadow-lux-hover shadow-lux transition-all">
              <div className="overline text-accent">{s.category}</div>
              <h3 className="font-serif text-[26px] mt-3 tracking-tight">{s.name}</h3>

              <div className="mt-6 flex items-baseline gap-2 pb-5 border-b border-border">
                <span className="overline text-muted-foreground">From</span>
                <span className="font-serif text-4xl font-medium text-foreground">{s.rate}</span>
                <span className="text-sm text-muted-foreground">{s.rateUnit}</span>
              </div>
              {s.rateNote && <p className="text-xs text-muted-foreground mt-4 font-light leading-relaxed">{s.rateNote}</p>}

              <div className="mt-6 flex items-center gap-1.5 text-sm font-medium text-primary group-hover:gap-2.5 transition-all">
                Explore {s.name.toLowerCase()} <ArrowRight size={14} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-lux pb-16">
        <div className="rounded-3xl border border-border/70 bg-muted/30 p-8 md:p-10">
          <div className="overline text-accent">Every plan includes</div>
          <h3 className="font-serif text-2xl md:text-3xl mt-3 tracking-tight">The essentials — never billed extra.</h3>
          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {inclusions.map((it) => (
              <div key={it} className="flex items-start gap-3 rounded-2xl bg-background border border-border/70 p-4">
                <CheckCircle2 size={18} className="text-secondary mt-0.5 shrink-0" />
                <div className="text-sm">{it}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-lux pb-16">
        <div className="overline text-accent">Custom plans</div>
        <h3 className="font-serif text-3xl md:text-4xl mt-3 tracking-tight">Priced after a <span className="text-gold italic">10-minute</span> call.</h3>
        <p className="mt-3 text-muted-foreground max-w-2xl font-light">These services vary widely by patient condition, equipment and clinical hours — so we don't quote a generic rate. A free 10-minute consult with our care coordinator gets you a written plan the same day.</p>
        <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {custom.map((s) => (
            <Link key={s.slug} to={`/services/${s.slug}`} className="rounded-2xl border border-border/70 bg-card/50 p-4 hover:shadow-lux transition-shadow">
              <div className="font-medium text-sm">{s.name}</div>
              <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wide">Custom plan</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-lux pb-24">
        <div className="relative overflow-hidden rounded-[36px] border border-border/70 p-8 md:p-12 bg-gradient-to-r from-primary via-primary/95 to-primary/80 text-white">
          <div className="grid lg:grid-cols-12 gap-8 items-center relative">
            <div className="lg:col-span-8">
              <div className="overline text-gold-light">Free consult</div>
              <h2 className="font-serif text-3xl md:text-4xl mt-3 tracking-tight">Get your personalised plan — <span className="text-gold">in writing, same day.</span></h2>
              <p className="mt-3 text-white/80 font-light">10-minute call. No obligation. We share a clear plan with pricing before any care begins.</p>
            </div>
            <div className="lg:col-span-4 flex flex-col gap-3">
              <a href={`tel:${COMPANY.phone.replace(/\s/g,'')}`} className="btn-gold w-full" data-testid="pricing-cta-call"><Phone size={15}/> Call {COMPANY.phone}</a>
              <a href={`https://wa.me/${COMPANY.whatsapp}`} target="_blank" rel="noreferrer" className="btn-outline w-full border-white/30 text-white hover:bg-white/10" data-testid="pricing-cta-whatsapp"><MessageCircle size={15}/> WhatsApp us</a>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Pricing;
