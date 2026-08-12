import React, { useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, Phone, ChevronDown, MessageCircle } from "lucide-react";
import { COMPANY, SERVICES } from "@/data/content";
import { cn } from "@/lib/utils";
import { trackPhoneClick, trackWhatsAppClick } from "@/lib/analytics";

const NAV = [
  { label: "Home", to: "/" },
  { label: "Services", to: "/services", mega: "services" },
  { label: "About Us", to: "/about" },
  { label: "Contact Us", to: "/contact" },
];

const Header = () => {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const closeTimer = useRef(null);
  const location = useLocation();

  React.useEffect(() => {
    setOpen(false);
    setServicesOpen(false);
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, [location.pathname]);

  const openServices = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setServicesOpen(true);
  };

  const scheduleCloseServices = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setServicesOpen(false), 120);
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="bg-royal text-white text-[11px] md:text-xs">
        <div className="container-lux flex items-center justify-between py-1.5 gap-4">
          <span className="opacity-90">Care at home in Pune · 24×7 coordination</span>
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

          <nav className="hidden lg:flex items-center gap-1">
            {NAV.map((item) =>
              item.mega === "services" ? (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={openServices}
                  onMouseLeave={scheduleCloseServices}
                  onFocus={openServices}
                  onBlur={scheduleCloseServices}
                >
                  <NavLink
                    to={item.to}
                    data-testid="nav-services"
                    aria-expanded={servicesOpen}
                    aria-haspopup="true"
                    className={({ isActive }) =>
                      cn(
                        "px-3.5 py-2 text-[13.5px] font-medium tracking-wide rounded-full transition-colors inline-flex items-center gap-1",
                        isActive || servicesOpen ? "text-primary" : "text-foreground/70 hover:text-primary"
                      )
                    }
                  >
                    Services
                    <ChevronDown size={13} className={cn("opacity-60 transition-transform", servicesOpen && "rotate-180")} />
                  </NavLink>

                  {/* pt-3 bridge removes hover gap between trigger and panel */}
                  <div
                    className={cn(
                      "absolute left-0 top-full z-50 pt-3 min-w-[300px]",
                      servicesOpen ? "visible opacity-100" : "invisible opacity-0 pointer-events-none"
                    )}
                    role="menu"
                    aria-label="Primary services"
                  >
                    <div className="rounded-2xl border border-border/70 bg-white shadow-lux p-2">
                      {SERVICES.map((s) => (
                        <Link
                          key={s.slug}
                          to={`/services/${s.slug}`}
                          role="menuitem"
                          className="block rounded-xl px-3.5 py-3 hover:bg-muted/70 transition-colors"
                          onClick={() => setServicesOpen(false)}
                        >
                          <div className="text-sm font-semibold text-foreground">{s.name}</div>
                          <div className="text-xs text-muted-foreground mt-0.5 leading-snug">{s.tagline}</div>
                        </Link>
                      ))}
                      <Link
                        to="/services"
                        className="block rounded-xl px-3.5 py-2.5 text-xs font-semibold text-primary hover:bg-primary/5"
                        onClick={() => setServicesOpen(false)}
                      >
                        View all services →
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <NavLink
                  key={item.label}
                  to={item.to}
                  data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                  className={({ isActive }) =>
                    cn(
                      "px-3.5 py-2 text-[13.5px] font-medium tracking-wide rounded-full transition-colors",
                      isActive ? "text-primary" : "text-foreground/70 hover:text-primary"
                    )
                  }
                >
                  {item.label}
                </NavLink>
              )
            )}
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
      </div>

      {open && (
        <div className="lg:hidden glass-strong border-t border-border/60">
          <div className="container-lux py-5 flex flex-col gap-1">
            {NAV.filter((n) => n.label !== "Services").map((item) => (
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
              <Link key={s.slug} to={`/services/${s.slug}`} className="py-2.5 pl-2 text-base font-medium">
                {s.name}
              </Link>
            ))}
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
