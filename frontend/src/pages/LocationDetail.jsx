import React from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import PageHeader from "@/components/PageHeader";
import LeadForm from "@/components/LeadForm";
import SEOHead from "@/components/SEOHead";
import { LOCATIONS, SERVICES, COMPANY, TESTIMONIALS, FAQS, IMAGES } from "@/data/content";
import { Phone, MessageCircle, MapPin, CheckCircle2, Star } from "lucide-react";
import { JsonLd, faqPageSchema, breadcrumbSchema, locationBusinessSchema } from "@/lib/schema";
import { locationSeo } from "@/lib/seo";

const featuredServices = ["home-nursing","icu-at-home","doctor-at-home","physiotherapy-at-home","medical-equipment-rental","bedridden-patient-care","post-operative-care","elder-care","caregiver-services"];

const LocationDetail = () => {
  const { slug } = useParams();
  const loc = LOCATIONS.find((l) => l.slug === slug);
  if (!loc) return <Navigate to="/locations" replace />;

  const cityTestimonials = TESTIMONIALS.filter((t) => t.city.toLowerCase() === loc.name.toLowerCase());

  return (
    <Layout>
      <SEOHead seo={locationSeo(loc)} />
      <JsonLd data={locationBusinessSchema(loc)} />
      <JsonLd data={faqPageSchema(FAQS.slice(0, 5))} />
      <JsonLd data={breadcrumbSchema([{ label: "Home", to: "/" }, { label: "Locations", to: "/locations" }, { label: loc.name, to: `/locations/${loc.slug}` }])} />
      <PageHeader
        eyebrow={loc.state}
        title={<>Home healthcare in <span className="text-gold italic">{loc.name}</span></>}
        subtitle={`Skilled nurses, doctors, physiotherapists and caregivers — deployed at your doorstep across ${loc.name}. Same-day care coordination.`}
        image={IMAGES.doctorHome}
        imageAlt={`Home healthcare services in ${loc.name} by CareNest Home Health`}
        crumbs={[{ label: "Locations", to: "/locations" }, { label: loc.name }]}
      />

      <section className="container-lux pb-16 grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
          <div className="rounded-3xl border border-border/70 bg-card/60 p-6 md:p-8">
            <h2 className="font-serif text-3xl md:text-4xl tracking-tight">Why families in {loc.name} choose CareNest</h2>
            <div className="mt-6 grid md:grid-cols-2 gap-3">
              {[
                `Local care manager based in ${loc.name}`,
                `Same-day deployment across ${loc.name} & suburbs`,
                "Verified nurses, physios and doctors",
                "Insurance-ready invoices & claim support",
                "24×7 emergency escalation",
                "Cashless equipment rental delivery",
              ].map((it) => (
                <div key={it} className="flex items-start gap-3 rounded-2xl border border-border/60 p-4 bg-background/50">
                  <CheckCircle2 size={18} className="text-secondary mt-0.5 shrink-0" />
                  <div className="text-sm">{it}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="overline text-accent">Services in {loc.name}</div>
            <h3 className="font-serif text-2xl md:text-3xl mt-3 tracking-tight">Care catalogue for {loc.name}</h3>
            <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-3">
              {featuredServices.map((sl) => {
                const s = SERVICES.find((x) => x.slug === sl); if (!s) return null;
                return (
                  <Link key={s.slug} to={`/locations/${loc.slug}/${s.slug}`} className="rounded-2xl border border-border/70 bg-card/50 p-4 hover:shadow-lux transition-shadow">
                    <div className="font-medium">{s.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">in {loc.name}</div>
                  </Link>
                );
              })}
            </div>
            <div className="mt-4">
              <Link to={`/services`} className="text-sm font-medium text-primary hover:underline underline-offset-4">
                See all 22 services →
              </Link>
            </div>
          </div>

          <div className="rounded-3xl overflow-hidden border border-border/70 h-[320px]">
            <iframe title={`Map of CareNest home healthcare coverage in ${loc.name}, India`}
              src={`https://www.google.com/maps?q=${encodeURIComponent(loc.name + ', India')}&output=embed`}
              className="w-full h-full" loading="lazy" />
          </div>

          {cityTestimonials.length > 0 && (
            <div>
              <div className="overline text-accent">Local reviews</div>
              <h3 className="font-serif text-2xl md:text-3xl mt-3 tracking-tight">Families from {loc.name}</h3>
              <div className="mt-6 grid md:grid-cols-2 gap-4">
                {cityTestimonials.map((t) => (
                  <div key={t.id} className="rounded-3xl border border-border/70 bg-card/60 p-6">
                    <div className="flex items-center gap-1 mb-3">{Array.from({length: t.rating}).map((_, k) => <Star key={k} size={13} className="fill-accent text-accent"/>)}</div>
                    <p className="font-serif text-lg leading-snug">{t.text}</p>
                    <div className="mt-4 text-xs text-muted-foreground">— {t.name}, {t.relation}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <div className="overline text-accent">FAQ</div>
            <h3 className="font-serif text-2xl md:text-3xl mt-3 tracking-tight">Common questions from {loc.name}</h3>
            <div className="mt-6 space-y-3">
              {FAQS.slice(0, 5).map((f, i) => (
                <details key={i} className="group rounded-2xl border border-border/70 bg-card/60 p-5">
                  <summary className="cursor-pointer font-serif text-lg font-medium">{f.q}</summary>
                  <p className="mt-3 text-muted-foreground font-light leading-relaxed">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>

        <aside className="lg:col-span-4">
          <div className="sticky top-32 space-y-4">
            <div className="rounded-3xl border border-border/70 bg-card/70 backdrop-blur-sm p-6 shadow-lux">
              <LeadForm variant={`location-${loc.slug}`} title={`Care in ${loc.name}?`} />
            </div>
            <div className="rounded-3xl bg-primary text-primary-foreground p-5">
              <div className="overline text-gold-light">Reach {loc.name} team</div>
              <a href={`tel:${COMPANY.phone.replace(/\s/g,'')}`} className="btn-gold w-full mt-4"><Phone size={15}/> {COMPANY.phone}</a>
              <a href={`https://wa.me/${COMPANY.whatsapp}?text=${encodeURIComponent('Hi, I need home healthcare in ' + loc.name)}`} target="_blank" rel="noopener noreferrer" className="btn-outline w-full mt-3 border-white/30 text-white hover:bg-white/10"><MessageCircle size={15}/> WhatsApp</a>
              <div className="mt-4 flex items-center gap-2 text-xs text-white/80"><MapPin size={13}/> Serving {loc.name} & suburbs</div>
            </div>
          </div>
        </aside>
      </section>
    </Layout>
  );
};

export default LocationDetail;
