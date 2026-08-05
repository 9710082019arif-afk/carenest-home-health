import React, { useState } from "react";
import Layout from "@/components/Layout";
import PageHeader from "@/components/PageHeader";
import { createAppointment } from "@/lib/api";
import { trackAppointmentBooked, trackPhoneClick, trackWhatsAppClick } from "@/lib/analytics";
import { toast } from "sonner";
import { SERVICES, LOCATIONS, COMPANY } from "@/data/content";
import { ArrowRight, ArrowLeft, CheckCircle2, Phone, MessageCircle } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import { PAGE_SEO } from "@/lib/seo";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";

const steps = ["Service", "Patient", "Schedule", "Confirm"];

const BookAppointment = () => {
  const [step, setStep] = useState(0);
  const [f, setF] = useState({
    service: "", city: "",
    patient_name: "", phone: "", email: "", patient_age: "", patient_condition: "", address: "",
    preferred_date: "", preferred_time: "", notes: "",
  });
  const [done, setDone] = useState(false);
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));

  const canNext = () => {
    if (step === 0) return f.service && f.city;
    if (step === 1) return f.patient_name && f.phone;
    if (step === 2) return f.preferred_date;
    return true;
  };

  const submit = async () => {
    try {
      await createAppointment({ ...f, patient_age: f.patient_age ? Number(f.patient_age) : undefined });
      trackAppointmentBooked({ city: f.city, service: f.service });
      setDone(true);
      toast.success("Appointment received. We'll confirm within 15 minutes.");
    } catch { toast.error("Could not book — please call us at " + COMPANY.phone); }
  };

  return (
    <Layout>
      <SEOHead seo={PAGE_SEO.book} />
      <JsonLd data={breadcrumbSchema([{ label: "Home", to: "/" }, { label: "Book appointment", to: "/book-appointment" }])} />
      <PageHeader eyebrow="Book appointment" title="A care coordinator will confirm within 15 minutes." subtitle="Tell us about the patient and preferred timing. We'll design a plan and confirm your care team." crumbs={[{ label: "Book appointment" }]} />

      <section className="container-lux pb-24 grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          {done ? (
            <div className="rounded-3xl border border-border/70 bg-card/70 p-10 text-center shadow-lux">
              <div className="mx-auto h-14 w-14 rounded-full bg-secondary/15 text-secondary grid place-items-center"><CheckCircle2 size={26}/></div>
              <h2 className="font-serif text-3xl mt-6">Thank you, {f.patient_name.split(" ")[0]}.</h2>
              <p className="text-muted-foreground mt-3 max-w-lg mx-auto font-light">A care coordinator has been notified and will call you at <b>{f.phone}</b> within 15 minutes. If it's urgent, please call us directly.</p>
              <div className="mt-6 flex justify-center gap-3">
                <a href={`tel:${COMPANY.phone.replace(/\s/g,'')}`} className="btn-primary" onClick={() => trackPhoneClick({ location: "book-thankyou" })}><Phone size={15}/> Call {COMPANY.phone}</a>
                <a href={`https://wa.me/${COMPANY.whatsapp}`} target="_blank" rel="noreferrer" className="btn-outline" onClick={() => trackWhatsAppClick({ location: "book-thankyou" })}><MessageCircle size={15}/> WhatsApp</a>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-border/70 bg-card/70 p-6 md:p-10 shadow-lux">
              {/* stepper */}
              <div className="flex items-center gap-3 mb-8">
                {steps.map((s, i) => (
                  <div key={s} className="flex-1 flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-full grid place-items-center text-xs font-semibold ${i < step ? "bg-secondary text-secondary-foreground" : i === step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{i+1}</div>
                    <div className={`text-xs md:text-sm ${i === step ? "text-foreground font-medium" : "text-muted-foreground"} hidden sm:block`}>{s}</div>
                    {i < steps.length - 1 && <div className={`flex-1 h-px ${i < step ? "bg-secondary" : "bg-border"}`} />}
                  </div>
                ))}
              </div>

              {step === 0 && (
                <div className="space-y-5">
                  <StepTitle title="Which service do you need?" />
                  <div className="grid sm:grid-cols-2 gap-3 max-h-[360px] overflow-y-auto pr-1">
                    {SERVICES.map((s) => (
                      <button key={s.slug} type="button" onClick={() => set("service", s.name)}
                        className={`text-left rounded-2xl border p-4 transition-colors ${f.service === s.name ? "border-primary bg-primary/5" : "border-border hover:bg-muted"}`}
                        data-testid={`book-service-${s.slug}`}>
                        <div className="font-medium">{s.name}</div>
                        <div className="text-xs text-muted-foreground mt-1">{s.tagline}</div>
                      </button>
                    ))}
                  </div>
                  <Select label="City" value={f.city} onChange={(v) => set("city", v)} data-testid="book-city">
                    {LOCATIONS.map((l) => <option key={l.slug} value={l.name}>{l.name}</option>)}
                  </Select>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-4">
                  <StepTitle title="Tell us about the patient" />
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Patient full name" value={f.patient_name} onChange={(v) => set("patient_name", v)} data-testid="book-name" />
                    <Field label="Phone (family contact)" type="tel" value={f.phone} onChange={(v) => set("phone", v)} data-testid="book-phone" />
                    <Field label="Email (optional)" type="email" value={f.email} onChange={(v) => set("email", v)} data-testid="book-email" />
                    <Field label="Patient age" type="number" value={f.patient_age} onChange={(v) => set("patient_age", v)} data-testid="book-age" />
                  </div>
                  <TextArea label="Patient's condition (brief)" value={f.patient_condition} onChange={(v) => set("patient_condition", v)} data-testid="book-condition" />
                  <TextArea label="Care address" value={f.address} onChange={(v) => set("address", v)} data-testid="book-address" />
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <StepTitle title="When would you like care to begin?" />
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Preferred start date" type="date" value={f.preferred_date} onChange={(v) => set("preferred_date", v)} data-testid="book-date" />
                    <Field label="Preferred time" type="time" value={f.preferred_time} onChange={(v) => set("preferred_time", v)} data-testid="book-time" />
                  </div>
                  <TextArea label="Anything else we should know?" value={f.notes} onChange={(v) => set("notes", v)} data-testid="book-notes" />
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <StepTitle title="Please confirm" />
                  <div className="rounded-2xl border border-border p-5 grid sm:grid-cols-2 gap-4 text-sm">
                    <Info label="Service" value={f.service} />
                    <Info label="City" value={f.city} />
                    <Info label="Patient" value={f.patient_name} />
                    <Info label="Phone" value={f.phone} />
                    <Info label="Email" value={f.email} />
                    <Info label="Age" value={f.patient_age} />
                    <Info label="Preferred date" value={f.preferred_date} />
                    <Info label="Preferred time" value={f.preferred_time} />
                    <Info label="Condition" value={f.patient_condition} full />
                    <Info label="Address" value={f.address} full />
                  </div>
                </div>
              )}

              <div className="mt-8 flex items-center justify-between">
                <button
                  type="button"
                  disabled={step === 0}
                  onClick={() => setStep((s) => s - 1)}
                  data-testid="book-back"
                  className="btn-ghost disabled:opacity-40"
                ><ArrowLeft size={15}/> Back</button>

                {step < steps.length - 1 ? (
                  <button disabled={!canNext()} type="button" onClick={() => setStep((s) => s + 1)} className="btn-primary disabled:opacity-40" data-testid="book-next">Continue <ArrowRight size={15}/></button>
                ) : (
                  <button type="button" onClick={submit} className="btn-gold" data-testid="book-confirm">Confirm appointment <CheckCircle2 size={15}/></button>
                )}
              </div>
            </div>
          )}
        </div>

        <aside className="lg:col-span-4 space-y-4">
          <div className="rounded-3xl bg-primary text-primary-foreground p-6">
            <div className="overline text-gold-light">Prefer to call?</div>
            <div className="mt-3 font-serif text-2xl">A human, always.</div>
            <a href={`tel:${COMPANY.phone.replace(/\s/g,'')}`} className="btn-gold w-full mt-5"><Phone size={15}/> {COMPANY.phone}</a>
            <a href={`https://wa.me/${COMPANY.whatsapp}`} target="_blank" rel="noreferrer" className="btn-outline w-full mt-3 border-white/30 text-white hover:bg-white/10"><MessageCircle size={15}/> WhatsApp us</a>
          </div>
          <div className="rounded-3xl border border-border/70 bg-card/60 p-6">
            <div className="overline text-accent">Response promise</div>
            <p className="mt-3 text-muted-foreground font-light text-sm">A care coordinator confirms every booking within <b>15 minutes</b>. Emergency requests are prioritised.</p>
          </div>
        </aside>
      </section>
    </Layout>
  );
};

