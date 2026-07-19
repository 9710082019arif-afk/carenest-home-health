import React from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import PageHeader from "@/components/PageHeader";
import LeadForm from "@/components/LeadForm";
import { SERVICES, LOCATIONS, COMPANY, FAQS, IMAGES } from "@/data/content";
import * as Icons from "lucide-react";
import { Phone, MessageCircle, CheckCircle2 } from "lucide-react";
import { JsonLd, cityServiceSchema, faqPageSchema, breadcrumbSchema } from "@/lib/schema";

const CityService = () => {
  const { city, slug } = useParams();
  const loc = LOCATIONS.find((l) => l.slug === city);
  const svc = SERVICES.find((s) => s.slug === slug);

  const title = loc && svc ? `${svc.name} in ${loc.name}` : "";

  React.useEffect(() => {
    if (!title) return;
    const prev = document.title;
    document.title = `${title} · CareNest Home Health`;
    return () => { document.title = prev; };
  }, [title]);

  if (!loc || !svc) return <Navigate to="/services" replace />;
  const Icon = Icons[svc.icon] || Icons.HeartPulse;

  const subtitle = `${svc.tagline} Delivered at your doorstep across ${loc.name} and its suburbs by verified professionals — with a dedicated care manager on call.`;

  const includes = [
    `Local care coordinator based in ${loc.name}`,
    `Same-day / next-day deployment across ${loc.name}`,
    "Background-verified professional",
    "Digital case notes shared daily",
    "Insurance-ready invoices",
    "24×7 escalation to consultant",
  ];

  const otherServices = SERVICES.filter((s) => s.slug !== slug).slice(0, 6);

  return (
    <Layout>
      <JsonLd data={cityServiceSchema({ svc, loc })} />
      <JsonLd data={faqPageSchema(FAQS.slice(0, 5))} />
      <JsonLd data={breadcrumbSchema([{ label: "Home", to: "/" }, { label: "Locations" }, { label: loc.name, to: `/locations/${loc.slug}` }, { label: svc.name }])} />
      <PageHeader
        eyebrow={`${loc.name} · ${loc.state}`}
        title={title}
        subtitle={subtitle}
        image={IMAGES.nurseCare}
        imageAlt={`${svc.name} in ${loc.name}`}
        crumbs={[{ label: "Locations" }, { label: loc.name, to: `/locations/${loc.slug}` }, { label: svc.name }]}
      />

      <section className="container-lux pb-24 grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
          <div className="rounded-3xl border border-border/70 bg-card/60 p-6 md:p-8">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary grid place-items-center"><Icon size={22}/></div>
            <h2 className="font-serif text-3xl md:text-4xl mt-5 tracking-tight">Why families in {loc.name} choose CareNest for {svc.name.toLowerCase()}</h2>
            <p className="mt-4 text-muted-foreground text-[17px] leading-relaxed font-light">
              {svc.short} Our {loc.name} team designs a personalised plan around your loved one — hours, clinical scope, equipment and family preferences. A dedicated care manager coordinates every visit and adjusts the plan as recovery evolves.
            </p>
          </div>

          <div>
            <h3 className="font-serif text-2xl md:text-3xl tracking-tight">Included in every {svc.name} plan in {loc.name}</h3>
            <div className="mt-6 grid sm:grid-cols-2 gap-3">
              {includes.map((it) => (
                <div key={it} className="flex items-start gap-3 rounded-2xl border border-border/70 bg-card/50 p-4">
                  <CheckCircle2 size={18} className="text-secondary mt-0.5 shrink-0" />
                  <div className="text-sm">{it}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl overflow-hidden border border-border/70 h-[320px]">
            <iframe title="map" src={`https://www.google.com/maps?q=${encodeURIComponent(loc.name + ', India')}&output=embed`} className="w-full h-full" loading="lazy" />
          </div>

          <div>
            <h3 className="font-serif text-2xl md:text-3xl tracking-tight">Other care in {loc.name}</h3>
            <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-3">
              {otherServices.map((s) => (
                <Link key={s.slug} to={`/locations/${loc.slug}/${s.slug}`} className="rounded-2xl border border-border/70 bg-card/50 p-4 hover:shadow-lux transition-shadow">
                  <div className="font-medium">{s.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">in {loc.name}</div>
                </Link>
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
        </div>

        <aside className="lg:col-span-4">
          <div className="sticky top-32 space-y-4">
            <div className="rounded-3xl border border-border/70 bg-card/70 backdrop-blur-sm p-6 shadow-lux">
              <LeadForm variant={`city-service-${loc.slug}-${svc.slug}`} defaultService={svc.name} title={`${svc.name} in ${loc.name}?`} />
            </div>
            <div className="rounded-3xl bg-primary text-primary-foreground p-5">
              <div className="overline text-gold-light">{loc.name} team</div>
              <a href={`tel:${COMPANY.phone.replace(/\s/g,'')}`} className="btn-gold w-full mt-4"><Phone size={15}/> {COMPANY.phone}</a>
              <a href={`https://wa.me/${COMPANY.whatsapp}?text=${encodeURIComponent(`Hi, I need ${svc.name} in ${loc.name}`)}`} target="_blank" rel="noreferrer" className="btn-outline w-full mt-3 border-white/30 text-white hover:bg-white/10"><MessageCircle size={15}/> WhatsApp</a>
            </div>
          </div>
        </aside>
      </section>
    </Layout>
  );
};

export default CityService;
