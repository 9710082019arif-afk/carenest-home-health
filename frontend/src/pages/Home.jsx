import React from "react";
import Layout from "@/components/Layout";
import LeadForm from "@/components/LeadForm";
import ServiceCard from "@/components/ServiceCard";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { Phone, MessageCircle, ArrowRight, ShieldCheck } from "lucide-react";
import { COMPANY, SERVICES, WHY_CHOOSE, HOW_IT_WORKS, TRUST_BADGES, IMAGES } from "@/data/content";
import { PAGE_SEO } from "@/lib/seo";
import { JsonLd, offerCatalogSchema } from "@/lib/schema";
import { trackPhoneClick, trackWhatsAppClick } from "@/lib/analytics";

const Home = () => {
  return (
    <Layout>
      <SEOHead seo={PAGE_SEO.home} />
      <JsonLd data={offerCatalogSchema()} />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img
            src={IMAGES.heroPrimary}
            alt=""
            role="presentation"
            className="absolute inset-0 h-full w-full object-cover opacity-25"
            fetchPriority="high"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-secondary/10" />
        </div>

        <div className="container-lux pt-10 md:pt-16 pb-16 md:pb-20 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-[11px] font-semibold tracking-wide text-primary">
            CareNest Home Health · Pune &amp; PCMC
          </div>
          <h1 className="mt-6 font-serif font-medium tracking-tight leading-[1.05] text-4xl md:text-5xl lg:text-[56px]">
            24 Hour Home Care in <span className="text-gold italic">Pune</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted-foreground font-light leading-relaxed">
            Continuous home care coordinated with Patient Care at Home, Elder Care at Home and Nursing Care at Home —
            for families across Pune and Pimpri-Chinchwad (PCMC).
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href={`tel:${COMPANY.phone.replace(/\s/g, "")}`}
              data-testid="hero-call-now"
              className="btn-gold"
              onClick={() => trackPhoneClick({ location: "home-hero" })}
            >
              <Phone size={16} /> Call
            </a>
            <a
              href={`https://wa.me/${COMPANY.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              data-testid="hero-whatsapp"
              className="btn-primary"
              onClick={() => trackWhatsAppClick({ location: "home-hero" })}
            >
              <MessageCircle size={16} /> WhatsApp
            </a>
            <a href="#enquire" data-testid="hero-enquire" className="btn-outline">
              Enquire Now
            </a>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2">
            {TRUST_BADGES.map((b) => (
              <div key={b.label} className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
                <ShieldCheck size={16} className="text-secondary" />
                {b.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THREE SERVICES */}
      <section id="services" className="container-lux py-16 md:py-24">
        <div className="max-w-2xl mb-10">
          <div className="overline text-accent">Our services</div>
          <h2 className="font-serif text-3xl md:text-4xl mt-3 tracking-tight">
            Three ways we care for your family.
          </h2>
          <p className="mt-3 text-muted-foreground font-light">
            Focused home healthcare in Pune and PCMC — choose Patient Care, Elder Care or Nursing Care, with continuous
            care/support when needed.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {SERVICES.map((s) => (
            <ServiceCard key={s.slug} service={s} />
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2">
          <Link to="/services" className="text-sm font-semibold text-primary hover:underline underline-offset-4 inline-flex items-center gap-1">
            View all services <ArrowRight size={14} />
          </Link>
          <Link to="/locations/pune" className="text-sm font-semibold text-primary hover:underline underline-offset-4 inline-flex items-center gap-1">
            Home care in Pune <ArrowRight size={14} />
          </Link>
          <Link to="/locations/pimpri-chinchwad" className="text-sm font-semibold text-primary hover:underline underline-offset-4 inline-flex items-center gap-1">
            Home care in PCMC <ArrowRight size={14} />
          </Link>
          <Link to="/locations" className="text-sm font-semibold text-primary hover:underline underline-offset-4 inline-flex items-center gap-1">
            All locations <ArrowRight size={14} />
          </Link>
          <Link to="/contact" className="text-sm font-semibold text-primary hover:underline underline-offset-4 inline-flex items-center gap-1">
            Contact CareNest <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* 24 HOUR HOME CARE — answer-first */}
      <section id="24-hour-home-care" className="container-lux py-16 md:py-20" aria-labelledby="what-is-24h-heading">
        <div className="max-w-3xl">
          <div className="overline text-accent">24 Hour Home Care</div>
          <h2 id="what-is-24h-heading" className="font-serif text-3xl md:text-4xl mt-3 tracking-tight">
            What is 24 Hour Home Care?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground font-light leading-relaxed">
            24 Hour Home Care means continuous care or support at home around the clock — day and night — so someone is
            present when your family needs ongoing help. At CareNest, it is arranged as part of{" "}
            <Link to="/services/patient-care" className="text-primary font-medium hover:underline underline-offset-4">
              Patient Care at Home
            </Link>
            ,{" "}
            <Link to="/services/elder-care" className="text-primary font-medium hover:underline underline-offset-4">
              Elder Care at Home
            </Link>
            , or{" "}
            <Link to="/services/home-nursing" className="text-primary font-medium hover:underline underline-offset-4">
              Nursing Care at Home
            </Link>
            , depending on whether the need is recovery support, senior caregiving, or clinical nursing.
          </p>
          <p className="mt-4 text-muted-foreground font-light leading-relaxed">
            Families in Pune and Pimpri-Chinchwad (PCMC) typically choose 24 Hour Home Care after hospital discharge,
            for bedridden patients, or when elders need overnight presence. A CareNest coordinator helps match the
            right service and confirms timing after a short consult.
          </p>
          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm">
            <Link to="/services" className="font-semibold text-primary hover:underline underline-offset-4 inline-flex items-center gap-1">
              Compare services <ArrowRight size={14} />
            </Link>
            <Link to="/locations/pune" className="font-semibold text-primary hover:underline underline-offset-4 inline-flex items-center gap-1">
              Care in Pune <ArrowRight size={14} />
            </Link>
            <Link to="/locations/pimpri-chinchwad" className="font-semibold text-primary hover:underline underline-offset-4 inline-flex items-center gap-1">
              Care in PCMC <ArrowRight size={14} />
            </Link>
            <Link to="/contact" className="font-semibold text-primary hover:underline underline-offset-4 inline-flex items-center gap-1">
              Request a care plan <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE */}
      <section className="bg-muted/40 border-y border-border/50 py-16 md:py-20">
        <div className="container-lux">
          <div className="max-w-2xl mb-10">
            <div className="overline text-accent">Why CareNest</div>
            <h2 className="font-serif text-3xl md:text-4xl mt-3 tracking-tight">Why choose CareNest</h2>
            <p className="mt-3 text-muted-foreground font-light">
              Simple, reliable home care with a human coordinator — not a call centre script.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {WHY_CHOOSE.map((item) => (
              <div key={item.title} className="rounded-2xl border border-border/70 bg-card/80 p-5">
                <h3 className="font-serif text-xl">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground font-light leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="relative py-16 md:py-24 bg-royal text-white">
        <div className="container-lux relative">
          <div className="max-w-2xl">
            <div className="overline text-gold-light">Process</div>
            <h2 className="font-serif text-3xl md:text-4xl mt-3 tracking-tight">
              How our care service works
            </h2>
          </div>
          <div className="mt-10 grid md:grid-cols-3 gap-5">
            {HOW_IT_WORKS.map((s) => (
              <div key={s.n} className="rounded-3xl bg-white/5 border border-white/10 p-6">
                <div className="font-serif text-4xl text-gold">{s.n}</div>
                <h3 className="font-serif text-2xl mt-3">{s.t}</h3>
                <p className="mt-2 text-white/75 font-light leading-relaxed text-sm">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ENQUIRY */}
      <section id="enquire" className="container-lux py-16 md:py-24">
        <div className="grid lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-5">
            <div className="overline text-accent">Enquire</div>
            <h2 className="font-serif text-3xl md:text-4xl mt-3 tracking-tight">
              Tell us what your family needs.
            </h2>
            <p className="mt-4 text-muted-foreground font-light leading-relaxed">
              A CareNest coordinator in Pune or PCMC will call you back with a clear plan — usually the same day.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <a
                href={`tel:${COMPANY.phone.replace(/\s/g, "")}`}
                className="btn-gold"
                onClick={() => trackPhoneClick({ location: "home-enquire" })}
              >
                <Phone size={16} /> {COMPANY.phone}
              </a>
              <a
                href={`https://wa.me/${COMPANY.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="btn-outline"
                onClick={() => trackWhatsAppClick({ location: "home-enquire" })}
              >
                <MessageCircle size={16} /> WhatsApp
              </a>
            </div>
          </div>
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-border/70 bg-card/70 p-6 md:p-8 shadow-lux">
              <LeadForm variant="home" title="Request a callback" />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
