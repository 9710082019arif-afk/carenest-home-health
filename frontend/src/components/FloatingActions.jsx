import React from "react";
import { Phone } from "lucide-react";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { PHONE_HREF, WHATSAPP_HREF } from "@/lib/cta";
import { trackPhoneClick, trackWhatsAppClick } from "@/lib/analytics";

/**
 * Desktop: floating WhatsApp with label + gentle pulse (bottom-right).
 * Mobile: always-visible fixed bottom bar — Call Now | WhatsApp Now.
 */
const FloatingActions = () => {
  return (
    <>
      {/* Desktop floating WhatsApp */}
      <div className="fixed z-40 bottom-6 right-6 hidden md:block">
        <a
          data-testid="fab-whatsapp"
          href={WHATSAPP_HREF}
          target="_blank"
          rel="noreferrer"
          onClick={() => trackWhatsAppClick({ location: "fab" })}
          className="wa-pulse inline-flex items-center gap-2.5 rounded-full bg-whatsapp text-white pl-4 pr-5 py-3.5 text-base font-bold shadow-lux hover:brightness-105 transition-[filter,transform] active:scale-[.98]"
          aria-label="Chat on WhatsApp"
        >
          <WhatsAppIcon size={24} />
          Chat on WhatsApp
        </a>
      </div>

      {/* Mobile fixed bottom CTA bar — always visible */}
      <div
        className="fixed z-40 inset-x-0 bottom-0 md:hidden bg-white/95 backdrop-blur-md border-t border-border/80 shadow-[0_-8px_30px_rgba(11,92,62,0.12)]"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
        data-testid="mobile-cta-bar"
      >
        <div className="grid grid-cols-2 gap-2.5 px-3 pt-2.5 pb-2.5">
          <a
            href={PHONE_HREF}
            data-testid="mobile-fab-call"
            onClick={() => trackPhoneClick({ location: "mobile-cta-bar" })}
            className="flex items-center justify-center gap-2 rounded-2xl bg-primary text-primary-foreground min-h-[52px] text-[15px] font-bold tracking-wide active:scale-[.98] transition-transform"
          >
            <Phone size={20} strokeWidth={2.5} />
            Call Now
          </a>
          <a
            href={WHATSAPP_HREF}
            target="_blank"
            rel="noreferrer"
            data-testid="mobile-fab-whatsapp"
            onClick={() => trackWhatsAppClick({ location: "mobile-cta-bar" })}
            className="flex items-center justify-center gap-2 rounded-2xl bg-whatsapp text-white min-h-[52px] text-[15px] font-bold tracking-wide active:scale-[.98] transition-transform"
          >
            <WhatsAppIcon size={20} />
            WhatsApp Now
          </a>
        </div>
      </div>
    </>
  );
};

export default FloatingActions;
