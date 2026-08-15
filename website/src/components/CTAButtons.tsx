"use client";

import Link from "next/link";
import { trackPhoneClick, trackWhatsAppClick } from "@/lib/analytics";
import { COMPANY, telHref, whatsappHref } from "@/data/company";

type Props = {
  location?: string;
  serviceName?: string;
  className?: string;
  showEnquire?: boolean;
};

export function CTAButtons({
  location = "unknown",
  serviceName,
  className = "",
  showEnquire = true,
}: Props) {
  const waMessage = serviceName
    ? `Hi CareNest, I would like to enquire about ${serviceName} in Pune.`
    : "Hi CareNest, I would like to enquire about home care in Pune.";

  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      <a
        href={telHref}
        className="btn btn-gold"
        onClick={() => trackPhoneClick(location)}
      >
        Call Now
      </a>
      <a
        href={whatsappHref(waMessage)}
        className="btn btn-whatsapp"
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackWhatsAppClick(location)}
      >
        WhatsApp
      </a>
      {showEnquire && (
        <Link href="/contact#enquiry" className="btn btn-outline">
          Enquire Now
        </Link>
      )}
    </div>
  );
}

export function MobileCTABar() {
  return (
    <div className="mobile-cta-bar" role="region" aria-label="Quick contact">
      <a
        href={telHref}
        className="btn btn-gold"
        onClick={() => trackPhoneClick("mobile-bar")}
      >
        Call
      </a>
      <a
        href={whatsappHref()}
        className="btn btn-whatsapp"
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackWhatsAppClick("mobile-bar")}
      >
        WhatsApp
      </a>
    </div>
  );
}

export function PhoneDisplay({ className = "" }: { className?: string }) {
  return (
    <p className={`phone-emphasis ${className}`}>
      <a href={telHref} onClick={() => trackPhoneClick("phone-display")}>
        {COMPANY.phoneDisplay}
      </a>
    </p>
  );
}
