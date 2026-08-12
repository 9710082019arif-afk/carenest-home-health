import React from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";
import { COMPANY, SERVICES } from "@/data/content";
import { PHONE_HREF, PHONE_DISPLAY } from "@/lib/cta";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-0 bg-primary text-primary-foreground overflow-hidden border-t border-white/10">
      <div className="container-lux relative py-10 md:py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3">
              <img
                src={COMPANY.logo}
                alt="CareNest Home Health logo"
                className="h-11 w-11 rounded-xl bg-white/95 p-1"
                width={44}
                height={44}
              />
              <div>
                <div className="font-serif text-2xl font-medium">
                  Care<span className="text-gold">Nest</span>
                </div>
                <div className="text-[11px] uppercase tracking-wider text-white/60 mt-1">Home Health</div>
              </div>
            </div>
            <p className="mt-4 text-white/80 leading-relaxed max-w-md font-light text-sm">
              Patient Care, Elder Care, and Nursing Care at home — coordinated with care for your family.
            </p>
          </div>

          <div className="lg:col-span-3">
            <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold-light">Services</div>
            <ul className="mt-4 space-y-2.5">
              {SERVICES.map((s) => (
                <li key={s.slug}>
                  <Link to={`/services/${s.slug}`} className="text-sm text-white/80 hover:text-white link-underline">
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4">
            <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold-light">Reach us</div>
            <ul className="mt-4 space-y-3 text-sm text-white/80">
              <li className="flex items-start gap-2">
                <Phone size={14} className="mt-1 shrink-0" />
                <a href={PHONE_HREF}>{PHONE_DISPLAY}</a>
              </li>
              <li className="flex items-start gap-2">
                <Mail size={14} className="mt-1 shrink-0" />
                <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={14} className="mt-1 shrink-0" />
                {COMPANY.address}
              </li>
            </ul>
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-white/55">
              <Link to="/privacy-policy" className="hover:text-white">
                Privacy
              </Link>
              <Link to="/terms" className="hover:text-white">
                Terms
              </Link>
              <Link to="/contact" className="hover:text-white">
                Contact
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-5 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/55">
          <div>© {year} CareNest Home Health. All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
