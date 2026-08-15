import type { Metadata } from "next";
import { Breadcrumbs, JsonLd } from "@/components/JsonLd";
import { CTAButtons, PhoneDisplay } from "@/components/CTAButtons";
import { LeadForm } from "@/components/LeadForm";
import { COMPANY, telHref, whatsappHref } from "@/data/company";
import { breadcrumbSchema, localBusinessSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Contact CareNest Home Health | Call, WhatsApp, Enquire",
  description:
    "Contact CareNest Home Health in Pune. Call, WhatsApp or send an enquiry for home care support. Phone number is clearly displayed and clickable.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="section">
      <JsonLd data={localBusinessSchema()} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
      />
      <div className="container-cn">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact Us" }]} />
        <p className="eyebrow">Contact Us</p>
        <h1 className="text-4xl md:text-5xl mt-2 max-w-3xl">Talk to a CareNest coordinator</h1>
        <p className="prose-cn mt-4 max-w-2xl">
          Reach us by phone, WhatsApp or the form below. Service area focus: {COMPANY.serviceArea}.
        </p>

        <div className="mt-10 grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5 space-y-4">
            {/* High-contrast phone block — addresses prior visibility complaint */}
            <div className="rounded-3xl bg-white border-2 border-[var(--royal)] p-6 shadow-[0_16px_40px_-24px_rgba(13,59,102,0.5)]">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--royal)]">Phone</p>
              <PhoneDisplay className="mt-2" />
              <a
                href={telHref}
                className="btn btn-gold mt-4 w-full"
              >
                Call {COMPANY.phoneDisplay}
              </a>
              <p className="mt-3 text-sm text-[var(--ink)] font-medium">
                Number is shown in royal blue on white for strong contrast on desktop and mobile.
              </p>
            </div>

            <div className="card-soft bg-white">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--teal-deep)]">WhatsApp</p>
              <a
                href={whatsappHref()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp mt-3 w-full"
              >
                Message on WhatsApp
              </a>
            </div>

            <div className="card-soft bg-white">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--royal)]">Email</p>
              <a
                href={`mailto:${COMPANY.email}`}
                className="mt-2 inline-block text-lg font-bold text-[var(--royal)] underline underline-offset-4"
              >
                {COMPANY.email}
              </a>
            </div>

            <div className="card-soft bg-white">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--royal)]">Service area</p>
              <p className="mt-2 text-[var(--ink)] font-semibold text-lg">{COMPANY.serviceArea}</p>
              <p className="prose-cn mt-2 text-sm">
                Primary geographic focus is Pune. Contact us with your locality to confirm availability.
              </p>
            </div>

            <CTAButtons location="contact-page" showEnquire={false} />
          </div>

          <div className="lg:col-span-7 space-y-8" id="enquiry">
            <LeadForm mode="enquiry" />
            <LeadForm mode="contact" />
          </div>
        </div>
      </div>
    </div>
  );
}
