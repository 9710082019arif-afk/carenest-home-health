"use client";

import { useState } from "react";
import type { ServiceFAQ } from "@/data/services";

export function FAQAccordion({ faqs }: { faqs: ServiceFAQ[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {faqs.map((faq, i) => {
        const isOpen = open === i;
        return (
          <div key={faq.q} className="card-soft !p-0 overflow-hidden">
            <button
              type="button"
              className="w-full text-left px-5 py-4 font-semibold text-[var(--royal)] flex justify-between gap-4"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : i)}
            >
              <span>{faq.q}</span>
              <span aria-hidden="true">{isOpen ? "−" : "+"}</span>
            </button>
            {isOpen && <div className="px-5 pb-4 prose-cn">{faq.a}</div>}
          </div>
        );
      })}
    </div>
  );
}
