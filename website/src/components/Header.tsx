"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { COMPANY, telHref, whatsappHref } from "@/data/company";
import { SERVICES } from "@/data/services";
import { trackPhoneClick, trackWhatsAppClick } from "@/lib/analytics";

const NAV = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services", hasMenu: true },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const menuId = useId();
  const itemRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    setMobileOpen(false);
    setServicesOpen(false);
    setMobileServicesOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setServicesOpen(false);
        setMobileOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!servicesOpen) return;
    const onPointer = (e: MouseEvent) => {
      if (itemRef.current && !itemRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointer);
    return () => document.removeEventListener("mousedown", onPointer);
  }, [servicesOpen]);

  return (
    <header className="site-header">
      <div className="bg-[var(--royal)] text-white text-xs md:text-sm">
        <div className="container-cn flex items-center justify-between gap-3 py-2">
          <span>Care at home in Pune · Family-centred coordination</span>
          <a
            href={telHref}
            className="font-bold tracking-wide hover:text-[var(--gold)]"
            onClick={() => trackPhoneClick("header-top")}
          >
            {COMPANY.phoneDisplay}
          </a>
        </div>
      </div>

      <div className="container-cn flex items-center justify-between gap-4 py-3">
        <Link href="/" className="flex items-center gap-3 min-w-0" aria-label="CareNest Home Health home">
          <img
            src={COMPANY.logo}
            alt="CareNest Home Health logo"
            width={44}
            height={44}
            className="rounded-xl"
          />
          <div className="leading-tight min-w-0">
            <div className="font-[family-name:var(--font-serif)] text-[1.35rem] md:text-[1.5rem] text-[var(--royal)] font-semibold tracking-tight">
              Care<span className="text-[var(--gold-dark)]">Nest</span>
            </div>
            <div className="text-[0.7rem] uppercase tracking-[0.18em] text-[var(--muted)] font-bold hidden sm:block">
              Home Health · Pune
            </div>
          </div>
        </Link>

        <nav className="hidden lg:block" aria-label="Primary">
          <ul className="flex items-center gap-1">
            {NAV.map((item) => {
              if (!item.hasMenu) {
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="nav-link"
                      aria-current={pathname === item.href ? "page" : undefined}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              }

              return (
                <li
                  key={item.href}
                  className="nav-item"
                  ref={itemRef}
                  data-open={servicesOpen ? "true" : "false"}
                  onMouseEnter={() => setServicesOpen(true)}
                  onMouseLeave={() => setServicesOpen(false)}
                >
                  <button
                    type="button"
                    className="nav-link"
                    aria-expanded={servicesOpen}
                    aria-haspopup="true"
                    aria-controls={menuId}
                    onClick={() => setServicesOpen((v) => !v)}
                    onKeyDown={(e) => {
                      if (e.key === "ArrowDown") {
                        e.preventDefault();
                        setServicesOpen(true);
                      }
                    }}
                  >
                    Services
                    <span aria-hidden="true" className="text-[0.7rem]">
                      ▾
                    </span>
                  </button>
                  <div className="dropdown" id={menuId} role="menu">
                    <div className="dropdown-panel">
                      <Link href="/services" className="dropdown-link" role="menuitem">
                        All services
                      </Link>
                      {SERVICES.map((s) => (
                        <Link
                          key={s.slug}
                          href={`/services/${s.slug}`}
                          className="dropdown-link"
                          role="menuitem"
                        >
                          {s.navLabel}
                        </Link>
                      ))}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={whatsappHref()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline hidden md:inline-flex h-10 py-0"
            onClick={() => trackWhatsAppClick("header")}
          >
            WhatsApp
          </a>
          <a
            href={telHref}
            className="btn btn-gold hidden md:inline-flex h-10 py-0"
            onClick={() => trackPhoneClick("header-cta")}
          >
            Call
          </a>
          <button
            type="button"
            className="lg:hidden btn btn-outline h-10 w-10 p-0"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div id="mobile-nav" className="lg:hidden border-t border-[var(--line)] bg-white/95">
          <div className="container-cn py-4 flex flex-col gap-1">
            <Link href="/" className="py-3 font-semibold">
              Home
            </Link>
            <button
              type="button"
              className="py-3 font-semibold text-left flex items-center justify-between"
              aria-expanded={mobileServicesOpen}
              onClick={() => setMobileServicesOpen((v) => !v)}
            >
              Services
              <span aria-hidden="true">{mobileServicesOpen ? "−" : "+"}</span>
            </button>
            {mobileServicesOpen && (
              <div className="pl-3 pb-2 flex flex-col">
                <Link href="/services" className="py-2 text-[var(--muted)]">
                  All services
                </Link>
                {SERVICES.map((s) => (
                  <Link key={s.slug} href={`/services/${s.slug}`} className="py-2 text-[var(--muted)]">
                    {s.navLabel}
                  </Link>
                ))}
              </div>
            )}
            <Link href="/about" className="py-3 font-semibold">
              About Us
            </Link>
            <Link href="/contact" className="py-3 font-semibold">
              Contact Us
            </Link>
            <div className="divider-gold" />
            <a href={telHref} className="btn btn-gold" onClick={() => trackPhoneClick("mobile-menu")}>
              Call {COMPANY.phoneDisplay}
            </a>
            <a
              href={whatsappHref()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline mt-2"
              onClick={() => trackWhatsAppClick("mobile-menu")}
            >
              WhatsApp
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
