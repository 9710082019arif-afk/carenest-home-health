import React, { useEffect, useRef, useState } from "react";
import { X, HeartPulse } from "lucide-react";
import LeadForm from "./LeadForm";

const KEY = "carenest_exit_intent_shown_v1";

const ExitIntentPopup = () => {
  const [open, setOpen] = useState(false);
  const armedRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(KEY)) return;

    const armTimer = setTimeout(() => { armedRef.current = true; }, 15000);
    const onMouseOut = (e) => {
      if (!armedRef.current) return;
      if (e.clientY < 8 && !e.relatedTarget && !e.toElement) {
        setOpen(true);
        sessionStorage.setItem(KEY, "1");
        document.removeEventListener("mouseout", onMouseOut);
      }
    };
    document.addEventListener("mouseout", onMouseOut);
    return () => {
      clearTimeout(armTimer);
      document.removeEventListener("mouseout", onMouseOut);
    };
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[75] grid place-items-center p-4" data-testid="exit-intent-popup">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <div className="relative w-full max-w-lg rounded-3xl border border-border/70 bg-card shadow-lux-hover overflow-hidden">
        <button
          data-testid="exit-intent-close"
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 h-9 w-9 rounded-full grid place-items-center bg-muted hover:bg-muted/70 z-10"
          aria-label="Close"
        ><X size={15}/></button>

        <div className="p-8">
          <div className="h-11 w-11 rounded-2xl bg-accent/15 text-accent grid place-items-center">
            <HeartPulse size={20} />
          </div>
          <div className="overline text-accent mt-4">Before you go</div>
          <h2 className="font-serif text-3xl mt-3 tracking-tight leading-tight">
            Get a <span className="text-gold italic">free 10-minute</span> care consultation.
          </h2>
          <p className="mt-3 text-sm text-muted-foreground font-light leading-relaxed">
            Share a phone number and we'll call back with a personalised plan — no obligation, no follow-up spam.
          </p>

          <div className="mt-6">
            <LeadForm variant="exit-intent" title={null} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExitIntentPopup;
