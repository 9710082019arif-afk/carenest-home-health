import React, { useState, useEffect } from "react";
import { TESTIMONIALS } from "@/data/content";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

const TestimonialCarousel = () => {
  const [i, setI] = useState(0);
  const total = TESTIMONIALS.length;
  const next = () => setI((v) => (v + 1) % total);
  const prev = () => setI((v) => (v - 1 + total) % total);

  useEffect(() => {
    const t = setInterval(next, 6500);
    return () => clearInterval(t);
  }, []);

  const t = TESTIMONIALS[i];

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/30 to-background" />
      </div>
      <div className="container-lux">
        <div className="flex items-end justify-between gap-6 mb-10">
          <div>
            <div className="overline text-accent">Patient stories</div>
            <h2 className="font-serif text-4xl md:text-5xl mt-3 tracking-tight">Voices we <span className="text-gold italic">carry with us.</span></h2>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <button onClick={prev} data-testid="testimonial-prev" className="h-11 w-11 rounded-full border border-border grid place-items-center hover:bg-muted transition-colors"><ChevronLeft size={16}/></button>
            <button onClick={next} data-testid="testimonial-next" className="h-11 w-11 rounded-full border border-border grid place-items-center hover:bg-muted transition-colors"><ChevronRight size={16}/></button>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-8 relative rounded-3xl border border-border/70 bg-card/70 backdrop-blur-sm p-8 md:p-12 shadow-lux">
            <Quote className="text-accent" size={40} />
            <blockquote key={t.id} className="mt-6 font-serif text-2xl md:text-[30px] leading-snug tracking-tight animate-fade-up">
              {t.text}
            </blockquote>
            <div className="mt-8 flex items-center justify-between">
              <div>
                <div className="font-semibold">{t.name}</div>
                <div className="text-sm text-muted-foreground">{t.relation} · {t.city}</div>
              </div>
              <div className="flex items-center gap-1">
                {Array.from({ length: t.rating }).map((_, k) => (<Star key={k} size={16} className="fill-accent text-accent" />))}
              </div>
            </div>
            <div className="mt-8 flex items-center gap-2">
              {TESTIMONIALS.map((_, k) => (
                <button key={k} onClick={() => setI(k)} className={`h-1.5 rounded-full transition-all ${k === i ? "w-8 bg-primary" : "w-3 bg-border"}`} aria-label={`Go to slide ${k+1}`} />
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 grid grid-cols-1 gap-4">
            <div className="rounded-3xl border border-border/70 bg-card/70 backdrop-blur-sm p-6">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, k) => (<Star key={k} size={16} className="fill-accent text-accent" />))}
              </div>
              <div className="mt-3 font-serif text-3xl font-medium">4.9 / 5</div>
              <div className="text-sm text-muted-foreground mt-1">Aggregate rating across 612 Google reviews</div>
            </div>
            <div className="rounded-3xl border border-border/70 bg-primary text-primary-foreground p-6">
              <div className="overline text-gold-light">Insurance</div>
              <div className="mt-2 font-serif text-2xl">Cashless & reimbursement claims</div>
              <p className="mt-2 text-sm text-primary-foreground/80 font-light">We coordinate with major insurers & TPA partners so your family focuses on recovery, not paperwork.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialCarousel;
