import Link from "next/link";
import { COMPANY, telHref, whatsappHref } from "@/data/company";
import { SERVICES } from "@/data/services";

export function Footer() {
  return (
    <footer className="mt-8 bg-[var(--royal)] text-white">
      <div className="container-cn py-12 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="flex items-center gap-3">
            <img src={COMPANY.logo} alt="" width={40} height={40} className="rounded-lg bg-white/10" />
            <div className="font-[family-name:var(--font-serif)] text-2xl font-semibold">
              Care<span className="text-[var(--gold)]">Nest</span>
            </div>
          </div>
          <p className="mt-4 text-white/80 text-sm leading-relaxed">
            Professional home care support for families in Pune — arranged with dignity, clarity and
            dependable coordination.
          </p>
        </div>

        <div>
          <h2 className="text-sm uppercase tracking-[0.18em] text-[var(--gold)] font-bold mb-4">Services</h2>
          <ul className="space-y-2 text-sm text-white/85">
            {SERVICES.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className="hover:text-[var(--gold)]">
                  {s.navLabel}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm uppercase tracking-[0.18em] text-[var(--gold)] font-bold mb-4">Company</h2>
          <ul className="space-y-2 text-sm text-white/85">
            <li>
              <Link href="/about" className="hover:text-[var(--gold)]">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-[var(--gold)]">
                Contact Us
              </Link>
            </li>
            <li>
              <Link href="/faq" className="hover:text-[var(--gold)]">
                FAQ
              </Link>
            </li>
            <li>
              <Link href="/privacy-policy" className="hover:text-[var(--gold)]">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-[var(--gold)]">
                Terms
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-sm uppercase tracking-[0.18em] text-[var(--gold)] font-bold mb-4">Contact</h2>
          <ul className="space-y-3 text-sm">
            <li>
              <a href={telHref} className="font-bold text-lg text-white hover:text-[var(--gold)] underline underline-offset-4 decoration-2">
                {COMPANY.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={whatsappHref()} className="text-white/90 hover:text-[var(--gold)]" target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
            </li>
            <li>
              <a href={`mailto:${COMPANY.email}`} className="text-white/90 hover:text-[var(--gold)]">
                {COMPANY.email}
              </a>
            </li>
            <li className="text-white/75">{COMPANY.serviceArea}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/15">
        <div className="container-cn py-4 text-xs text-white/65 flex flex-col sm:flex-row gap-2 sm:justify-between">
          <span>© {new Date().getFullYear()} {COMPANY.name}. All rights reserved.</span>
          <span>Primary focus: Pune, Maharashtra</span>
        </div>
      </div>
    </footer>
  );
}
