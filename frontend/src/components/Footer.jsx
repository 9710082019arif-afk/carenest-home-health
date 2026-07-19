import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Instagram, Facebook, Linkedin, Youtube, Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { COMPANY, SERVICES, LOCATIONS } from "@/data/content";
import { subscribeNewsletter } from "@/lib/api";
import { toast } from "sonner";

const Footer = () => {
  const [email, setEmail] = useState("");
  const submit = async (e) => {
    e.preventDefault();
    if (!email.includes("@")) return toast.error("Please enter a valid email");
    try {
      await subscribeNewsletter(email);
      toast.success("Subscribed. Watch out for our monthly care digest.");
      setEmail("");
    } catch { toast.error("Could not subscribe. Try again later."); }
  };
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-24 bg-royal text-white overflow-hidden">
      <div className="absolute inset-0 noise opacity-30 pointer-events-none" />
      <div className="container-lux relative py-20">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3">
              <img src={COMPANY.logo} alt="logo" className="h-12 w-12 rounded-xl bg-white/95 p-1" />
              <div>
                <div className="font-serif text-2xl font-medium">Java <span className="text-gold">Home</span> Care</div>
                <div className="overline text-white/60 mt-1">Est. India</div>
              </div>
            </div>
            <p className="mt-6 text-white/80 leading-relaxed max-w-md font-light">
              Premium home healthcare — skilled nurses, physicians and caregivers, coordinated with the warmth of a
              family. Available 24×7 across India.
            </p>

            <form onSubmit={submit} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md">
              <input
                data-testid="footer-newsletter-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Your email · monthly care digest"
                className="flex-1 rounded-full bg-white/10 border border-white/15 px-5 py-3 text-sm placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-gold"
              />
              <button data-testid="footer-newsletter-submit" type="submit" className="btn-gold h-11 py-0 shrink-0">Subscribe <ArrowRight size={16}/></button>
            </form>

            <div className="mt-8 flex items-center gap-3">
              {[
                { icon: Instagram, url: COMPANY.socials.instagram },
                { icon: Facebook, url: COMPANY.socials.facebook },
                { icon: Linkedin, url: COMPANY.socials.linkedin },
                { icon: Youtube, url: COMPANY.socials.youtube },
              ].map(({ icon: Icon, url }, i) => (
                <a key={i} href={url} target="_blank" rel="noreferrer" className="h-10 w-10 grid place-items-center rounded-full bg-white/10 hover:bg-gold hover:text-royal transition-colors">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="overline text-gold-light">Services</div>
            <ul className="mt-5 space-y-2.5">
              {SERVICES.slice(0, 8).map((s) => (
                <li key={s.slug}><Link to={`/services/${s.slug}`} className="text-sm text-white/80 hover:text-white link-underline">{s.name}</Link></li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <div className="overline text-gold-light">Locations</div>
            <ul className="mt-5 space-y-2.5">
              {LOCATIONS.slice(0, 8).map((l) => (
                <li key={l.slug}><Link to={`/locations/${l.slug}`} className="text-sm text-white/80 hover:text-white link-underline">{l.name}</Link></li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <div className="overline text-gold-light">Company</div>
            <ul className="mt-5 space-y-2.5 text-sm text-white/80">
              <li><Link to="/about" className="hover:text-white">About us</Link></li>
              <li><Link to="/pricing" className="hover:text-white">Pricing</Link></li>
              <li><Link to="/careers" className="hover:text-white">Careers</Link></li>
              <li><Link to="/gallery" className="hover:text-white">Gallery</Link></li>
              <li><Link to="/faq" className="hover:text-white">FAQ</Link></li>
              <li><Link to="/blog" className="hover:text-white">Blog</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-white">Privacy policy</Link></li>
              <li><Link to="/terms" className="hover:text-white">Terms</Link></li>
              <li><Link to="/refund-policy" className="hover:text-white">Refund policy</Link></li>
              <li><Link to="/cancellation-policy" className="hover:text-white">Cancellation policy</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <div className="overline text-gold-light">Reach us</div>
            <ul className="mt-5 space-y-3 text-sm text-white/80">
              <li className="flex items-start gap-2"><Phone size={14} className="mt-1"/><a href={`tel:${COMPANY.phone.replace(/\s/g,'')}`}>{COMPANY.phone}</a></li>
              <li className="flex items-start gap-2"><Mail size={14} className="mt-1"/><a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a></li>
              <li className="flex items-start gap-2"><MapPin size={14} className="mt-1"/>{COMPANY.address}</li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/55">
          <div>© {year} Java Home Health Care. All rights reserved.</div>
          <div>Crafted with care · India</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
