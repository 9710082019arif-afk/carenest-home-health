import React, { useState, useEffect } from "react";
import { AlertTriangle, X, Phone } from "lucide-react";
import { COMPANY } from "@/data/content";

const KEY = "carenest_banner_dismissed_v1";

const EmergencyBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const dismissed = localStorage.getItem(KEY);
    // Show again after 6 hours
    if (!dismissed || Date.now() - Number(dismissed) > 6 * 60 * 60 * 1000) {
      const t = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(t);
    }
  }, []);

  const dismiss = () => {
    localStorage.setItem(KEY, String(Date.now()));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-3 md:inset-x-6 bottom-24 md:bottom-6 z-40 md:max-w-md md:left-auto md:right-6" data-testid="emergency-banner">
      <div className="glass-strong border border-destructive/40 rounded-2xl shadow-lux-hover p-4 md:p-5">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 h-9 w-9 rounded-xl bg-destructive/10 text-destructive grid place-items-center shrink-0">
            <AlertTriangle size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-serif text-lg leading-tight">Need urgent care?</div>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Our 24×7 emergency line is answered in seconds by a real care manager.
            </p>
            <a
              href={`tel:${COMPANY.phone.replace(/\s/g, "")}`}
              data-testid="emergency-banner-call"
              className="btn-primary mt-3 h-9 py-0 text-xs"
            >
              <Phone size={13} /> Call {COMPANY.phone}
            </a>
          </div>
          <button
            data-testid="emergency-banner-dismiss"
            onClick={dismiss}
            className="btn-ghost h-8 w-8 p-0 -mr-1 -mt-1"
            aria-label="Dismiss"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmergencyBanner;
