import Script from "next/script";
import { SITE } from "@/data/site";

/**
 * GA4 — Measurement ID is set in code with optional env override.
 * Avoids the old "missing REACT_APP_* env" production gap.
 * Do not send PII or health details (enforced in event helpers).
 */
export function Analytics() {
  const id = (process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || SITE.gaMeasurementId).trim();
  if (!id) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${id}', { anonymize_ip: true, send_page_view: true });
        `}
      </Script>
    </>
  );
}
