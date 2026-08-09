import React, { useEffect, useState } from "react";
import { Phone, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { COMPANY } from "@/data/content";
import { trackPhoneClick, trackWhatsAppClick } from "@/lib/analytics";

const FloatingActions = () => {
  const [showBar, setShowBar] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowBar(window.scrollY > 260);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div className="fixed z-40 bottom-6 right-4 md:right-6 flex flex-col items-end gap-3">
        <a
          data-testid="fab-whatsapp"
          href={`https://wa.me/${COMPANY.whatsapp}?text=${encodeURIComponent("Hi CareNest, I need help with home healthcare in Pune.")}`}
          target="_blank"
          rel="noreferrer"
          onClick={() => trackWhatsAppClick({ location: "fab" })}
          className="h-14 w-14 grid place-items-center rounded-full bg-[#25D366] text-white shadow-lux hover:shadow-lux-hover transition-shadow"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle size={22} />
        </a>
        <a
          data-testid="fab-call"
          href={`tel:${COMPANY.phone.replace(/\s/g, "")}`}
          onClick={() => trackPhoneClick({ location: "fab" })}
          className="hidden md:grid h-12 w-12 place-items-center rounded-full bg-primary text-primary-foreground shadow-lux hover:shadow-lux-hover transition-shadow"
          aria-label="Call CareNest"
        >
          <Phone size={18} />
        </a>
      </div>

      <div
        className={`fixed z-40 bottom-4 left-3 right-3 md:hidden transition-all duration-300 ${
          showBar ? "translate-y-0 opacity-100" : "translate-y-24 opacity-0 pointer-events-none"
        }`}
      >
        <div className="glass-strong rounded-full shadow-lux flex items-center gap-2 p-2">
          <a
            href={`tel:${COMPANY.phone.replace(/\s/g, "")}`}
            data-testid="mobile-fab-call"
            onClick={() => trackPhoneClick({ location: "mobile-fab" })}
            className="flex-1 btn-primary py-2.5 text-xs"
          >
            <Phone size={14} />
            Call
          </a>
          <a
            href={`https://wa.me/${COMPANY.whatsapp}`}
            target="_blank"
            rel="noreferrer"
            data-testid="mobile-fab-whatsapp"
            onClick={() => trackWhatsAppClick({ location: "mobile-fab" })}
            className="flex-1 rounded-full bg-[#25D366] text-white text-xs font-semibold py-2.5 flex items-center justify-center gap-1"
          >
            <MessageCircle size={14} />
            WhatsApp
          </a>
          <Link to="/contact" data-testid="mobile-fab-enquire" className="flex-1 btn-gold py-2.5 text-xs justify-center">
            Enquire
          </Link>
        </div>
      </div>
    </>
  );
};

export default FloatingActions;