const StepTitle = ({ title }) => <h2 className="font-serif text-2xl md:text-3xl tracking-tight">{title}</h2>;

const Field = ({ label, value, onChange, type = "text", ...rest }) => (
  <label className="block">
    <span className="text-xs font-semibold text-muted-foreground tracking-wide uppercase">{label}</span>
    <input {...rest} type={type} value={value} onChange={(e) => onChange(e.target.value)} className="mt-1.5 w-full rounded-full bg-muted/40 border border-border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40" />
  </label>
);
const TextArea = ({ label, value, onChange, ...rest }) => (
  <label className="block">
    <span className="text-xs font-semibold text-muted-foreground tracking-wide uppercase">{label}</span>
    <textarea {...rest} value={value} onChange={(e) => onChange(e.target.value)} rows={3} className="mt-1.5 w-full rounded-2xl bg-muted/40 border border-border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40" />
  </label>
);
const Select = ({ label, value, onChange, children, ...rest }) => (
  <label className="block">
    <span className="text-xs font-semibold text-muted-foreground tracking-wide uppercase">{label}</span>
    <select {...rest} value={value} onChange={(e) => onChange(e.target.value)} className="mt-1.5 w-full rounded-full bg-muted/40 border border-border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40">
      <option value="">Select…</option>
      {children}
    </select>
  </label>
);
const Info = ({ label, value, full }) => (
  <div className={full ? "sm:col-span-2" : ""}>
    <div className="text-[11px] text-muted-foreground uppercase tracking-wide">{label}</div>
    <div className="mt-1 font-medium">{value || "—"}</div>
  </div>
);

export default BookAppointment;
