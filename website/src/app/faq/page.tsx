import type { Metadata } from "next";
import { Breadcrumbs, JsonLd } from "@/components/JsonLd";
import { FAQAccordion } from "@/components/FAQAccordion";
import { CTAButtons } from "@/components/CTAButtons";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

const FAQS = [
  {
    q: "Which services does CareNest offer?",
    a: "CareNest currently offers eleven services: Elder Care, Caregiver Services, Attendant Services, Home Nursing, 24×7 Nursing Care, Post-Operative Care, Bedridden Patient Care, Dementia Care, Alzheimer’s Care, Paralysis Care, and Mother & Baby Care.",
  },
  {
    q: "Where do you provide care?",
    a: "Pune is our primary service focus. Share your locality when you enquire and we will confirm whether we can help.",
  },
  {
    q: "How do I start an enquiry?",
    a: "Call, WhatsApp or submit the enquiry form. A coordinator will discuss requirements and next steps.",
  },
  {
    q: "Do you guarantee medical outcomes?",
    a: "No. CareNest arranges home care support and coordination. Medical advice and outcomes remain with your treating clinicians.",
  },
  {
    q: "Is ICU at home still offered?",
    a: "ICU at home and several other specialised programmes are not advertised as current CareNest services. If you need nursing support, see Home Nursing or 24×7 Nursing Care.",
  },
  {
    q: "Will you ask for medical records on the website form?",
    a: "Please avoid sending sensitive medical details through the website form. Share only what is needed to start a conversation; a coordinator will guide you.",
  },
];

export const metadata: Metadata = buildMetadata({
  title: "FAQ | CareNest Home Health Pune",
  description:
    "Frequently asked questions about CareNest home care services, enquiries and Pune service focus.",
  path: "/faq",
});

export default function FAQPage() {
  return (
    <div className="section">
      <JsonLd data={faqSchema(FAQS)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "FAQ", path: "/faq" },
        ])}
      />
      <div className="container-cn max-w-3xl">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "FAQ" }]} />
        <p className="eyebrow">FAQ</p>
        <h1 className="text-4xl md:text-5xl mt-2">Common questions</h1>
        <p className="prose-cn mt-4">Quick answers before you call or WhatsApp CareNest.</p>
        <div className="mt-8">
          <FAQAccordion faqs={FAQS} />
        </div>
        <div className="mt-10">
          <CTAButtons location="faq" />
        </div>
      </div>
    </div>
  );
}
