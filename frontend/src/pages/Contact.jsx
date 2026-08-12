import React from "react";
import Layout from "@/components/Layout";
import PageHeader from "@/components/PageHeader";
import { COMPANY } from "@/data/content";
import { PHONE_HREF, PHONE_DISPLAY, WHATSAPP_HREF } from "@/lib/cta";
import { createContact } from "@/lib/api";
import { toast } from "sonner";
import { Phone, Mail, MapPin, Ambulance } from "lucide-react";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import SEOHead from "@/components/SEOHead";
import { PAGE_SEO } from "@/lib/seo";
import { JsonLd, contactPageSchema, breadcrumbSchema, organizationSchema } from "@/lib/schema";
import { trackPhoneClick, trackWhatsAppClick } from "@/lib/analytics";

const Contact = () => {
  const [f, setF] = React.useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [loading, setLoading] = React.useState(false);
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try { await createContact(f); toast.success("Message sent. We'll reply shortly."); setF({ name: "", email: "", phone: "", subject: "", message: "" }); }
    catch { toast.error("Could not send. Try WhatsApp or call."); }
    finally { setLoading(false); }
  };

  return (
    <Layout>
      <SEOHead seo={PAGE_SEO.contact} />
      <JsonLd data={organizationSchema()} />
      <JsonLd data={contactPageSchema()} />
      <JsonLd data={breadcrumbSchema([{ label: "Home", to: "/" }, { label: "Contact", to: "/contact" }])} />
      <PageHeader eyebrow="Contact Us" title="A care coordinator is one call away." subtitle="Call, WhatsApp or send a message — CareNest helps families across Pune." crumbs={[{ label: "Contact" }]} />

      <section className="container-lux pb-24 grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5 space-y-5">
          <Card icon={Phone} label="Call" value={PHONE_DISPLAY} href={PHONE_HREF} testid="contact-phone" onClick={() => trackPhoneClick({ location: "contact-page" })} />
          <Card icon={WhatsAppIcon} label="WhatsApp" value={PHONE_DISPLAY} href={WHATSAPP_HREF} testid="contact-whatsapp" external onClick={() => trackWhatsAppClick({ location: "contact-page" })} />
          <Card icon={Mail} label="Email" value={COMPANY.email} href={`mailto:${COMPANY.email}`} testid="contact-email" />
          <Card icon={Ambulance} label="Emergency" value="24×7 escalation" href={PHONE_HREF} testid="contact-emergency" onClick={() => trackPhoneClick({ location: "contact-emergency" })} />
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

const Card = ({ icon: Icon, label, value, href, testid, external, onClick }) => {
  const Comp = href ? "a" : "div";
  return (
    <Comp
      href={href}
      data-testid={testid}
      onClick={onClick}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      className="flex items-center gap-4 rounded-2xl border border-border/70 bg-card/60 p-5 hover:shadow-lux transition-shadow"
    >
      <div className="h-11 w-11 rounded-2xl bg-primary/10 text-primary grid place-items-center">
        <Icon size={18} />
      </div>
      <div>
        <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
        <div className="font-serif text-lg mt-0.5">{value}</div>
      </div>
    </Comp>
  );
};

const Input = ({ value, onChange, ...rest }) => (
  <input {...rest} value={value} onChange={(e) => onChange(e.target.value)}
    className="w-full rounded-full bg-muted/40 border border-border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40" />
);

export default Contact;
