import React, { useEffect, useRef, useState } from "react";
import { X, Send, Sparkles } from "lucide-react";
import { streamChat } from "@/lib/api";

const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

const ChatWidget = ({ open, onClose }) => {
  const [sessionId] = useState(() => {
    const k = "jhc_chat_session";
    let v = typeof window !== "undefined" ? localStorage.getItem(k) : null;
    if (!v) { v = uid(); if (typeof window !== "undefined") localStorage.setItem(k, v); }
    return v;
  });
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Namaste — I'm Care Concierge from Java Home Health Care. How can we help you or your loved one today?" },
  ]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, open]);

  const submit = async (e) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text || streaming) return;
    setMessages((m) => [...m, { role: "user", content: text }, { role: "assistant", content: "" }]);
    setInput("");
    setStreaming(true);
    try {
      for await (const chunk of streamChat(sessionId, text)) {
        setMessages((m) => {
          const copy = [...m];
          const last = copy[copy.length - 1];
          copy[copy.length - 1] = { ...last, content: (last.content || "") + chunk };
          return copy;
        });
      }
    } catch (err) {
      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = { role: "assistant", content: "Sorry — I couldn't reach our AI just now. Please WhatsApp us on +91 9175724546 and we'll respond immediately." };
        return copy;
      });
    } finally { setStreaming(false); }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-end md:items-center justify-end md:justify-end p-0 md:p-6" data-testid="chat-widget">
      <div className="absolute inset-0 bg-black/40 md:bg-transparent" onClick={onClose} />
      <div className="relative w-full md:w-[400px] h-[85dvh] md:h-[560px] glass-strong border border-border/60 md:rounded-3xl rounded-t-3xl shadow-lux-hover flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/60">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-full bg-primary text-primary-foreground grid place-items-center">
              <Sparkles size={16} />
            </div>
            <div>
              <div className="font-serif text-lg leading-none">Care Concierge</div>
              <div className="text-[11px] text-muted-foreground mt-1">Powered by Java · replies in seconds</div>
            </div>
          </div>
          <button data-testid="chat-close" onClick={onClose} className="btn-ghost h-9 w-9 p-0"><X size={16} /></button>
        </div>

        <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-sm"
                    : "bg-muted text-foreground rounded-bl-sm"
                }`}
              >
                {m.content || (streaming && i === messages.length - 1 ? <span className="opacity-60">Thinking…</span> : null)}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={submit} className="p-3 border-t border-border/60 flex items-center gap-2">
          <input
            data-testid="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about services, pricing, availability…"
            className="flex-1 rounded-full bg-muted/70 border border-border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
          />
          <button data-testid="chat-send" type="submit" disabled={streaming || !input.trim()} className="btn-primary h-10 w-10 p-0 rounded-full disabled:opacity-40">
            <Send size={15} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWidget;
