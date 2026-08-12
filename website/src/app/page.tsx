import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CTAButtons } from "@/components/CTAButtons";
import { JsonLd } from "@/components/JsonLd";
import { LeadForm } from "@/components/LeadForm";
import { COMPANY } from "@/data/company";
import { SERVICES } from "@/data/services";
import { localBusinessSchema, organizationSchema, websiteSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Care at Home in Pune | CareNest Home Health",
  description:
    "CareNest Home Health provides professional home care support in Pune — elder care, nursing, caregiver and specialised care services. Call or WhatsApp to enquire.",
  path: "/",
  keywords: [
    "care at home Pune",
    "home nursing Pune",
    "elder care Pune",
    "CareNest Home Health",
    "caregiver services Pune",
  ],
});

const WHY = [
  {
    title: "Trained care support",
    text: "We arrange suitable caregivers, attendants or nursing support based on the needs you describe — not a one-size script.",
  },
  {
    title: "Family communication",
    text: "Clear updates for the people who need them. Call and WhatsApp stay easy to reach.",
  },
  {
    title: "Service coordination",
    text: "A coordinator helps match requirements, timing and follow-up as care needs change.",
  },
  {
    title: "Home-based dignity",
    text: "Support is delivered in the familiar environment of home, with privacy and respect at the centre.",
  },
];

const STEPS = [
  {
    n: "1",
    t: "Contact CareNest",
    d: "Call, WhatsApp or submit a short enquiry with locality and the type of help needed.",
  },
  {
    n: "2",
    t: "Discuss care requirements",
    d: "A coordinator listens to routines, clinical notes you choose to share, and preferred timing.",
  },
  {
    n: "3",
    t: "Suitable care support is arranged",
    d: "We match caregiver, attendant or nursing support appropriate to the situation.",
  },
  {
    n: "4",
    t: "Coordination and follow-up",
    d: "Stay in touch for adjustments, questions and ongoing service coordination.",
  },
];

export default function HomePage() {
  return (
    <>
      <JsonLd data={organizationSchema()} />
      <JsonLd data={localBusinessSchema()} />
      <JsonLd data={websiteSchema()} />

      <section className="hero">
        <div className="hero-media">
          <Image
            src="/brand-kit/social/hero-banner.jpg"
            alt="CareNest home care support for families in Pune"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div className="hero-overlay" aria-hidden="true" />
        <div className="hero-content container-cn">
          <p className="eyebrow text-[var(--gold)] fade-up">CareNest Home Health</p>
          <h1 className="text-white text-4xl sm:text-5xl md:text-6xl max-w-3xl mt-3 fade-up">
            Care at Home in Pune
          </h1>
          <p className="mt-4 max-w-2xl text-white/90 text-lg fade-up-delay">
            Professional home care support for seniors, patients and new mothers — arranged with clear
            coordination so families know who to call and what happens next.
          </p>
          <div className="mt-8 fade-up-delay">
            <CTAButtons location="hero" />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-cn">
          <div className="max-w-2xl">
            <p className="eyebrow">Our services</p>
            <h2 className="text-3xl md:text-4xl mt-2">Eleven focused home care services</h2>
            <p className="prose-cn mt-3">
              Browse the CareNest services families most often request in Pune. Each page explains who it
              helps and how support is arranged.
            </p>
          </div>
          <ul className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SERVICES.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/services/${s.slug}`}
                  className="block h-full rounded-2xl border border-[rgba(13,59,102,0.08)] bg-white/70 p-5 hover:border-[var(--teal)] transition-colors"
                >
                  <h3 className="text-xl text-[var(--royal)]">{s.name}</h3>
                  <p className="mt-2 text-sm text-[var(--muted)]">{s.tagline}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section bg-white/50 border-y border-[var(--line)]">
        <div className="container-cn">
          <div className="max-w-2xl">
            <p className="eyebrow">Why families choose CareNest</p>
            <h2 className="text-3xl md:text-4xl mt-2">Trust built through clear coordination</h2>
            <p className="prose-cn mt-3">
              We do not promise medical outcomes. We focus on arranging suitable home care support and
              keeping families informed.
            </p>
          </div>
          <ul className="mt-10 grid md:grid-cols-2 gap-5">
            {WHY.map((item) => (
              <li key={item.title} className="card-soft">
                <h3 className="text-2xl">{item.title}</h3>
                <p className="prose-cn mt-2">{item.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="container-cn">
          <div className="max-w-2xl">
            <p className="eyebrow">How CareNest works</p>
            <h2 className="text-3xl md:text-4xl mt-2">A simple path from enquiry to support</h2>
          </div>
          <ol className="mt-10 grid md:grid-cols-4 gap-4">
            {STEPS.map((step) => (
              <li key={step.n} className="card-soft">
                <div className="text-[var(--gold-dark)] font-extrabold text-sm tracking-widest">STEP {step.n}</div>
                <h3 className="text-xl mt-2">{step.t}</h3>
                <p className="prose-cn mt-2 text-sm">{step.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section" id="enquiry">
        <div className="container-cn grid lg:grid-cols-2 gap-10 items-start">
          <div>
            <p className="eyebrow">Talk to CareNest</p>
            <h2 className="text-3xl md:text-4xl mt-2">Ready to enquire?</h2>
            <p className="prose-cn mt-3">
              Call or WhatsApp for a quick conversation, or send the form. Please avoid sharing sensitive
              medical records online — a coordinator will guide next steps.
            </p>
            <p className="mt-6 phone-emphasis">
              <a href={`tel:${COMPANY.phoneTel}`}>{COMPANY.phoneDisplay}</a>
            </p>
            <div className="mt-6">
              <CTAButtons location="home-enquiry" showEnquire={false} />
            </div>
          </div>
          <LeadForm mode="enquiry" id="home-enquiry-form" />
        </div>
      </section>
    </>
  );
}
