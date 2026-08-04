import React from "react";
import Layout from "@/components/Layout";
import LeadForm from "@/components/LeadForm";
import ServiceCard from "@/components/ServiceCard";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { Phone, MessageCircle, Ambulance, ArrowRight, ShieldCheck, Star, MapPin, Clock, HeartPulse } from "lucide-react";
import { COMPANY, SERVICES, STATS, TEAM, LOCATIONS, TRUST_BADGES, PARTNERS, IMAGES, FAQS } from "@/data/content";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PAGE_SEO } from "@/lib/seo";
import { JsonLd, organizationSchema, websiteSchema, offerCatalogSchema, faqPageSchema } from "@/lib/schema";

const featuredServices = ["home-nursing","icu-at-home","doctor-at-home","physiotherapy-at-home","elder-care","post-operative-care","medical-equipment-rental","24x7-nursing-care"];

const Home = () => {
  return (
    <Layout>
      <SEOHead seo={PAGE_SEO.home} />
      <JsonLd data={organizationSchema()} />
      <JsonLd data={websiteSchema()} />
      <JsonLd data={offerCatalogSchema()} />
      <JsonLd data={faqPageSchema(FAQS.slice(0, 6))} />
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary/5" />
          <div className="absolute -top-40 -right-40 h-[520px] w-[520px] rounded-full bg-secondary/15 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-[520px] w-[520px] rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute inset-0 noise opacity-30" />
        </div>

        <div className="container-lux pt-10 md:pt-16 pb-20 md:pb-28 grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-7 relative">
            <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-[11px] font-semibold tracking-wide text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              12,400+ families cared for · 4.9★ on Google
            </div>
            <h1 className="mt-6 font-serif font-medium tracking-tight leading-[1.02] text-5xl md:text-6xl lg:text-[68px]">
              Professional home
              <br /> healthcare, <span className="text-gold italic">delivered.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg md:text-[19px] text-muted-foreground font-light leading-relaxed">
              Trusted nurses, physicians, physiotherapists and caregivers — coordinated by a care manager, always at your doorstep. Available across 12 Indian cities.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/book-appointment" data-testid="hero-book-appointment" className="btn-gold">
                <Ambulance size={16}/> Book appointment
              </Link>
              <a href={`tel:${COMPANY.phone.replace(/\s/g,'')}`} data-testid="hero-call-now" className="btn-primary">
                <Phone size={16}/> Call now
              </a>
              <a href={`https://wa.me/${COMPANY.whatsapp}`} target="_blank" rel="noreferrer" data-testid="hero-whatsapp" className="btn-outline">
                <MessageCircle size={16}/> WhatsApp
              </a>
              <a href={`tel:${COMPANY.phone.replace(/\s/g,'')}`} data-testid="hero-emergency" className="hidden md:inline-flex items-center gap-2 text-sm font-semibold text-destructive hover:underline underline-offset-4 ml-2">
                <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive/70"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-destructive"></span></span>
                Emergency support 24×7
              </a>
            </div>

            <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
              {STATS.map((s) => (
                <div key={s.label} className="rounded-2xl border border-border/70 bg-card/60 backdrop-blur-sm p-4">
                  <div className="font-serif text-2xl md:text-3xl font-medium text-primary">{s.value}</div>
                  <div className="text-xs text-muted-foreground mt-1 tracking-wide">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero visual + floating card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-[36px] overflow-hidden shadow-lux-hover ring-1 ring-black/5">
              <img src={IMAGES.heroPrimary} loading="eager" alt="Indian nurse caring for elderly patient at home — CareNest Home Health" className="w-full h-[520px] md:h-[600px] object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-primary/10 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="glass-strong rounded-2xl p-4 flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {TEAM.map((t) => (<img key={t.name} src={t.img} alt={`${t.name}, ${t.role}`} className="h-9 w-9 rounded-full border-2 border-white object-cover" />))}
                    <div className="h-9 w-9 rounded-full border-2 border-white bg-secondary text-white grid place-items-center text-[11px] font-bold">+400</div>
                  </div>
                  <div className="text-xs">
                    <div className="font-semibold">Meet your care team</div>
                    <div className="text-muted-foreground">Founder-led · 400+ verified professionals</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden md:block absolute -left-10 top-16 glass-strong rounded-2xl p-4 w-[220px] shadow-lux">
              <div className="flex items-center gap-2 text-xs font-semibold text-primary"><HeartPulse size={14}/> Vitals monitored</div>
              <div className="mt-2 font-serif text-2xl">98<span className="text-sm text-muted-foreground">/94 mmHg</span></div>
              <div className="text-[11px] text-muted-foreground">Stable · last check 10:42</div>
            </div>

            <div className="hidden md:block absolute -right-6 bottom-20 glass-strong rounded-2xl p-4 w-[240px] shadow-lux">
              <div className="flex items-center gap-2 text-xs font-semibold text-accent-foreground"><Star size={14} className="fill-accent text-accent"/> Google review · today</div>
              <p className="mt-2 text-sm leading-relaxed">"The night nurse was outstanding. Truly grateful."</p>
              <div className="mt-2 text-[11px] text-muted-foreground">— Aarti D., Pune</div>
            </div>
          </div>
        </div>

        <div className="container-lux -mt-8 pb-10">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
            {TRUST_BADGES.map((b) => (
              <div key={b.label} className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
                <ShieldCheck size={16} className="text-secondary" />
                {b.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MARQUEE trust strip */}
      <section className="py-10 border-y border-border/50 bg-muted/30 overflow-hidden">
        <div className="marquee-track gap-14 whitespace-nowrap">
          {[
            "Background-verified professionals",
            "24×7 care coordination",
            "Insurance claim support",
            "Same-day deployment",
            "Consultant-supervised protocols",
            "Digital case notes shared daily",
            "Trained in home-care hygiene",
            "Dedicated care manager per family",
          ].concat([
            "Background-verified professionals",
            "24×7 care coordination",
            "Insurance claim support",
            "Same-day deployment",
            "Consultant-supervised protocols",
            "Digital case notes shared daily",
            "Trained in home-care hygiene",
            "Dedicated care manager per family",
          ]).map((p, i) => (
            <span key={`${p}-${i}`} className="font-serif text-2xl md:text-3xl text-muted-foreground/70 tracking-tight italic">{p} ·</span>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="container-lux py-24 md:py-32">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div className="max-w-2xl">
            <div className="overline text-accent">Our care catalogue</div>
            <h2 className="font-serif text-4xl md:text-5xl mt-3 tracking-tight">Twenty-two services. <span className="text-gold italic">One phone call.</span></h2>
            <p className="mt-4 text-muted-foreground text-lg font-light">From a single injection to full ICU-at-home setup, every service is delivered by verified professionals with a dedicated care manager on call.</p>
          </div>
          <Link to="/services" className="btn-outline shrink-0">Browse all 22 <ArrowRight size={16}/></Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featuredServices.map((slug, idx) => {
            const s = SERVICES.find((x) => x.slug === slug);
            if (!s) return null;
            return <ServiceCard key={s.slug} service={s} span={idx === 0} />;
          })}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="relative py-24 md:py-32 bg-royal text-white overflow-hidden">
        <div className="absolute inset-0 noise opacity-25" />
        <div className="container-lux relative">
          <div className="max-w-3xl">
            <div className="overline text-gold-light">How it works</div>
            <h2 className="font-serif text-4xl md:text-5xl mt-3 tracking-tight">Care at home, in <span className="text-gold">three steps.</span></h2>
          </div>
          <div className="mt-14 grid md:grid-cols-3 gap-6">
            {[
              { n: "01", t: "One quick call", d: "Share the patient's condition. Our care coordinator drafts a personalised care plan in minutes." },
              { n: "02", t: "Matched, verified team", d: "We deploy a background-checked nurse/physio/doctor within hours — often the same day." },
              { n: "03", t: "Care with oversight", d: "A care manager checks in, tracks progress and re-plans as recovery evolves." },
            ].map((s) => (
              <div key={s.n} className="rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 p-7">
                <div className="font-serif text-5xl text-gold">{s.n}</div>
                <h3 className="font-serif text-2xl mt-4">{s.t}</h3>
                <p className="mt-3 text-white/75 font-light leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SPLIT: quick lead + doctors */}
      <section className="container-lux py-24 md:py-32 grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7">
          <div className="overline text-accent">The team behind the care</div>
          <h2 className="font-serif text-4xl md:text-5xl mt-3 tracking-tight">Founded by someone who <span className="text-gold italic">truly listens.</span></h2>
          <p className="mt-4 text-muted-foreground max-w-2xl font-light text-lg">Every professional is credential-verified, trained in CareNest's home-care protocols and reviewed monthly. We match personalities as carefully as skills.</p>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            {TEAM.map((t) => (
              <div key={t.name} className="rounded-3xl overflow-hidden border border-border/70 bg-card/60 shadow-lux">
                <img src={t.img} alt={`${t.name}, ${t.role} at CareNest Home Health`} className="w-full aspect-[4/5] object-cover" />
              </div>
            ))}
            <div className="rounded-3xl border border-border/70 bg-primary text-primary-foreground p-6 md:p-7">
              <div className="overline text-gold-light">Founder's promise</div>
              <p className="mt-3 font-serif text-xl leading-snug">"To bring hospital-grade care into the warmth of the home — with dignity, punctuality and a genuinely human touch."</p>
              <div className="mt-5 pt-5 border-t border-white/15 text-sm">
                <div className="font-semibold">Riya Shaikh</div>
                <div className="text-white/70 text-xs mt-0.5">Founder & Managing Director</div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="rounded-3xl border border-border/70 bg-card/70 backdrop-blur-sm p-6 md:p-8 shadow-lux">
            <LeadForm variant="home" />
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <TestimonialCarousel />

      {/* LOCATIONS */}
      <section id="locations" className="container-lux py-24 md:py-32">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="max-w-2xl">
            <div className="overline text-accent">Where we care</div>
            <h2 className="font-serif text-4xl md:text-5xl mt-3 tracking-tight">Present in <span className="text-gold italic">12 Indian cities.</span></h2>
            <p className="mt-4 text-muted-foreground text-lg font-light">Local care managers, background-verified staff and same-day deployment.</p>
          </div>
          <Link to="/locations" className="btn-outline shrink-0">All locations <ArrowRight size={16}/></Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {LOCATIONS.map((l) => (
            <Link key={l.slug} to={`/locations/${l.slug}`} data-testid={`location-${l.slug}`} className="group rounded-2xl border border-border/70 bg-card/60 p-5 hover:shadow-lux hover:-translate-y-0.5 transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-serif text-xl">{l.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">{l.state}</div>
                </div>
                <MapPin size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <div className="mt-6 text-xs text-primary/80 group-hover:text-primary font-medium flex items-center gap-1">Explore care in {l.name} <ArrowRight size={12}/></div>
            </Link>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="container-lux pb-24 md:pb-32 grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4">
          <div className="overline text-accent">Answered</div>
          <h2 className="font-serif text-4xl md:text-5xl mt-3 tracking-tight">The <span className="text-gold italic">questions</span> families ask us most.</h2>
          <p className="mt-4 text-muted-foreground font-light">Still not sure? WhatsApp us and a real human will reply within minutes.</p>
          <Link to="/faq" className="btn-outline mt-6 inline-flex">See all FAQs <ArrowRight size={16}/></Link>
        </div>
        <div className="lg:col-span-8">
          <Accordion type="single" collapsible className="space-y-3">
            {FAQS.slice(0, 6).map((f, i) => (
              <AccordionItem key={f.q} value={`q${i}`} className="rounded-2xl border border-border/70 bg-card/60 px-5">
                <AccordionTrigger data-testid={`faq-q-${i}`} className="text-left font-serif text-lg md:text-xl py-5 hover:no-underline">{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-[15px] leading-relaxed pb-5 font-light">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="container-lux pb-24">
        <div className="relative overflow-hidden rounded-[40px] p-10 md:p-16 border border-border/70">
          <img src={IMAGES.goldTexture} alt="" role="presentation" className="absolute inset-0 h-full w-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/85 to-primary/60" />
          <div className="relative text-white grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <div className="overline text-gold-light">Talk to us</div>
              <h2 className="font-serif text-4xl md:text-5xl mt-3 tracking-tight">Care starts with a <span className="text-gold">10-minute call.</span></h2>
              <p className="mt-4 max-w-2xl text-white/85 font-light text-lg">Tell us about your loved one. We'll design a plan the same day and be at your door in hours — not days.</p>
            </div>
            <div className="lg:col-span-4 flex flex-col gap-3">
              <a href={`tel:${COMPANY.phone.replace(/\s/g,'')}`} className="btn-gold w-full"><Phone size={16}/> Call {COMPANY.phone}</a>
              <a href={`https://wa.me/${COMPANY.whatsapp}`} target="_blank" rel="noreferrer" className="btn-outline w-full border-white/40 text-white hover:bg-white/10"><MessageCircle size={16}/> WhatsApp us</a>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
