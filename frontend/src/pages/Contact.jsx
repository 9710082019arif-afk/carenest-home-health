import React from "react";
import Layout from "@/components/Layout";
import PageHeader from "@/components/PageHeader";
import { COMPANY } from "@/data/content";
import { createContact } from "@/lib/api";
import { toast } from "sonner";
import { Phone, Mail, MapPin, MessageCircle, Ambulance } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import { PAGE_SEO } from "@/lib/seo";
import { JsonLd, contactPageSchema, breadcrumbSchema, organizationSchema } from "@/lib/schema";

const Contact = () => {
  const [f, setF] = React.useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    company_website: "",
  });
  const [loading, setLoading] = React.useState(false);
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createContact(f);
      toast.success("Message sent. We'll reply shortly.");
      setF({ name: "", email: "", phone: "", subject: "", message: "", company_website: "" });
    } catch {
      toast.error("Could not send. Try WhatsApp or call.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <SEOHead seo={PAGE_SEO.contact} />
      <JsonLd data={organizationSchema()} />
      <JsonLd data={contactPageSchema()} />
      <JsonLd data={breadcrumbSchema([{ label: "Home", to: "/" }, { label: "Contact", to: "/contact" }])} />
      <PageHeader eyebrow="Contact Us" title="A care coordinator is one call away." subtitle="Call, WhatsApp or send a message — CareNest helps families across Pune and Pimpri-Chinchwad (PCMC)." crumbs={[{ label: "Contact" }]} />

      <section className="container-lux pb-24 grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5 space-y-5">
          <Card icon={Phone} label="Call" value={COMPANY.phone} href={`tel:${COMPANY.phone.replace(/\s/g,'')}`} testid="contact-phone" />
          <Card icon={MessageCircle} label="WhatsApp" value={COMPANY.phone} href={`https://wa.me/${COMPANY.whatsapp}`} testid="contact-whatsapp" />
          <Card icon={Mail} label="Email" value={COMPANY.email} href={`mailto:${COMPANY.email}`} testid="contact-email" />
          <Card icon={Ambulance} label="Emergency" value="24×7 escalation" href={`tel:${COMPANY.phone.replace(/\s/g,'')}`} testid="contact-emergency" />
          <Card icon={MapPin} label="Head office" value={COMPANY.address} testid="contact-address" />

          <div className="rounded-3xl overflow-hidden border border-border/70 h-[280px]">
            <iframe title="map"
              src="https://www.google.com/maps?q=Pune,India&output=embed"
              className="w-full h-full" loading="lazy" />
          </div>
        </div>

        <form onSubmit={submit} className="lg:col-span-7 rounded-3xl border border-border/70 bg-card/70 backdrop-blur-sm p-8 shadow-lux space-y-4">
          <div className="overline text-accent">Send us a message</div>
          <h2 className="font-serif text-3xl">Tell us how we can help.</h2>
          {/* Honeypot — leave empty; bots that fill it are ignored server-side */}
          <input
            type="text"
            name="company_website"
            value={f.company_website}
            onChange={(e) => set("company_website", e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            style={{ position: "absolute", left: "-9999px", height: 0, width: 0, opacity: 0 }}
          />
          <div className="grid sm:grid-cols-2 gap-4">
            <Input data-testid="contact-form-name" value={f.name} onChange={(v) => set("name", v)} placeholder="Full name" />
            <Input data-testid="contact-form-email" value={f.email} onChange={(v) => set("email", v)} placeholder="Email" type="email" />
            <Input data-testid="contact-form-phone" value={f.phone} onChange={(v) => set("phone", v)} placeholder="Phone" type="tel" />
            <Input data-testid="contact-form-subject" value={f.subject} onChange={(v) => set("subject", v)} placeholder="Subject" />
          </div>
          <textarea data-testid="contact-form-message" value={f.message} onChange={(e) => set("message", e.target.value)} placeholder="Your message" rows={5}
            className="w-full rounded-2xl bg-muted/40 border border-border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40" />
          <button disabled={loading} type="submit" data-testid="contact-form-submit" className="btn-gold">{loading ? "Sending…" : "Send message"}</button>
        </form>
      </section>
    </Layout>
  );
};

const Card = ({ icon: Icon, label, value, href, testid }) => (
  <a href={href} data-testid={testid} className="flex items-center gap-4 rounded-2xl border border-border/70 bg-card/60 p-5 hover:shadow-lux transition-shadow">
    <div className="h-11 w-11 rounded-2xl bg-primary/10 text-primary grid place-items-center"><Icon size={18}/></div>
    <div>
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="font-serif text-lg mt-0.5">{value}</div>
    </div>
  </a>
);

const Input = ({ value, onChange, ...rest }) => (
  <input {...rest} value={value} onChange={(e) => onChange(e.target.value)}
    className="w-full rounded-full bg-muted/40 border border-border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40" />
);

export default Contact;
