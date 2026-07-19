import React from "react";
import Layout from "@/components/Layout";
import PageHeader from "@/components/PageHeader";

const CONTENT = {
  "privacy-policy": {
    title: "Privacy policy",
    eyebrow: "Legal",
    body: [
      { h: "Overview", p: "CareNest Home Health ('CareNest', 'we', 'us') respects your privacy. This policy explains what we collect, why we collect it and how we protect it." },
      { h: "Information we collect", p: "Contact information you share (name, phone, email, city), care-related information shared voluntarily during booking, and technical information (device, browser, IP) collected automatically." },
      { h: "How we use it", p: "To respond to enquiries, deliver care, coordinate with clinicians and insurers, improve our services, and comply with law." },
      { h: "Sharing", p: "We share your data only with our vetted care team, insurance partners (on your instruction), payment processors and law enforcement when legally required. We never sell your data." },
      { h: "Security", p: "Data is stored on encrypted infrastructure, access is role-limited and audited. Digital case notes are shared only with the family via authenticated links." },
      { h: "Your rights", p: "You may request access, correction, portability or deletion of your data by writing to info@javahomecare.in." },
      { h: "Contact", p: "For any privacy question, email info@javahomecare.in or call +91 9175724546." },
    ],
  },
  "terms": {
    title: "Terms & conditions",
    eyebrow: "Legal",
    body: [
      { h: "Acceptance", p: "By engaging CareNest Home Health, you accept these terms and any care-plan-specific addenda." },
      { h: "Services", p: "We provide non-emergency home healthcare through verified professionals. Clinical decisions remain with treating physicians." },
      { h: "Payments", p: "Invoices are due as per the agreed plan. Delay may result in service suspension after due notice." },
      { h: "Limitations", p: "CareNest is not liable for outcomes outside its reasonable control, including patient non-compliance or third-party equipment malfunction." },
      { h: "Governing law", p: "Disputes are governed by Indian law with jurisdiction in the courts of Pune." },
    ],
  },
  "refund-policy": {
    title: "Refund policy",
    eyebrow: "Legal",
    body: [
      { h: "Advance deposits", p: "Advance amounts are fully refundable if care is cancelled 24 hours before start of shift, minus any deployment/travel already incurred." },
      { h: "After deployment", p: "Refunds after deployment are prorated to hours delivered." },
      { h: "Equipment rental", p: "Refunds on rentals apply for unused whole-day periods, subject to sanitisation and pickup." },
      { h: "How to request", p: "Email info@javahomecare.in with your case ID; refunds are processed within 7 business days to the original payment method." },
    ],
  },
  "cancellation-policy": {
    title: "Cancellation policy",
    eyebrow: "Legal",
    body: [
      { h: "Cancelling a booking", p: "You may cancel any booking by calling or WhatsApping +91 9175724546, or through your care manager." },
      { h: "Timing", p: "Cancellations >24h before shift: full refund. 12–24h: 50% charge. <12h: 100% charge for the first shift." },
      { h: "Long-term plans", p: "For weekly/monthly plans, 48h notice applies for downgrading. Emergency cancellations (patient hospitalised) are handled compassionately." },
    ],
  },
};

const Legal = ({ slug }) => {
  const c = CONTENT[slug];
  if (!c) return null;
  return (
    <Layout>
      <PageHeader eyebrow={c.eyebrow} title={c.title} crumbs={[{ label: c.title }]} />
      <section className="container-lux pb-24 max-w-3xl">
        <div className="rounded-3xl border border-border/70 bg-card/60 p-8 md:p-10 space-y-8">
          {c.body.map((s, i) => (
            <div key={i}>
              <h2 className="font-serif text-xl md:text-2xl">{s.h}</h2>
              <p className="mt-3 text-muted-foreground font-light leading-relaxed">{s.p}</p>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default Legal;
