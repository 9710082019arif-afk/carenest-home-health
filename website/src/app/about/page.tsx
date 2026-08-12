import type { Metadata } from "next";
import { Breadcrumbs, JsonLd } from "@/components/JsonLd";
import { CTAButtons, PhoneDisplay } from "@/components/CTAButtons";
import { COMPANY } from "@/data/company";
import { breadcrumbSchema, organizationSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "About CareNest Home Health | Home Care in Pune",
  description:
    "Learn about CareNest Home Health — professional home care support for families in Pune, centred on dignity, coordination and clear communication.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="section">
      <JsonLd data={organizationSchema()} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ])}
      />
      <div className="container-cn max-w-3xl">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About Us" }]} />
        <p className="eyebrow">About Us</p>
        <h1 className="text-4xl md:text-5xl mt-2">CareNest Home Health</h1>
        <div className="divider-gold" />

        <div className="prose-cn space-y-4 mt-6">
          <p>
            CareNest Home Health helps families arrange professional care support at home in Pune. We focus
            on practical assistance — nursing, caregiving, attendant support and specialised care
            coordination — so loved ones can remain in a familiar environment whenever that is appropriate.
          </p>
          <p>
            Home care is personal. Every household has different routines, clinical instructions and
            comfort preferences. CareNest begins with a conversation: what help is needed, which hours
            matter, and how the family wants to stay informed.
          </p>
        </div>

        <h2 className="text-3xl mt-12">Our approach</h2>
        <ul className="mt-4 space-y-3 prose-cn">
          <li>
            <strong className="text-[var(--royal)]">Dignity first.</strong> Personal care is delivered with
            privacy, patience and respect.
          </li>
          <li>
            <strong className="text-[var(--royal)]">Family partnership.</strong> Relatives remain central to
            decisions. We coordinate; we do not replace your clinicians.
          </li>
          <li>
            <strong className="text-[var(--royal)]">Honest scoping.</strong> We match caregiver, attendant or
            nursing support to the tasks involved — without advertising services we do not provide.
          </li>
          <li>
            <strong className="text-[var(--royal)]">Pune focus.</strong> Our primary geographic focus is Pune
            and nearby localities, so coordination stays grounded in local practicality.
          </li>
        </ul>

        <h2 className="text-3xl mt-12">Leadership</h2>
        <p className="prose-cn mt-4">
          CareNest Home Health is led by {COMPANY.founder.name}, {COMPANY.founder.role}. The organisation
          exists to make home-based care support clearer and more approachable for families who need
          dependable help.
        </p>

        <h2 className="text-3xl mt-12">How to contact CareNest</h2>
        <PhoneDisplay className="mt-4" />
        <p className="prose-cn mt-2">
          Email{" "}
          <a className="text-[var(--royal)] font-semibold underline" href={`mailto:${COMPANY.email}`}>
            {COMPANY.email}
          </a>{" "}
          or use WhatsApp for a quick enquiry.
        </p>
        <div className="mt-6">
          <CTAButtons location="about" />
        </div>
      </div>
    </div>
  );
}
