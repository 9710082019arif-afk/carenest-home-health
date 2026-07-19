import React, { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, Sun, Moon, Phone, ChevronDown, Ambulance } from "lucide-react";
import { COMPANY, SERVICES, LOCATIONS } from "@/data/content";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Services", to: "/services", mega: "services" },
  { label: "Pricing", to: "/pricing" },
  { label: "Locations", to: "/#locations", mega: "locations" },
  { label: "Testimonials", to: "/testimonials" },
  { label: "Blog", to: "/blog" },
  { label: "Careers", to: "/careers" },
  { label: "Contact", to: "/contact" },
];

const Header = () => {
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState(null);
  const { theme, toggle } = useTheme();
  const location = useLocation();

  React.useEffect(() => { setOpen(false); setMega(null); }, [location.pathname]);

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      {/* Emergency ribbon */}
      <div className="bg-royal text-white text-[11px] md:text-xs">
        <div className="container-lux flex items-center justify-between py-1.5 gap-4">
          <div className="flex items-center gap-2 opacity-90">
            <Ambulance size={14} className="text-gold-light" />
            <span className="hidden sm:inline">24×7 emergency care coordination · in-network with major insurers</span>
            <span className="sm:hidden">24×7 emergency care</span>
          </div>
          <a href={`tel:${COMPANY.phone.replace(/\s/g, "")}`} data-testid="header-emergency-call" className="font-semibold tracking-wide flex items-center gap-1.5 hover:text-gold-light transition-colors">
            <Phone size={12} /> {COMPANY.phone}
          </a>
        </div>
      </div>

      <div className="glass hairline">
        <div className="container-lux flex items-center justify-between h-[68px] md:h-[76px]">
          <Link to="/" data-testid="header-logo" className="flex items-center gap-3 group">
            <img src={COMPANY.logo} alt="Java Home Health Care logo" className="h-11 w-11 rounded-xl object-cover ring-1 ring-black/5 dark:ring-white/10" />
            <div className="leading-tight">
              <div className="font-serif text-[19px] md:text-[21px] font-medium tracking-tight text-primary">Java <span className="text-gold">Home</span> Care</div>
              <div className="overline text-muted-foreground mt-0.5 hidden md:block">Premium home healthcare</div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1" onMouseLeave={() => setMega(null)}>
            {NAV.map((item) => (
              <div key={item.label} className="relative" onMouseEnter={() => setMega(item.mega || null)}>
                <NavLink
                  to={item.to}
                  data-testid={`nav-${item.label.toLowerCase()}`}
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
            <button data-testid="theme-toggle" onClick={toggle} aria-label="Toggle theme" className="btn-ghost h-10 w-10 p-0">
              {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <Link to="/book-appointment" data-testid="header-book-btn" className="hidden md:inline-flex btn-gold h-10 py-0">Book appointment</Link>
            <button onClick={() => setOpen((o) => !o)} className="lg:hidden btn-ghost h-10 w-10 p-0" aria-label="Toggle menu" data-testid="header-menu-toggle">
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mega menus */}
        {mega === "services" && (
          <div className="hidden lg:block border-t border-border/60 glass-strong" onMouseEnter={() => setMega("services")} onMouseLeave={() => setMega(null)}>
            <div className="container-lux py-8 grid grid-cols-4 gap-x-8 gap-y-2">
              {SERVICES.map((s) => (
                <Link key={s.slug} to={`/services/${s.slug}`} className="group py-2 flex items-start gap-3">
                  <div className="mt-1 h-1.5 w-1.5 rounded-full bg-accent group-hover:scale-150 transition-transform" />
                  <div>
                    <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{s.name}</div>
                    <div className="text-xs text-muted-foreground">{s.tagline}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
        {mega === "locations" && (
          <div className="hidden lg:block border-t border-border/60 glass-strong" onMouseEnter={() => setMega("locations")} onMouseLeave={() => setMega(null)}>
            <div className="container-lux py-8 grid grid-cols-4 gap-x-8 gap-y-3">
              {LOCATIONS.map((l) => (
                <Link key={l.slug} to={`/locations/${l.slug}`} className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
                  {l.name} <span className="text-xs text-muted-foreground">· {l.state}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden glass-strong border-t border-border/60">
          <div className="container-lux py-6 flex flex-col gap-2">
            {NAV.map((item) => (
              <Link key={item.label} to={item.to} className="py-2 text-base font-medium" data-testid={`mobile-nav-${item.label.toLowerCase()}`}>{item.label}</Link>
            ))}
            <div className="divider-gold my-3" />
            <Link to="/book-appointment" className="btn-gold">Book appointment</Link>
            <a href={`tel:${COMPANY.phone.replace(/\s/g, "")}`} className="btn-outline mt-2">Call {COMPANY.phone}</a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
