import { useEffect } from "react";
import { API_BASE } from "@/lib/api";

// Build-time fallbacks (CRA inlines REACT_APP_* at build). Useful when Emergent
// production secrets for backend GA_* keys are stuck empty but frontend env is set.
const BUILD_GA_ID = (process.env.REACT_APP_GA_MEASUREMENT_ID || "").trim();
const BUILD_GTM_ID = (process.env.REACT_APP_GTM_ID || "").trim();
const BUILD_META_PIXEL_ID = (process.env.REACT_APP_META_PIXEL_ID || "").trim();

// Injects GA4 / GTM / Meta Pixel scripts once, when IDs are provided by
// /api/config/public (preferred) or REACT_APP_* build-time env (fallback).
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
      let gaId = BUILD_GA_ID;
      let gtmId = BUILD_GTM_ID;
      let metaPixelId = BUILD_META_PIXEL_ID;

      try {
        const r = await fetch(`${API_BASE}/config/public`);
        if (r.ok) {
          const c = await r.json();
          gaId = (c.ga_id || gaId || "").trim();
          gtmId = (c.gtm_id || gtmId || "").trim();
          metaPixelId = (c.meta_pixel_id || metaPixelId || "").trim();
        }
      } catch (err) {
        // Silent-in-production, but log for developer visibility so analytics failures aren't invisible.
        // eslint-disable-next-line no-console
        console.error("AnalyticsLoader: failed to load config", err);
      }

      if (gaId) {
        injectScript("ga4-lib", `https://www.googletagmanager.com/gtag/js?id=${gaId}`);
        injectScript("ga4-init", null,
          `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config','${gaId}');`);
      }
      if (gtmId) {
        injectScript("gtm", null,
          `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`);
      }
      if (metaPixelId) {
        injectScript("fbp", null,
          `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${metaPixelId}');fbq('track','PageView');`);
      }
    })();
  }, []);
  return null;
};

export default AnalyticsLoader;
