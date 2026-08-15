import React from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import PageHeader from "@/components/PageHeader";
import { TEAM, IMAGES, COMPANY } from "@/data/content";
import { ShieldCheck, HeartHandshake, Clock, MapPin } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import { PAGE_SEO } from "@/lib/seo";
import { JsonLd, aboutPageSchema, breadcrumbSchema, organizationSchema } from "@/lib/schema";

const values = [
  { icon: HeartHandshake, t: "Care with dignity", d: "Every patient is treated the way we'd want our own parents treated." },
  { icon: ShieldCheck, t: "Verified excellence", d: "Background-verified staff and clear home-care protocols." },
  { icon: Clock, t: "Responsive coordination", d: "Call or WhatsApp — a care coordinator helps you plan quickly." },
  { icon: MapPin, t: "Pune & PCMC first", d: "Our primary focus is reliable care at home across Pune and Pimpri-Chinchwad." },
];

const About = () => (
  <Layout>
    <SEOHead seo={PAGE_SEO.about} />
    <JsonLd data={organizationSchema()} />
    <JsonLd data={aboutPageSchema()} />
    <JsonLd data={breadcrumbSchema([{ label: "Home", to: "/" }, { label: "About", to: "/about" }])} />
    <PageHeader
      eyebrow="About us"
      title="CareNest brings skilled care into the home."
      subtitle="Founded to make Patient Care at Home, Elder Care at Home and Nursing Care at Home available with dignity — starting in Pune and PCMC."
      image={IMAGES.elderCare}
      crumbs={[{ label: "About" }]}
    />

    <section className="container-lux pb-14 grid lg:grid-cols-12 gap-10">
      <div className="lg:col-span-7">
        <div className="overline text-accent">Our story</div>
        <h2 className="font-serif text-3xl md:text-4xl mt-3 tracking-tight">Home is where healing begins.</h2>
        <div className="mt-6 space-y-4 text-muted-foreground text-lg font-light leading-relaxed">
          <p>
            <b className="text-foreground">Riya Shaikh</b> founded CareNest Home Health so families could get dependable care
            at home — without confusion, delay or cold institutional feel.
          </p>
          <p>
            Today we focus on three services in Pune and Pimpri-Chinchwad (PCMC):{" "}
            <b className="text-foreground">Patient Care at Home</b>,{" "}
            <b className="text-foreground">Elder Care at Home</b>, and{" "}
            <b className="text-foreground">Nursing Care at Home</b> — including 24 Hour Home Care when continuous
            support is needed.
          </p>
          <p>
            Call{" "}
            <a className="text-primary font-medium" href={`tel:${COMPANY.phone.replace(/\s/g, "")}`}>
              {COMPANY.phone}
            </a>{" "}
            to speak with a coordinator, or{" "}
            <Link to="/contact" className="text-primary font-medium hover:underline underline-offset-4">
              contact CareNest
            </Link>{" "}
            online.
          </p>
          <div className="pt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm">
            <Link to="/services" className="font-semibold text-primary hover:underline underline-offset-4">
              View our services →
            </Link>
            <Link to="/services/elder-care" className="font-semibold text-primary hover:underline underline-offset-4">
              Elder Care &amp; caregivers →
            </Link>
            <Link to="/locations/pune" className="font-semibold text-primary hover:underline underline-offset-4">
              Care in Pune →
            </Link>
            <Link to="/locations/pimpri-chinchwad" className="font-semibold text-primary hover:underline underline-offset-4">
              Care in PCMC →
            </Link>
            <Link to="/contact" className="font-semibold text-primary hover:underline underline-offset-4">
              Contact us →
            </Link>
          </div>
        </div>
      </div>
      <div className="lg:col-span-5">
        <div className="rounded-3xl overflow-hidden aspect-[4/5] shadow-lux ring-1 ring-black/5 max-w-md">
          <img
            src={TEAM[0].img}
            alt={`${TEAM[0].name}, ${TEAM[0].role}`}
            className="h-full w-full object-cover bg-primary"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="mt-4">
          <div className="font-serif text-2xl">{TEAM[0].name}</div>
          <div className="text-sm text-muted-foreground">{TEAM[0].role}</div>
        </div>
      </div>
    </section>

    <section className="container-lux pb-20">
      <div className="overline text-accent">What we stand for</div>
      <h2 className="font-serif text-3xl mt-3 tracking-tight">Values that shape every visit.</h2>
      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {values.map(({ icon: Icon, t, d }) => (
          <div key={t} className="rounded-2xl border border-border/70 bg-card/60 p-5">
            <div className="h-11 w-11 rounded-2xl bg-primary/10 text-primary grid place-items-center">
              <Icon size={18} />
            </div>
            <div className="font-serif text-xl mt-4">{t}</div>
            <p className="text-sm text-muted-foreground mt-2 font-light">{d}</p>
          </div>
        ))}
      </div>
    </section>
  </Layout>
);

export default About;
