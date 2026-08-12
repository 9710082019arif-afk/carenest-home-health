import React from "react";
import Layout from "@/components/Layout";
import LeadForm from "@/components/LeadForm";
import SEOHead from "@/components/SEOHead";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, HeartPulse, Users, Stethoscope, ShieldCheck, Clock } from "lucide-react";
import { COMPANY, SERVICES, WHY_CHOOSE, IMAGES } from "@/data/content";
import { PHONE_HREF, PHONE_DISPLAY, WHATSAPP_HREF } from "@/lib/cta";
import { PAGE_SEO } from "@/lib/seo";
import { JsonLd, offerCatalogSchema } from "@/lib/schema";
import { trackPhoneClick, trackWhatsAppClick } from "@/lib/analytics";

const SERVICE_ICONS = {
  HeartPulse,
  Users,
  Stethoscope,
};

const SERVICE_TITLES = {
  "patient-care": "Patient Care at Home",
  "elder-care": "Elder Care at Home",
  "home-nursing": "Nursing Care at Home",
};

const Home = () => {
  return (
    <Layout>
      <SEOHead seo={PAGE_SEO.home} />
      <JsonLd data={offerCatalogSchema()} />

      {/* HERO — brand + one headline + CTAs above the fold */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img
            src={IMAGES.heroPrimary}
            alt=""
            role="presentation"
            className="absolute inset-0 h-full w-full object-cover opacity-30"
            fetchPriority="high"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#F7F4EF] via-[#F7F4EF]/92 to-primary/15" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(37,211,102,0.08),transparent_50%)]" />
        </div>

        <div className="container-lux pt-8 md:pt-14 pb-12 md:pb-16 max-w-3xl">
          <p className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-medium tracking-tight text-primary leading-[1.05]">
            CareNest <span className="text-gold">Home Health</span>
          </p>
          <h1 className="mt-4 md:mt-5 font-serif font-medium tracking-tight leading-[1.15] text-2xl sm:text-3xl md:text-4xl text-foreground/90">
            Patient, elder &amp; nursing care — at home.
          </h1>
          <p className="mt-4 max-w-xl text-base md:text-lg text-muted-foreground font-light leading-relaxed">
            Trusted home healthcare with verified professionals. Call or WhatsApp now — a care coordinator will help you today.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 md:gap-4">
            <a
              href={WHATSAPP_HREF}
              target="_blank"
              rel="noreferrer"
              data-testid="hero-whatsapp"
              className="btn-cta-whatsapp w-full sm:w-auto min-h-[56px] md:min-h-[60px] md:px-9"
              onClick={() => trackWhatsAppClick({ location: "home-hero" })}
            >
              <WhatsAppIcon size={26} />
              WhatsApp Now
            </a>
            <a
              href={PHONE_HREF}
              data-testid="hero-call-now"
              className="btn-cta-call w-full sm:w-auto min-h-[56px] md:min-h-[60px] md:px-9"
              onClick={() => trackPhoneClick({ location: "home-hero" })}
            >
              <Phone size={24} strokeWidth={2.5} />
              Call Now: {PHONE_DISPLAY}
            </a>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck size={16} className="text-primary" /> Background-verified staff
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock size={16} className="text-primary" /> 24×7 care coordination
            </span>
          </div>
        </div>
      </section>

      {/* THREE SERVICES ONLY */}
      <section id="services" className="container-lux py-14 md:py-20">
        <div className="max-w-2xl mb-9">
          <h2 className="font-serif text-3xl md:text-4xl tracking-tight text-primary">
            Our home care services
          </h2>
          <p className="mt-3 text-muted-foreground font-light">
            Three focused services — nothing else to navigate.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {SERVICES.map((s) => {
            const Icon = SERVICE_ICONS[s.icon] || HeartPulse;
            return (
              <article
                key={s.slug}
                data-testid={`service-card-${s.slug}`}
                className="rounded-3xl border border-border/70 bg-card p-6 md:p-7 shadow-lux flex flex-col"
              >
                <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary grid place-items-center">
                  <Icon size={22} />
                </div>
                <h3 className="mt-5 font-serif text-[22px] md:text-[24px] leading-tight font-medium text-primary">
                  {SERVICE_TITLES[s.slug] || s.name}
                </h3>
                <p className="mt-2.5 text-sm text-muted-foreground font-light leading-relaxed flex-1">
                  {s.short}
                </p>
                <div className="mt-5 flex flex-col gap-2">
                  <a
                    href={WHATSAPP_HREF}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-cta-whatsapp w-full py-3 text-sm"
                    onClick={() => trackWhatsAppClick({ location: `service-${s.slug}` })}
                  >
                    <WhatsAppIcon size={18} /> WhatsApp Now
                  </a>
                  <Link
                    to={`/services/${s.slug}`}
                    className="text-center text-sm font-semibold text-primary hover:underline underline-offset-4 py-1"
                  >
                    Learn more
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* WHY CHOOSE */}
      <section id="why" className="bg-muted/50 border-y border-border/50 py-14 md:py-16">
        <div className="container-lux">
          <div className="max-w-2xl mb-9">
            <h2 className="font-serif text-3xl md:text-4xl tracking-tight text-primary">
              Why choose CareNest
            </h2>
            <p className="mt-3 text-muted-foreground font-light">
              Simple, reliable home care with a human coordinator — not a call centre script.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {WHY_CHOOSE.map((item) => (
              <div key={item.title} className="rounded-2xl border border-border/70 bg-card p-5">
                <h3 className="font-serif text-xl text-primary">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground font-light leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SHORT ENQUIRY FORM */}
      <section id="enquire" className="container-lux py-14 md:py-20">
        <div className="grid lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-5">
            <h2 className="font-serif text-3xl md:text-4xl tracking-tight text-primary">
              Request a callback
            </h2>
            <p className="mt-4 text-muted-foreground font-light leading-relaxed">
              Share a few details and a CareNest coordinator will call you back — usually the same day.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <a
                href={PHONE_HREF}
                className="btn-cta-call w-full sm:w-auto"
                onClick={() => trackPhoneClick({ location: "home-enquire" })}
              >
                <Phone size={20} /> Call Now: {PHONE_DISPLAY}
              </a>
              <a
                href={WHATSAPP_HREF}
                target="_blank"
                rel="noreferrer"
                className="btn-cta-whatsapp w-full sm:w-auto"
                onClick={() => trackWhatsAppClick({ location: "home-enquire" })}
              >
                <WhatsAppIcon size={20} /> WhatsApp Now
              </a>
            </div>
          </div>
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-border/70 bg-card p-6 md:p-8 shadow-lux">
              <LeadForm variant="home" title="Quick enquiry" />
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="bg-primary text-primary-foreground py-14 md:py-16">
        <div className="container-lux">
          <h2 className="font-serif text-3xl md:text-4xl tracking-tight">Contact CareNest</h2>
          <p className="mt-3 text-white/80 font-light max-w-xl">
            Reach us anytime — we respond quickly on call and WhatsApp.
          </p>
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <a
              href={PHONE_HREF}
              data-testid="contact-phone"
              onClick={() => trackPhoneClick({ location: "home-contact" })}
              className="flex items-start gap-3 rounded-2xl bg-white/10 border border-white/15 p-5 hover:bg-white/15 transition-colors"
            >
              <Phone size={22} className="mt-0.5 shrink-0" />
              <div>
                <div className="text-xs uppercase tracking-wide text-white/70">Call</div>
                <div className="font-serif text-xl mt-1">{PHONE_DISPLAY}</div>
              </div>
            </a>
            <a
              href={WHATSAPP_HREF}
              target="_blank"
              rel="noreferrer"
              data-testid="contact-whatsapp"
              onClick={() => trackWhatsAppClick({ location: "home-contact" })}
              className="flex items-start gap-3 rounded-2xl bg-whatsapp text-white p-5 hover:brightness-105 transition-[filter]"
            >
              <WhatsAppIcon size={22} className="mt-0.5 shrink-0" />
              <div>
                <div className="text-xs uppercase tracking-wide text-white/90">WhatsApp</div>
                <div className="font-serif text-xl mt-1">Chat with us now</div>
              </div>
            </a>
            <a
              href={`mailto:${COMPANY.email}`}
              data-testid="contact-email"
              className="flex items-start gap-3 rounded-2xl bg-white/10 border border-white/15 p-5 hover:bg-white/15 transition-colors"
            >
              <Mail size={22} className="mt-0.5 shrink-0" />
              <div>
                <div className="text-xs uppercase tracking-wide text-white/70">Email</div>
                <div className="font-serif text-lg mt-1 break-all">{COMPANY.email}</div>
              </div>
            </a>
          </div>
          <div className="mt-5 flex items-start gap-3 text-white/75 text-sm">
            <MapPin size={18} className="mt-0.5 shrink-0" />
            <span>{COMPANY.address}</span>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
