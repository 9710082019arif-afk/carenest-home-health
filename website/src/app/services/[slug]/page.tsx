import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CTAButtons } from "@/components/CTAButtons";
import { FAQAccordion } from "@/components/FAQAccordion";
import { Breadcrumbs, JsonLd } from "@/components/JsonLd";
import { LeadForm } from "@/components/LeadForm";
import { COMPANY } from "@/data/company";
import {
  SERVICE_SLUGS,
  getRelatedServices,
  getServiceBySlug,
  type ServiceSlug,
} from "@/data/services";
import { breadcrumbSchema, faqSchema, serviceSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return SERVICE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};
  return buildMetadata({
    title: service.title,
    description: service.description,
    path: `/services/${service.slug}`,
    ogImage: service.image,
  });
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-12">
      <h2 className="text-3xl">{title}</h2>
      <div className="divider-gold" />
      {children}
    </section>
  );
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const related = getRelatedServices(service.slug as ServiceSlug);
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: service.name, path: `/services/${service.slug}` },
  ];

  return (
    <article className="section">
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <JsonLd data={serviceSchema(service)} />
      <JsonLd data={faqSchema(service.faqs) || undefined} />

      <div className="container-cn">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Services", href: "/services" },
            { label: service.name },
          ]}
        />

        <div className="grid lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-7">
            <p className="eyebrow">CareNest service · Pune</p>
            <h1 className="text-4xl md:text-5xl mt-2">{service.name}</h1>
            <p className="text-xl text-[var(--muted)] mt-4">{service.tagline}</p>
            <div className="mt-6 relative aspect-[16/10] overflow-hidden rounded-3xl">
              <Image
                src={service.image}
                alt={service.imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 60vw"
                priority
              />
            </div>

            <Section title="Service overview">
              <div className="prose-cn space-y-4">
                {service.overview.map((p) => (
                  <p key={p.slice(0, 32)}>{p}</p>
                ))}
              </div>
            </Section>

            <Section title="Who may need this support">
              <ul className="space-y-2 prose-cn">
                {service.whoNeeds.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-[var(--teal-deep)] font-bold" aria-hidden="true">
                      •
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Section>

            <Section title="What the service includes">
              <ul className="grid sm:grid-cols-2 gap-3">
                {service.includes.map((item) => (
                  <li key={item} className="card-soft text-sm text-[var(--muted)]">
                    {item}
                  </li>
                ))}
              </ul>
            </Section>

            <Section title="Typical home-care support activities">
              <ul className="space-y-2 prose-cn">
                {service.activities.map((item) => (
                  <li key={item}>– {item}</li>
                ))}
              </ul>
            </Section>

            <Section title="How CareNest arranges the service">
              <ol className="space-y-3">
                {service.howArranged.map((step, i) => (
                  <li key={step} className="card-soft flex gap-3">
                    <span className="font-extrabold text-[var(--gold-dark)]">{i + 1}</span>
                    <span className="prose-cn">{step}</span>
                  </li>
                ))}
              </ol>
            </Section>

            <Section title="Benefits of care support at home">
              <ul className="space-y-2 prose-cn">
                {service.benefits.map((item) => (
                  <li key={item}>– {item}</li>
                ))}
              </ul>
            </Section>

            <Section title="Why families choose CareNest">
              <ul className="space-y-2 prose-cn">
                {service.whyCareNest.map((item) => (
                  <li key={item}>– {item}</li>
                ))}
              </ul>
            </Section>

            <Section title="Pune context">
              <p className="prose-cn">{service.puneContext}</p>
            </Section>

            <Section title="Safety, dignity and quality">
              <ul className="space-y-2 prose-cn">
                {service.safety.map((item) => (
                  <li key={item}>– {item}</li>
                ))}
              </ul>
            </Section>

            <Section title="How to enquire">
              <p className="prose-cn">{service.enquire}</p>
              <div className="mt-5">
                <CTAButtons location={`service-${service.slug}`} serviceName={service.name} />
              </div>
            </Section>

            <Section title="Related CareNest services">
              <ul className="grid sm:grid-cols-2 gap-3">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link href={`/services/${r.slug}`} className="block card-soft hover:border-[var(--teal)] border border-transparent">
                      <span className="font-semibold text-[var(--royal)]">{r.name}</span>
                      <span className="block text-sm text-[var(--muted)] mt-1">{r.tagline}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Section>

            <Section title="Frequently asked questions">
              <FAQAccordion faqs={service.faqs} />
            </Section>
          </div>

          <aside className="lg:col-span-5 lg:sticky lg:top-28 space-y-6">
            <div className="card-soft bg-white">
              <p className="eyebrow">Talk to a coordinator</p>
              <p className="phone-emphasis mt-3">
                <a href={`tel:${COMPANY.phoneTel}`}>{COMPANY.phoneDisplay}</a>
              </p>
              <p className="prose-cn mt-2 text-sm">High-contrast, clickable phone number for desktop and mobile.</p>
              <div className="mt-5">
                <CTAButtons location={`service-aside-${service.slug}`} serviceName={service.name} showEnquire={false} />
              </div>
            </div>
            <LeadForm mode="enquiry" defaultService={service.name} />
          </aside>
        </div>
      </div>
    </article>
  );
}
