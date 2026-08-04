import React from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import PageHeader from "@/components/PageHeader";
import SEOHead from "@/components/SEOHead";
import { LOCATIONS, SERVICES, IMAGES, COMPANY, FAQS } from "@/data/content";
import { PAGE_SEO } from "@/lib/seo";
import { JsonLd, locationsListSchema, breadcrumbSchema, faqPageSchema } from "@/lib/schema";
import { MapPin, ArrowRight, Phone, ShieldCheck } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const featured = ["home-nursing", "icu-at-home", "doctor-at-home", "elder-care", "physiotherapy-at-home", "caregiver-services"];

const locationFaqs = [
  {
    q: "Which Indian cities does CareNest serve?",
    a: "We currently provide home healthcare across Pune, Pimpri-Chinchwad, Mumbai, Navi Mumbai, Thane, Bengaluru, Hyderabad, Delhi NCR, Ranchi, Bhubaneswar, Kolkata and Goa — with local care coordination in each market.",
  },
  {
    q: "Can I book home nursing in my city today?",
    a: "Yes. For most non-critical services we deploy within 4–8 hours of confirmation in metros. Open your city page below or call +91 9175724546 for same-day availability.",
  },
  {
    q: "Do city pages list every service?",
    a: "Each city hub links to local service pages (for example Home Nursing in Pune or ICU-at-home in Mumbai) so you can book the exact care you need near you.",
  },
  ...FAQS.slice(0, 3),
];

const Locations = () => (
  <Layout>
    <SEOHead seo={PAGE_SEO.locations} />
    <JsonLd data={locationsListSchema()} />
    <JsonLd data={faqPageSchema(locationFaqs)} />
    <JsonLd data={breadcrumbSchema([{ label: "Home", to: "/" }, { label: "Locations", to: "/locations" }])} />
    <PageHeader
      eyebrow="Where we care"
      title={<>Home healthcare across <span className="text-gold italic">12 Indian cities.</span></>}
      subtitle="Local care managers, background-verified staff and same-day deployment — wherever your family needs us."
      image={IMAGES.doctorHome}
      imageAlt="CareNest home healthcare across Indian cities"
      crumbs={[{ label: "Locations" }]}
    />

    <section className="container-lux pb-12 max-w-3xl">
      <h2 className="font-serif text-2xl md:text-3xl tracking-tight">Find CareNest Home Health near you</h2>
      <p className="mt-4 text-muted-foreground text-lg font-light leading-relaxed">
        This locations directory covers every city where CareNest delivers home nursing, doctor-at-home visits,
        ICU-at-home setup, physiotherapy, caregivers, elder care and medical equipment rental. Choose your city
        for local coverage details, service links and a free care consult — or call{" "}
        <a className="text-primary font-medium underline-offset-4 hover:underline" href={`tel:${COMPANY.phone.replace(/\s/g, "")}`}>
          {COMPANY.phone}
        </a>.
      </p>
      <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-2"><ShieldCheck size={16} className="text-secondary" /> Verified professionals</span>
        <span className="inline-flex items-center gap-2"><MapPin size={16} className="text-secondary" /> 12 cities · suburbs covered</span>
        <span className="inline-flex items-center gap-2"><Phone size={16} className="text-secondary" /> 24×7 care coordination</span>
      </div>
    </section>

    <section className="container-lux pb-16" aria-labelledby="cities-heading">
      <h2 id="cities-heading" className="font-serif text-2xl md:text-3xl tracking-tight mb-8">All CareNest service cities</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {LOCATIONS.map((l) => (
          <Link
            key={l.slug}
            to={`/locations/${l.slug}`}
            data-testid={`locations-hub-${l.slug}`}
            className="group rounded-3xl border border-border/70 bg-card/60 p-7 hover:shadow-lux-hover hover:-translate-y-0.5 transition-all"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-serif text-2xl tracking-tight">{l.name}</div>
                <div className="text-sm text-muted-foreground mt-1">{l.state}</div>
              </div>
              <MapPin size={18} className="text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
            </div>
            <p className="mt-4 text-sm text-muted-foreground font-light leading-relaxed">
              Home nursing, ICU-at-home, doctor visits, physiotherapy and elder care across {l.name} & suburbs.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {featured.slice(0, 3).map((slug) => {
                const s = SERVICES.find((x) => x.slug === slug);
                if (!s) return null;
                return (
                  <span
                    key={slug}
                    className="rounded-full border border-border/70 px-2.5 py-1 text-[11px] text-muted-foreground"
                  >
                    {s.name}
                  </span>
                );
              })}
            </div>
            <div className="mt-6 text-sm font-medium text-primary flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
              Explore care in {l.name} <ArrowRight size={14} />
            </div>
          </Link>
        ))}
      </div>
    </section>

    <section className="container-lux pb-16">
      <div className="rounded-3xl border border-border/70 bg-muted/30 p-8 md:p-10">
        <div className="overline text-accent">Popular city × service pages</div>
        <h2 className="font-serif text-2xl md:text-3xl mt-3 tracking-tight">Jump to care near you</h2>
        <p className="mt-3 text-muted-foreground font-light max-w-2xl">
          Indexed local landing pages for the services families ask for most — each with city-specific copy and booking.
        </p>
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {LOCATIONS.filter((l) => l.featured).flatMap((l) =>
            featured.map((slug) => {
              const s = SERVICES.find((x) => x.slug === slug);
              if (!s) return null;
              return (
                <Link
                  key={`${l.slug}-${slug}`}
                  to={`/locations/${l.slug}/${slug}`}
                  className="rounded-2xl border border-border/70 bg-background p-4 text-sm hover:shadow-lux transition-shadow"
                >
                  <span className="font-medium">{s.name}</span>
                  <span className="text-muted-foreground"> in {l.name}</span>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </section>

    <section className="container-lux pb-24 grid lg:grid-cols-12 gap-10">
      <div className="lg:col-span-4">
        <div className="overline text-accent">Locations FAQ</div>
        <h2 className="font-serif text-3xl mt-3 tracking-tight">Questions about coverage</h2>
        <p className="mt-3 text-muted-foreground font-light">Still unsure if we reach your PIN code? WhatsApp or call — a coordinator will confirm in minutes.</p>
        <Link to="/book-appointment" className="btn-outline mt-6 inline-flex">Book in your city <ArrowRight size={16}/></Link>
      </div>
      <div className="lg:col-span-8">
        <Accordion type="single" collapsible className="space-y-3">
          {locationFaqs.map((f, i) => (
            <AccordionItem key={f.q} value={`lq${i}`} className="rounded-2xl border border-border/70 bg-card/60 px-5">
              <AccordionTrigger className="text-left font-serif text-lg md:text-xl py-5 hover:no-underline">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-[15px] leading-relaxed pb-5 font-light">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  </Layout>
);

export default Locations;
