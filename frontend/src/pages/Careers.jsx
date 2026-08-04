import React, { useState } from "react";
import Layout from "@/components/Layout";
import PageHeader from "@/components/PageHeader";
import { applyCareer } from "@/lib/api";
import { toast } from "sonner";
import { LOCATIONS } from "@/data/content";
import { CheckCircle2, HeartHandshake, Stethoscope, Users } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import { PAGE_SEO } from "@/lib/seo";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";

const roles = ["Registered Nurse (GNM/B.Sc)", "ICU Nurse", "Caregiver / Attendant", "Physiotherapist", "Doctor (MBBS/MD)", "Care Manager"];
const perks = [
  { icon: HeartHandshake, t: "Family-first culture", d: "Structured shifts, no unpaid overtime, mental-health leaves." },
  { icon: Stethoscope, t: "Continuous learning", d: "Monthly clinical training, upskilling and career pathways." },
  { icon: Users, t: "Great teams", d: "Work alongside senior physicians and thoughtful care managers." },
];

const Careers = () => {
  const [f, setF] = useState({ name: "", phone: "", email: "", role: "", experience_years: "", city: "", cover_letter: "" });
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    if (!f.name || !f.phone || !f.role) return toast.error("Name, phone and role are required.");
    setLoading(true);
    try { await applyCareer({ ...f, experience_years: f.experience_years ? Number(f.experience_years) : undefined }); toast.success("Application received. We'll reach out shortly."); setF({ name: "", phone: "", email: "", role: "", experience_years: "", city: "", cover_letter: "" }); }
    catch { toast.error("Could not submit — please email info@carenesthomehealth.in"); }
    finally { setLoading(false); }
  };

  return (
    <Layout>
      <SEOHead seo={PAGE_SEO.careers} />
      <JsonLd data={breadcrumbSchema([{ label: "Home", to: "/" }, { label: "Careers", to: "/careers" }])} />
      <PageHeader eyebrow="Careers" title="Do meaningful work, with a great team." subtitle="We're hiring across nursing, physiotherapy, medicine and operations. If you care deeply and work rigorously, we'd love to hear from you." crumbs={[{ label: "Careers" }]} />

      <section className="container-lux pb-16">
        <div className="grid md:grid-cols-3 gap-4">
          {perks.map(({ icon: Icon, t, d }) => (
            <div key={t} className="rounded-3xl border border-border/70 bg-card/60 p-6">
              <div className="h-11 w-11 rounded-2xl bg-primary/10 text-primary grid place-items-center"><Icon size={18}/></div>
              <div className="font-serif text-xl mt-4">{t}</div>
              <p className="text-sm text-muted-foreground mt-2 font-light">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-lux pb-24 grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-6 space-y-4">
          <div className="overline text-accent">Open positions</div>
          <h2 className="font-serif text-3xl md:text-4xl">Where should we begin?</h2>
          <div className="grid gap-3">
            {roles.map((r) => (
              <div key={r} className="flex items-center justify-between rounded-2xl border border-border/70 bg-card/50 p-5">
                <div>
                  <div className="font-serif text-lg">{r}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">Pune · Mumbai · Bengaluru · Hyderabad · Kolkata · Remote-first Ops</div>
                </div>
                <span className="text-xs font-semibold text-secondary">Hiring</span>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={submit} className="lg:col-span-6 rounded-3xl border border-border/70 bg-card/70 p-8 shadow-lux space-y-4">
          <div className="overline text-accent">Apply now</div>
          <h3 className="font-serif text-2xl">One short form.</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <Input data-testid="career-name" value={f.name} onChange={(v) => set("name", v)} placeholder="Full name" />
            <Input data-testid="career-phone" value={f.phone} onChange={(v) => set("phone", v)} placeholder="Phone" type="tel" />
            <Input data-testid="career-email" value={f.email} onChange={(v) => set("email", v)} placeholder="Email (optional)" type="email" />
            <Input data-testid="career-exp" value={f.experience_years} onChange={(v) => set("experience_years", v)} placeholder="Years of experience" type="number" />
            <Select data-testid="career-role" value={f.role} onChange={(v) => set("role", v)}>
              <option value="">Preferred role</option>
              {roles.map((r) => <option key={r} value={r}>{r}</option>)}
            </Select>
            <Select data-testid="career-city" value={f.city} onChange={(v) => set("city", v)}>
              <option value="">Preferred city</option>
              {LOCATIONS.map((l) => <option key={l.slug} value={l.name}>{l.name}</option>)}
            </Select>
          </div>
          <textarea data-testid="career-cover" value={f.cover_letter} onChange={(e) => set("cover_letter", e.target.value)} placeholder="A short note about you (optional)" rows={4}
            className="w-full rounded-2xl bg-muted/40 border border-border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40" />
          <button data-testid="career-submit" disabled={loading} type="submit" className="btn-gold w-full">{loading ? "Sending…" : (<><CheckCircle2 size={16}/> Submit application</>)}</button>
        </form>
      </section>
    </Layout>
  );
};

const Input = ({ value, onChange, ...rest }) => (
  <input {...rest} value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-full bg-muted/40 border border-border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40" />
);
const Select = ({ value, onChange, children, ...rest }) => (
  <select {...rest} value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-full bg-muted/40 border border-border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40">{children}</select>
);

export default Careers;
