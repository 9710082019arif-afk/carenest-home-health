import React from "react";
import Layout from "@/components/Layout";
import PageHeader from "@/components/PageHeader";
import { STATS, TEAM, IMAGES, COMPANY, PARTNERS } from "@/data/content";
import { Award, ShieldCheck, HeartHandshake, Clock } from "lucide-react";

const values = [
  { icon: HeartHandshake, t: "Care with dignity", d: "Every patient is treated the way we'd want our own parents treated. Always." },
  { icon: ShieldCheck, t: "Verified excellence", d: "100% background-verified staff, monthly clinical audits, incident-free protocols." },
  { icon: Clock, t: "Always available", d: "24×7 care manager, same-day deployment, transparent digital case notes." },
  { icon: Award, t: "Outcomes we measure", d: "Recovery milestones, family satisfaction and clinical KPIs — reviewed monthly." },
];

const About = () => (
  <Layout>
    <PageHeader eyebrow="About us" title="A promise: to bring the hospital home — humanely." subtitle="CareNest Home Health was founded to make skilled medical care available at home, without the coldness of institutional healthcare." image={IMAGES.doctorHome} crumbs={[{ label: "About" }]} />

    <section className="container-lux pb-16 grid lg:grid-cols-12 gap-10">
      <div className="lg:col-span-7">
        <div className="overline text-accent">Our story</div>
        <h2 className="font-serif text-3xl md:text-4xl mt-3 tracking-tight">Home is where healing begins.</h2>
        <div className="mt-6 space-y-5 text-muted-foreground text-lg font-light leading-relaxed">
          <p>We started with a simple frustration: families discharged from great hospitals often struggled at home. Nurses were hard to find. Physicians did not follow through. Equipment showed up broken.</p>
          <p>CareNest Home Health was built to fix all of that — with a real care manager per family, background-verified professionals, clinical protocols and equipment that just works. We now serve <b>12,400+ families</b> across 11 Indian cities.</p>
          <p>Our promise remains simple: <b className="text-foreground">care with dignity, delivered on time</b>.</p>
        </div>
      </div>
      <div className="lg:col-span-5">
        <div className="rounded-3xl overflow-hidden aspect-square shadow-lux ring-1 ring-black/5">
          <img src={IMAGES.elderCare} alt="Elder care" className="h-full w-full object-cover" />
        </div>
      </div>
    </section>

    <section className="container-lux pb-16">
      <div className="grid md:grid-cols-4 gap-4">
        {STATS.map((s) => (
          <div key={s.label} className="rounded-3xl border border-border/70 bg-card/60 p-6">
            <div className="font-serif text-3xl md:text-4xl text-primary">{s.value}</div>
            <div className="text-sm text-muted-foreground mt-2">{s.label}</div>
          </div>
        ))}
      </div>
    </section>

    <section className="container-lux pb-24">
      <div className="overline text-accent">What we stand for</div>
      <h2 className="font-serif text-3xl md:text-4xl mt-3 tracking-tight">Values that shape every visit.</h2>
      <div className="mt-8 grid md:grid-cols-4 gap-4">
        {values.map(({ icon: Icon, t, d }) => (
          <div key={t} className="rounded-3xl border border-border/70 bg-card/60 p-6">
            <div className="h-11 w-11 rounded-2xl bg-primary/10 text-primary grid place-items-center"><Icon size={18}/></div>
            <div className="font-serif text-xl mt-4">{t}</div>
            <p className="text-sm text-muted-foreground mt-2 font-light">{d}</p>
          </div>
        ))}
      </div>
    </section>

    <section className="container-lux pb-24">
      <div className="overline text-accent">Leadership team</div>
      <h2 className="font-serif text-3xl md:text-4xl mt-3 tracking-tight">Physicians, nurses & operators.</h2>
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        {TEAM.map((t) => (
          <div key={t.name} className="group">
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
              <img src={t.img} alt={t.name} className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/0 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <div className="font-serif text-lg">{t.name}</div>
                <div className="text-[11px] opacity-85">{t.role} · {t.city}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>

    <section className="container-lux pb-24">
      <div className="overline text-accent">How we work</div>
      <h2 className="font-serif text-3xl md:text-4xl mt-3 tracking-tight">We work with <span className="text-gold italic">your</span> hospital, doctor & insurer.</h2>
      <p className="mt-4 max-w-2xl text-muted-foreground font-light text-lg">CareNest Home Health is an independent home-care provider. We coordinate with whichever hospital, treating physician or insurer your family already trusts — carrying over discharge protocols, medication schedules and rehab plans so nothing is lost in the transition home.</p>
      <div className="mt-8 grid md:grid-cols-3 gap-4">
        {[
          { t: "Hospital-agnostic", d: "We collaborate with whichever hospital your family already trusts. No exclusive tie-ups, no bias." },
          { t: "Physician-led continuity", d: "Your treating consultant's plan is followed to the letter. We share daily digital case notes." },
          { t: "Insurance-ready", d: "Detailed itemised invoices, claim-ready documentation and TPA coordination for cashless/reimbursement." },
        ].map((v) => (
          <div key={v.t} className="rounded-3xl border border-border/70 bg-card/60 p-6">
            <div className="font-serif text-xl">{v.t}</div>
            <p className="text-sm text-muted-foreground mt-2 font-light">{v.d}</p>
          </div>
        ))}
      </div>
    </section>
  </Layout>
);

export default About;
