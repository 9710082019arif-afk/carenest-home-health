import React, { useEffect, useState } from "react";
import { Phone, MessageCircle, Ambulance, MessageSquare } from "lucide-react";
import { COMPANY } from "@/data/content";
import ChatWidget from "./ChatWidget";

const FloatingActions = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [showBar, setShowBar] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowBar(window.scrollY > 260);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div className="fixed z-40 bottom-6 right-4 md:right-6 flex flex-col items-end gap-3">
        <button
          data-testid="fab-chat"
          onClick={() => setChatOpen(true)}
          className="group h-12 w-12 grid place-items-center rounded-full bg-primary text-primary-foreground shadow-lux hover:shadow-lux-hover transition-shadow"
          aria-label="Open AI care assistant"
        >
          <MessageSquare size={18} />
        </button>

        <a
          data-testid="fab-whatsapp"
          href={`https://wa.me/${COMPANY.whatsapp}?text=${encodeURIComponent("Hi Java Home Care, I need help with home healthcare.")}`}
          target="_blank" rel="noreferrer"
          className="relative h-14 w-14 grid place-items-center rounded-full bg-[#25D366] text-white shadow-lux hover:shadow-lux-hover transition-shadow"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle size={22} />
          <span className="absolute inset-0 rounded-full bg-[#25D366]/40 animate-pulse-ring" />
        </a>
      </div>

      {/* Sticky mobile action bar */}
      <div className={`fixed z-40 bottom-4 left-3 right-3 md:hidden transition-all duration-300 ${showBar ? "translate-y-0 opacity-100" : "translate-y-24 opacity-0"}`}>
        <div className="glass-strong rounded-full shadow-lux flex items-center gap-2 p-2">
          <a href={`tel:${COMPANY.phone.replace(/\s/g,'')}`} data-testid="mobile-fab-call" className="flex-1 btn-primary py-2.5 text-xs"><Phone size={14}/>Call</a>
          <a href={`https://wa.me/${COMPANY.whatsapp}`} target="_blank" rel="noreferrer" data-testid="mobile-fab-whatsapp" className="flex-1 rounded-full bg-[#25D366] text-white text-xs font-semibold py-2.5 flex items-center justify-center gap-1"><MessageCircle size={14}/>WhatsApp</a>
          <a href="/book-appointment" data-testid="mobile-fab-book" className="flex-1 btn-gold py-2.5 text-xs"><Ambulance size={14}/>Book</a>
        </div>
      </div>

      <ChatWidget open={chatOpen} onClose={() => setChatOpen(false)} />
    </>
  );
};

export default FloatingActions;
