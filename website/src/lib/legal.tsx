import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, JsonLd } from "@/components/JsonLd";
import { COMPANY } from "@/data/company";
import { breadcrumbSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

type LegalSlug = "privacy-policy" | "terms" | "refund-policy" | "cancellation-policy";

const LEGAL: Record<
  LegalSlug,
  { title: string; description: string; path: string; h1: string; sections: { h: string; p: string }[] }
> = {
  "privacy-policy": {
    title: "Privacy Policy | CareNest Home Health",
    description: "How CareNest Home Health collects and uses enquiry information on this website.",
    path: "/privacy-policy",
    h1: "Privacy Policy",
    sections: [
      {
        h: "Information we collect",
        p: "When you submit an enquiry or contact form, we collect the details you provide such as name, phone, email, city, selected service and message content. Technical logs may include IP address and browser information.",
      },
      {
        h: "How we use information",
        p: "We use enquiry details to respond to your request, coordinate care discussions and improve website reliability. We do not sell personal information.",
      },
      {
        h: "Analytics",
        p: "We may use Google Analytics 4 with anonymised IP configuration. Analytics events from this website are designed to avoid sending names, phone numbers, emails, message contents or health details.",
      },
      {
        h: "Contact",
        p: `For privacy questions, email ${COMPANY.email} or call ${COMPANY.phoneDisplay}.`,
      },
    ],
  },
  terms: {
    title: "Terms of Use | CareNest Home Health",
    description: "Terms governing use of the CareNest Home Health website and enquiries.",
    path: "/terms",
    h1: "Terms of Use",
    sections: [
      {
        h: "Website purpose",
        p: "This website provides information about CareNest home care services and a way to enquire. Website content is not medical advice.",
      },
      {
        h: "Service arrangements",
        p: "Any care support is arranged after discussion of requirements, suitability and availability. Publishing a service page does not guarantee immediate deployment.",
      },
      {
        h: "Acceptable use",
        p: "Do not misuse forms for spam or unlawful content. We may refuse or limit abusive requests.",
      },
      {
        h: "Governing law",
        p: "These terms are governed by the laws of India. Courts in Pune, Maharashtra may have jurisdiction for disputes arising from website use.",
      },
    ],
  },
  "refund-policy": {
    title: "Refund Policy | CareNest Home Health",
    description: "CareNest Home Health refund policy for arranged home care services.",
    path: "/refund-policy",
    h1: "Refund Policy",
    sections: [
      {
        h: "Overview",
        p: "Fees and refunds depend on the specific care arrangement discussed with your coordinator. Website enquiries themselves do not create a charge.",
      },
      {
        h: "How to request a review",
        p: `Contact ${COMPANY.email} or ${COMPANY.phoneDisplay} with your arrangement details. We review refund requests case by case based on the agreed terms of service.`,
      },
    ],
  },
  "cancellation-policy": {
    title: "Cancellation Policy | CareNest Home Health",
    description: "CareNest Home Health cancellation policy for scheduled home care support.",
    path: "/cancellation-policy",
    h1: "Cancellation Policy",
    sections: [
      {
        h: "Overview",
        p: "If you need to cancel or reschedule arranged care support, contact CareNest as early as possible so coordinators can adjust staffing.",
      },
      {
        h: "How to cancel",
        p: `Call ${COMPANY.phoneDisplay}, WhatsApp, or email ${COMPANY.email}. Cancellation terms for paid arrangements are confirmed when service is booked.`,
      },
    ],
  },
};

export function makeLegalPage(slug: LegalSlug) {
  const doc = LEGAL[slug];

  const metadata: Metadata = buildMetadata({
    title: doc.title,
    description: doc.description,
    path: doc.path,
  });

  function Page() {
    return (
      <div className="section">
        <JsonLd
          data={breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: doc.h1, path: doc.path },
          ])}
        />
        <div className="container-cn max-w-3xl">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: doc.h1 }]} />
          <h1 className="text-4xl md:text-5xl">{doc.h1}</h1>
          <div className="divider-gold" />
          {doc.sections.map((s) => (
            <section key={s.h} className="mt-8">
              <h2 className="text-2xl">{s.h}</h2>
              <p className="prose-cn mt-3">{s.p}</p>
            </section>
          ))}
          <p className="mt-10 text-sm">
            <Link href="/contact" className="text-[var(--royal)] font-semibold underline">
              Contact CareNest
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return { metadata, Page };
}
