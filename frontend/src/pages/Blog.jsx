import React from "react";
import Layout from "@/components/Layout";
import PageHeader from "@/components/PageHeader";
import { BLOG_POSTS } from "@/data/content";
import { Clock } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import { PAGE_SEO } from "@/lib/seo";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";

const Blog = () => (
  <Layout>
    <SEOHead seo={PAGE_SEO.blog} />
    <JsonLd data={breadcrumbSchema([{ label: "Home", to: "/" }, { label: "Blog", to: "/blog" }])} />
    <PageHeader eyebrow="Health blog" title="Notes from the field." subtitle="Practical, human, evidence-informed guides written by our care team." crumbs={[{ label: "Blog" }]} />
    <section className="container-lux pb-24">
      <div className="grid md:grid-cols-3 gap-5">
        {BLOG_POSTS.map((p) => (
          <article key={p.slug} className="group rounded-3xl overflow-hidden border border-border/70 bg-card/60 hover:shadow-lux transition-shadow">
            <div className="aspect-[4/3] overflow-hidden">
              <img src={p.img} alt={p.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="p-6">
              <div className="flex items-center gap-3 text-xs">
                <span className="overline text-accent">{p.tag}</span>
                <span className="text-muted-foreground flex items-center gap-1"><Clock size={12}/> {p.read}</span>
              </div>
              <h3 className="mt-3 font-serif text-2xl leading-tight">{p.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground font-light leading-relaxed">{p.excerpt}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  </Layout>
);

export default Blog;
