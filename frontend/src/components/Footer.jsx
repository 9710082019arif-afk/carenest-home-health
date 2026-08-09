import React from "react";
import { Link } from "react-router-dom";
import { Instagram, Facebook, Linkedin, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { COMPANY, SERVICES } from "@/data/content";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-20 bg-royal text-white overflow-hidden">
      <div className="container-lux relative py-14">
        <div className="grid md:grid-cols-2 lg:grid-cols-12 gap-10">
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
                <div className="overline text-white/60 mt-1">Home healthcare · Pune</div>
              </div>
            </div>
            <p className="mt-5 text-white/80 leading-relaxed max-w-md font-light text-sm">
              Nursing Care, Patient Care, and Elder Care & Companionship — coordinated with care for families in Pune.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {[
                { icon: Instagram, url: COMPANY.socials.instagram, label: "Instagram" },
                { icon: Facebook, url: COMPANY.socials.facebook, label: "Facebook" },
                { icon: Linkedin, url: COMPANY.socials.linkedin, label: "LinkedIn" },
                { icon: Youtube, url: COMPANY.socials.youtube, label: "YouTube" },
              ].map(({ icon: Icon, url, label }) => (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`CareNest on ${label}`}
                  className="h-10 w-10 grid place-items-center rounded-full bg-white/10 hover:bg-gold hover:text-royal transition-colors"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="overline text-gold-light">Services</div>
            <ul className="mt-4 space-y-2.5">
              {SERVICES.map((s) => (
                <li key={s.slug}>
                  <Link to={`/services/${s.slug}`} className="text-sm text-white/80 hover:text-white link-underline">
                    {s.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/services" className="text-sm text-gold-light hover:text-gold link-underline">
                  All services →
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <div className="overline text-gold-light">Company</div>
            <ul className="mt-4 space-y-2.5 text-sm text-white/80">
              <li>
                <Link to="/about" className="hover:text-white">
                  About us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white">
                  Contact us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-white">
                  Privacy policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white">
                  Terms
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="hover:text-white">
                  Refund policy
                </Link>
              </li>
              <li>
                <Link to="/cancellation-policy" className="hover:text-white">
                  Cancellation policy
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <div className="overline text-gold-light">Reach us</div>
            <ul className="mt-4 space-y-3 text-sm text-white/80">
              <li className="flex items-start gap-2">
                <Phone size={14} className="mt-1" />
                <a href={`tel:${COMPANY.phone.replace(/\s/g, "")}`}>{COMPANY.phone}</a>
              </li>
              <li className="flex items-start gap-2">
                <Mail size={14} className="mt-1" />
                <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={14} className="mt-1" />
                {COMPANY.address}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-5 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/55">
          <div>© {year} CareNest Home Health. All rights reserved.</div>
          <div>Pune, Maharashtra</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
