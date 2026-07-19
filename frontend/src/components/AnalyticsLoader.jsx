import { useEffect } from "react";
import { API_BASE } from "@/lib/api";

// Injects GA4 / GTM / Meta Pixel scripts once, when IDs are provided by /api/config/public.
const injectScript = (id, src, inline) => {
  if (document.getElementById(id)) return;
  const s = document.createElement("script");
  s.id = id; s.async = true;
  if (src) s.src = src;
  if (inline) s.text = inline;
  document.head.appendChild(s);
};

const AnalyticsLoader = () => {
  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(`${API_BASE}/config/public`);
        const c = await r.json();

        if (c.ga_id) {
          injectScript("ga4-lib", `https://www.googletagmanager.com/gtag/js?id=${c.ga_id}`);
          injectScript("ga4-init", null,
            `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config','${c.ga_id}');`);
        }
        if (c.gtm_id) {
          injectScript("gtm", null,
            `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${c.gtm_id}');`);
        }
        if (c.meta_pixel_id) {
          injectScript("fbp", null,
            `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${c.meta_pixel_id}');fbq('track','PageView');`);
        }
      } catch (err) {
        // Silent-in-production, but log for developer visibility so analytics failures aren't invisible.
        // eslint-disable-next-line no-console
        console.error("AnalyticsLoader: failed to load config", err);
      }
    })();
  }, []);
  return null;
};

export default AnalyticsLoader;
