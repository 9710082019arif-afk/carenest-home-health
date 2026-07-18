import React from "react";
import Layout from "@/components/Layout";
import PageHeader from "@/components/PageHeader";
import { FAQS } from "@/data/content";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQ = () => (
  <Layout>
    <PageHeader eyebrow="Frequently asked" title="Answers, honestly." subtitle="Still not sure? WhatsApp us and a real human will reply within minutes." crumbs={[{ label: "FAQ" }]} />
    <section className="container-lux pb-24 max-w-4xl">
      <Accordion type="single" collapsible className="space-y-3">
        {FAQS.map((f, i) => (
          <AccordionItem key={i} value={`q${i}`} className="rounded-2xl border border-border/70 bg-card/60 px-5">
            <AccordionTrigger data-testid={`faqpage-q-${i}`} className="text-left font-serif text-xl py-5 hover:no-underline">{f.q}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground pb-5 font-light leading-relaxed">{f.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  </Layout>
);

export default FAQ;
