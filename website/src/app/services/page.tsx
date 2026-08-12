import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, JsonLd } from "@/components/JsonLd";
import { SERVICES } from "@/data/services";
import { breadcrumbSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Home Care Services in Pune | CareNest Home Health",
  description:
    "Explore CareNest’s 11 home care services in Pune — elder care, nursing, caregiver support, dementia care, mother & baby care and more.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <div className="section">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
        ])}
      />
      <div className="container-cn">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Services" }]} />
        <p className="eyebrow">Services</p>
        <h1 className="text-4xl md:text-5xl mt-2 max-w-3xl">Home care services for families in Pune</h1>
        <p className="prose-cn mt-4 max-w-2xl">
          These are the approved CareNest services. Open a page to read who it helps, what support includes,
          and how to enquire.
        </p>
        <ul className="mt-10 grid md:grid-cols-2 gap-4">
          {SERVICES.map((s) => (
            <li key={s.slug}>
              <Link
                href={`/services/${s.slug}`}
                className="block card-soft h-full hover:border-[var(--teal)] border border-transparent"
              >
                <h2 className="text-2xl">{s.name}</h2>
                <p className="prose-cn mt-2">{s.summary}</p>
                <span className="inline-block mt-4 text-sm font-bold text-[var(--teal-deep)]">
                  View service →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
