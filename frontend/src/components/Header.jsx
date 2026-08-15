import React, { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, Phone, ChevronDown, MessageCircle } from "lucide-react";
import { COMPANY, SERVICES } from "@/data/content";
import { cn } from "@/lib/utils";
import { trackPhoneClick, trackWhatsAppClick } from "@/lib/analytics";

const NAV = [
  { label: "Home", to: "/" },
  { label: "Services", to: "/services", mega: "services" },
  { label: "Locations", to: "/locations", mega: "locations" },
  { label: "About Us", to: "/about" },
  { label: "Contact Us", to: "/contact" },
];

const Header = () => {
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState(null);
  const location = useLocation();

  React.useEffect(() => {
    setOpen(false);
    setMega(null);
  }, [location.pathname]);

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="bg-royal text-white text-[11px] md:text-xs">
        <div className="container-lux flex items-center justify-between py-1.5 gap-4">
          <span className="opacity-90">Care at home in Pune &amp; PCMC · 24×7 coordination</span>
          <a
            href={`tel:${COMPANY.phone.replace(/\s/g, "")}`}
            data-testid="header-emergency-call"
            onClick={() => trackPhoneClick({ location: "header" })}
            className="font-semibold tracking-wide flex items-center gap-1.5 hover:text-gold-light transition-colors"
          >
            <Phone size={12} /> {COMPANY.phone}
          </a>
        </div>
      </div>

      <div className="glass hairline">
        <div className="container-lux flex items-center justify-between h-[64px] md:h-[72px]">
          <Link to="/" data-testid="header-logo" className="flex items-center gap-3 group">
            <img
              src={COMPANY.logo}
              alt="CareNest Home Health logo"
              className="h-10 w-10 rounded-xl object-cover ring-1 ring-black/5"
              width={40}
              height={40}
            />
            <div className="leading-tight">
              <div className="font-serif text-[19px] md:text-[21px] font-medium tracking-tight text-primary">
                Care<span className="text-gold">Nest</span>
              </div>
              <div className="overline text-muted-foreground mt-0.5 hidden md:block">Home healthcare · Pune</div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1" onMouseLeave={() => setMega(null)}>
            {NAV.map((item) => (
              <div key={item.label} className="relative" onMouseEnter={() => setMega(item.mega || null)}>
                <NavLink
                  to={item.to}
                  data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                  className={({ isActive }) =>
                    cn(
                      "px-3.5 py-2 text-[13.5px] font-medium tracking-wide rounded-full transition-colors flex items-center gap-1",
                      isActive ? "text-primary" : "text-foreground/70 hover:text-primary"
                    )
                  }
                >
                  {item.label}
                  {item.mega && <ChevronDown size={13} className="opacity-60" />}
                </NavLink>
              </div>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={`https://wa.me/${COMPANY.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              data-testid="header-whatsapp"
              onClick={() => trackWhatsAppClick({ location: "header" })}
              className="hidden md:inline-flex btn-outline h-10 py-0"
            >
              <MessageCircle size={15} /> WhatsApp
            </a>
            <a
              href={`tel:${COMPANY.phone.replace(/\s/g, "")}`}
              data-testid="header-call-btn"
              onClick={() => trackPhoneClick({ location: "header-cta" })}
              className="hidden md:inline-flex btn-gold h-10 py-0"
            >
              <Phone size={15} /> Call
            </a>
            <button
              onClick={() => setOpen((o) => !o)}
              className="lg:hidden btn-ghost h-10 w-10 p-0"
              aria-label="Toggle menu"
              data-testid="header-menu-toggle"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {mega === "services" && (
          <div
            className="hidden lg:block border-t border-border/60 glass-strong"
            onMouseEnter={() => setMega("services")}
            onMouseLeave={() => setMega(null)}
          >
            <div className="container-lux py-6 grid grid-cols-3 gap-6">
              {SERVICES.map((s) => (
                <Link key={s.slug} to={`/services/${s.slug}`} className="group py-2">
                  <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                    {s.name}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{s.tagline}</div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {mega === "locations" && (
          <div
            className="hidden lg:block border-t border-border/60 glass-strong"
            onMouseEnter={() => setMega("locations")}
            onMouseLeave={() => setMega(null)}
          >
            <div className="container-lux py-6 grid grid-cols-3 gap-6">
              <Link to="/locations" className="group py-2">
                <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                  All locations
                </div>
                <div className="text-xs text-muted-foreground mt-1">Browse CareNest city pages</div>
              </Link>
              <Link to="/locations/pune" className="group py-2">
                <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                  Pune
                </div>
                <div className="text-xs text-muted-foreground mt-1">Primary service area</div>
              </Link>
              <Link to="/locations/pimpri-chinchwad" className="group py-2">
                <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                  Pimpri-Chinchwad (PCMC)
                </div>
                <div className="text-xs text-muted-foreground mt-1">Primary service area</div>
              </Link>
            </div>
          </div>
        )}
      </div>

      {open && (
        <div className="lg:hidden glass-strong border-t border-border/60">
          <div className="container-lux py-5 flex flex-col gap-1">
            {NAV.filter((n) => n.label !== "Services" && n.label !== "Locations").map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="py-2 text-base font-medium"
                data-testid={`mobile-nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {item.label}
              </Link>
            ))}
            <div className="py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Services</div>
            {SERVICES.map((s) => (
              <Link key={s.slug} to={`/services/${s.slug}`} className="py-2 pl-2 text-base font-medium">
                {s.name}
              </Link>
            ))}
            <div className="py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Locations</div>
            <Link to="/locations" className="py-2 pl-2 text-base font-medium">
              All locations
            </Link>
            <Link to="/locations/pune" className="py-2 pl-2 text-base font-medium">
              Pune
            </Link>
            <Link to="/locations/pimpri-chinchwad" className="py-2 pl-2 text-base font-medium">
              Pimpri-Chinchwad (PCMC)
            </Link>
            <div className="divider-gold my-3" />
            <a href={`tel:${COMPANY.phone.replace(/\s/g, "")}`} className="btn-gold">
              Call {COMPANY.phone}
            </a>
            <a
              href={`https://wa.me/${COMPANY.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="btn-outline mt-2"
            >
              WhatsApp
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
