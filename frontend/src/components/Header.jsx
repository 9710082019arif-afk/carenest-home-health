import React, { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, Phone } from "lucide-react";
import { COMPANY, SERVICES } from "@/data/content";
import { PHONE_HREF, PHONE_DISPLAY } from "@/lib/cta";
import { cn } from "@/lib/utils";
import { trackPhoneClick } from "@/lib/analytics";

const NAV = [
  { label: "Services", to: "/#services" },
  { label: "Why CareNest", to: "/#why" },
  { label: "Contact", to: "/#contact" },
];

const Header = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  React.useEffect(() => {
    setOpen(false);
  }, [location.pathname, location.hash]);

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="glass hairline">
        <div className="container-lux flex items-center justify-between h-[68px] md:h-[76px]">
          <Link to="/" data-testid="header-logo" className="flex items-center gap-3 group">
            <img
              src={COMPANY.logo}
              alt="CareNest Home Health logo"
              className="h-11 w-11 rounded-xl object-cover ring-1 ring-black/5"
              width={44}
              height={44}
            />
            <div className="leading-tight">
              <div className="font-serif text-[20px] md:text-[22px] font-medium tracking-tight text-primary">
                Care<span className="text-gold">Nest</span>
              </div>
              <div className="text-[11px] font-medium text-muted-foreground mt-0.5 hidden sm:block">
                Home Health
              </div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {NAV.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                className={({ isActive }) =>
                  cn(
                    "px-3.5 py-2 text-[13.5px] font-medium tracking-wide rounded-full transition-colors",
                    isActive && item.to !== "/#services" && item.to !== "/#why" && item.to !== "/#contact"
                      ? "text-primary"
                      : "text-foreground/70 hover:text-primary"
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={PHONE_HREF}
              data-testid="header-call-btn"
              onClick={() => trackPhoneClick({ location: "header-cta" })}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary text-primary-foreground px-4 md:px-5 py-2.5 md:py-3 text-sm md:text-base font-bold tracking-wide shadow-lux hover:bg-primary/90 active:scale-[.98] transition-[transform,background-color]"
            >
              <Phone size={18} strokeWidth={2.5} />
              <span className="hidden sm:inline">Call {PHONE_DISPLAY}</span>
              <span className="sm:hidden">Call</span>
            </a>
            <button
              onClick={() => setOpen((o) => !o)}
              className="lg:hidden btn-ghost h-11 w-11 p-0"
              aria-label="Toggle menu"
              data-testid="header-menu-toggle"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="lg:hidden glass-strong border-t border-border/60">
          <div className="container-lux py-5 flex flex-col gap-1">
            {NAV.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="py-2.5 text-base font-medium"
                data-testid={`mobile-nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {item.label}
              </Link>
            ))}
            <div className="py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Our services
            </div>
            {SERVICES.map((s) => (
              <Link key={s.slug} to={`/services/${s.slug}`} className="py-2 pl-2 text-base font-medium">
                {s.name}
              </Link>
            ))}
            <div className="divider-gold my-3" />
            <a
              href={PHONE_HREF}
              className="btn-cta-call w-full"
              onClick={() => trackPhoneClick({ location: "header-mobile-menu" })}
            >
              <Phone size={18} /> Call Now: {PHONE_DISPLAY}
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
