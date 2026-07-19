import React from "react";
import * as Icons from "lucide-react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

const ServiceCard = ({ service, span = false }) => {
  const Icon = Icons[service.icon] || Icons.HeartPulse;
  return (
    <Link
      to={`/services/${service.slug}`}
      data-testid={`service-card-${service.slug}`}
      className={`group relative overflow-hidden rounded-3xl border border-border/70 bg-card/70 backdrop-blur-sm p-6 md:p-7 flex flex-col justify-between hover:-translate-y-1 hover:shadow-lux-hover shadow-lux transition-[transform,box-shadow] duration-300 ${span ? "md:col-span-2 md:row-span-2 min-h-[280px]" : "min-h-[220px]"}`}
    >
      <div className="flex items-start justify-between">
        <div className="h-11 w-11 rounded-2xl bg-primary/8 text-primary grid place-items-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
          <Icon size={20} />
        </div>
        <ArrowUpRight className="text-muted-foreground group-hover:text-primary group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" size={18} />
      </div>

      <div className="mt-8">
        <div className="overline text-accent">{service.category}</div>
        <h3 className="font-serif text-[22px] md:text-[24px] mt-2 leading-tight font-medium">{service.name}</h3>
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed line-clamp-3">{service.short}</p>
        {service.rate ? (
          <div className="mt-4 inline-flex items-baseline gap-1.5 rounded-full bg-accent/10 text-foreground px-3 py-1 border border-accent/30">
            <span className="text-[11px] text-muted-foreground uppercase tracking-wide">From</span>
            <span className="font-serif text-base font-medium">{service.rate}</span>
            <span className="text-[11px] text-muted-foreground">{service.rateUnit}</span>
          </div>
        ) : (
          <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-muted text-muted-foreground px-3 py-1 border border-border">
            <span className="text-[11px] uppercase tracking-wide">Personalised plan</span>
          </div>
        )}
      </div>
    </Link>
  );
};

export default ServiceCard;
