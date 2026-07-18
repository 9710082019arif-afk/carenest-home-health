import React from "react";
import { Link } from "react-router-dom";

const PageHeader = ({ eyebrow, title, subtitle, image, imageAlt, crumbs = [] }) => (
  <section className="relative overflow-hidden">
    <div className="absolute inset-0 -z-10">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary/5" />
      <div className="absolute -top-40 -right-40 h-[520px] w-[520px] rounded-full bg-secondary/10 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 h-[520px] w-[520px] rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute inset-0 noise opacity-30" />
    </div>
    <div className="container-lux pt-6 pb-14 md:pb-20">
      <nav className="text-xs text-muted-foreground flex items-center gap-1.5 flex-wrap">
        <Link to="/" className="hover:text-primary">Home</Link>
        {crumbs.map((c, i) => (
          <React.Fragment key={i}>
            <span>·</span>
            {c.to ? <Link to={c.to} className="hover:text-primary">{c.label}</Link> : <span className="text-foreground">{c.label}</span>}
          </React.Fragment>
        ))}
      </nav>
      <div className="mt-6 grid lg:grid-cols-12 gap-10 items-end">
        <div className="lg:col-span-8">
          {eyebrow && <div className="overline text-accent">{eyebrow}</div>}
          <h1 className="font-serif text-4xl md:text-5xl lg:text-[64px] tracking-tight leading-[1.03] mt-3 font-medium">
            {title}
          </h1>
          {subtitle && <p className="mt-5 max-w-2xl text-lg text-muted-foreground font-light leading-relaxed">{subtitle}</p>}
        </div>
        {image && (
          <div className="lg:col-span-4">
            <div className="rounded-3xl overflow-hidden aspect-[4/3] shadow-lux">
              <img src={image} alt={imageAlt || (typeof title === "string" ? title : "Java Home Health Care")} className="h-full w-full object-cover" />
            </div>
          </div>
        )}
      </div>
    </div>
  </section>
);

export default PageHeader;
