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
import { trackPhoneClick, trackWhatsAppClick } from "@/lib/analytics";

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
      <PageHeader
        eyebrow="Contact Us"
        title="A care coordinator is one call away."
        subtitle="Call, WhatsApp or send a message — CareNest helps families across Pune."
        crumbs={[{ label: "Contact" }]}
      />

      <section className="container-lux pb-24 grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5 space-y-4">
          <ContactCard
            icon={Phone}
            label="Call"
            value={COMPANY.phone}
            href={`tel:${COMPANY.phone.replace(/\s/g, "")}`}
            testid="contact-phone"
            emphasize
            onClick={() => trackPhoneClick({ location: "contact-card" })}
          />
          <ContactCard
            icon={MessageCircle}
            label="WhatsApp"
            value={COMPANY.phone}
            href={`https://wa.me/${COMPANY.whatsapp}`}
            testid="contact-whatsapp"
            emphasize
            onClick={() => trackWhatsAppClick({ location: "contact-card" })}
          />
          <ContactCard
            icon={Mail}
            label="Email"
            value={COMPANY.email}
            href={`mailto:${COMPANY.email}`}
            testid="contact-email"
          />
          <ContactCard
            icon={Ambulance}
            label="Emergency"
            value="24×7 escalation"
            href={`tel:${COMPANY.phone.replace(/\s/g, "")}`}
            testid="contact-emergency"
            onClick={() => trackPhoneClick({ location: "contact-emergency" })}
          />
          <ContactCard icon={MapPin} label="Head office" value={COMPANY.address} testid="contact-address" />

          <div className="rounded-3xl overflow-hidden border border-border/70 h-[280px]">
            <iframe
              title="CareNest service area map — Pune"
              src="https://www.google.com/maps?q=Pune,India&output=embed"
              className="w-full h-full"
              loading="lazy"
            />
          </div>
        </div>

        <form
          onSubmit={submit}
          className="lg:col-span-7 rounded-3xl border border-border/70 bg-card p-6 md:p-8 shadow-lux space-y-4"
        >
          <div className="overline text-accent">Send us a message</div>
          <h2 className="font-serif text-3xl text-foreground">Tell us how we can help.</h2>
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
            <Input
              data-testid="contact-form-email"
              value={f.email}
              onChange={(v) => set("email", v)}
              placeholder="Email"
              type="email"
            />
            <Input
              data-testid="contact-form-phone"
              value={f.phone}
              onChange={(v) => set("phone", v)}
              placeholder="Phone"
              type="tel"
            />
            <Input
              data-testid="contact-form-subject"
              value={f.subject}
              onChange={(v) => set("subject", v)}
              placeholder="Subject"
            />
          </div>
          <textarea
            data-testid="contact-form-message"
            value={f.message}
            onChange={(e) => set("message", e.target.value)}
            placeholder="Your message"
            rows={5}
            className="w-full rounded-2xl bg-background border border-border px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40"
          />
          <button disabled={loading} type="submit" data-testid="contact-form-submit" className="btn-gold">
            {loading ? "Sending…" : "Send message"}
          </button>
        </form>
      </section>
    </Layout>
  );
};

const ContactCard = ({ icon: Icon, label, value, href, testid, emphasize = false, onClick }) => {
  const className = emphasize
    ? "flex items-center gap-4 rounded-2xl border border-primary/20 bg-white p-5 shadow-sm hover:shadow-lux transition-shadow"
    : "flex items-center gap-4 rounded-2xl border border-border/70 bg-white p-5 hover:shadow-lux transition-shadow";

  const valueClass = emphasize
    ? "mt-1 font-sans text-xl md:text-2xl font-semibold tracking-wide text-primary break-all"
    : "mt-1 font-sans text-base md:text-lg font-medium text-foreground break-words";

  const inner = (
    <>
      <div className="h-12 w-12 shrink-0 rounded-2xl bg-primary text-primary-foreground grid place-items-center">
        <Icon size={20} />
      </div>
      <div className="min-w-0">
        <div className="text-[11px] uppercase tracking-[0.16em] font-semibold text-muted-foreground">{label}</div>
        <div className={valueClass}>{value}</div>
      </div>
    </>
  );

  if (href) {
    return (
      <a href={href} data-testid={testid} onClick={onClick} className={className}>
        {inner}
      </a>
    );
  }

  return (
    <div data-testid={testid} className={className}>
      {inner}
    </div>
  );
};

const Input = ({ value, onChange, ...rest }) => (
  <input
    {...rest}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="w-full rounded-full bg-background border border-border px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40"
  />
);

export default Contact;
