// Shared static SEO route metadata for bootstrap + prerender.
// Preferred host is www (matches apex→www redirect, canonicals, sitemap, schema).
const SITE = "https://www.carenesthomehealth.in";

const PRIMARY = { pune: true, "pimpri-chinchwad": true };
const SERVICES = {
  "home-nursing": "Nursing Care at Home",
  "patient-care": "Patient Care at Home",
  "elder-care": "Elder Care at Home",
};
const CITIES = {
  pune: "Pune",
  "pimpri-chinchwad": "Pimpri-Chinchwad",
  mumbai: "Mumbai",
  "navi-mumbai": "Navi Mumbai",
  thane: "Thane",
  bengaluru: "Bengaluru",
  hyderabad: "Hyderabad",
  "delhi-ncr": "Delhi NCR",
  ranchi: "Ranchi",
  bhubaneswar: "Bhubaneswar",
  kolkata: "Kolkata",
  goa: "Goa",
};

const base = [
  {
    path: "/",
    file: "index.html",
    title: "24 Hour Home Care in Pune & PCMC · CareNest Home Health",
    description:
      "24 Hour Home Care in Pune and PCMC with Patient Care, Elder Care and Nursing Care at home. Call or WhatsApp CareNest for a free consult.",
    canonical: `${SITE}/`,
    robots: "index,follow",
    h1: "24 Hour Home Care in Pune",
    keywords: "24 hour home care Pune, 24 hour home care PCMC, patient care at home Pune, elder care at home Pune, nursing care at home Pune, CareNest Home Health",
  },
  {
    path: "/locations",
    file: "locations/index.html",
    title: "CareNest Locations — Pune Primary · CareNest Home Health",
    description:
      "Pune and Pimpri-Chinchwad (PCMC) are CareNest’s primary service areas. Browse city pages for Patient Care at Home, Elder Care at Home and Nursing Care at Home enquiries.",
    canonical: `${SITE}/locations`,
    robots: "index,follow",
    h1: "Care at home — Pune first.",
    keywords: "home healthcare Pune, home nursing Pune, elder care Pune, PCMC home care, CareNest locations",
    bodyHtml: `
<section id="seo-locations-hub" style="max-width:960px;margin:2rem auto;padding:1.5rem;font-family:system-ui,sans-serif;line-height:1.55;color:#0D3B66">
  <p><a href="/">CareNest Home Health</a> · Locations</p>
  <h1>Care at home — Pune first</h1>
  <p>CareNest focuses on Patient Care at Home, Elder Care at Home and Nursing Care at Home in Pune and Pimpri-Chinchwad (PCMC), including 24 Hour Home Care options. Other city pages remain for enquiries.</p>
  <h2>Cities</h2>
  <ul>
    <li><a href="/locations/pune">Home healthcare in Pune</a> (primary)</li>
    <li><a href="/locations/pimpri-chinchwad">Home healthcare in Pimpri-Chinchwad (PCMC)</a></li>
    <li><a href="/locations/mumbai">Home healthcare in Mumbai</a></li>
  </ul>
  <p>Call <a href="tel:+919325702704">+91 9325702704</a> or <a href="/contact">contact us</a>.</p>
</section>`,
  },
  {
    path: "/services",
    file: "services/index.html",
    title: "Home Healthcare Services — Nursing, Patient & Elder Care · CareNest Home Health",
    description:
      "Explore CareNest’s three primary services: Patient Care at Home, Elder Care at Home, and Nursing Care at Home in Pune and PCMC, including 24 Hour Home Care options.",
    canonical: `${SITE}/services`,
    robots: "index,follow",
    h1: "Three primary care services.",
  },
  {
    path: "/about",
    file: "about/index.html",
    title: "About CareNest Home Health",
    description:
      "Founded by Riya Shaikh, CareNest brings Patient Care at Home, Elder Care at Home and Nursing Care at Home to families in Pune and PCMC — with dignity and clear coordination.",
    canonical: `${SITE}/about`,
    robots: "index,follow",
    h1: "CareNest brings skilled care into the home.",
  },
  {
    path: "/contact",
    file: "contact/index.html",
    title: "Contact CareNest Home Health",
    description:
      "Call, WhatsApp or message CareNest for Patient Care at Home, Elder Care at Home and Nursing Care at Home in Pune and PCMC.",
    canonical: `${SITE}/contact`,
    robots: "index,follow",
    h1: "A care coordinator is one call away.",
  },
  {
    path: "/faq",
    file: "faq/index.html",
    title: "Home Healthcare FAQ · CareNest Home Health",
    description:
      "Answers about CareNest nursing, patient care, elder care, 24 Hour Home Care and how care starts in Pune and PCMC.",
    canonical: `${SITE}/faq`,
    robots: "index,follow",
    h1: "Common questions.",
  },
];

const serviceRoutes = Object.entries(SERVICES).map(([slug, name]) => ({
  path: `/services/${slug}`,
  file: `services/${slug}/index.html`,
  title: `${name} in Pune · CareNest Home Health`,
  description: `${name} in Pune and PCMC by CareNest. Call or WhatsApp CareNest for a free consult.`,
  canonical: `${SITE}/services/${slug}`,
  robots: "index,follow",
  h1: name,
  bodyHtml: `
<section id="seo-${slug}" style="max-width:960px;margin:2rem auto;padding:1.5rem;font-family:system-ui,sans-serif;line-height:1.55;color:#0D3B66">
  <p><a href="/">CareNest Home Health</a> · <a href="/services">Services</a></p>
  <h1>${name}</h1>
  <p>${name} for families in Pune and Pimpri-Chinchwad (PCMC). Call or WhatsApp CareNest for a free consult.</p>
  <p><a href="/locations/pune/${slug}">${name} in Pune</a> · <a href="/locations/pimpri-chinchwad/${slug}">${name} in Pimpri-Chinchwad</a></p>
  <p>Call <a href="tel:+919325702704">+91 9325702704</a> or <a href="https://wa.me/919325702704">WhatsApp CareNest</a>.</p>
</section>`,
}));

const locationRoutes = Object.entries(CITIES).map(([slug, name]) => {
  const robots = PRIMARY[slug] ? "index,follow" : "noindex,follow";
  return {
    path: `/locations/${slug}`,
    file: `locations/${slug}/index.html`,
    title: `Home Healthcare in ${name} · CareNest Home Health`,
    description: `Home healthcare in ${name} — Patient Care, Elder Care and Nursing Care at home. Call or WhatsApp CareNest for a free consult.`,
    canonical: `${SITE}/locations/${slug}`,
    robots,
    h1: `Home Healthcare in ${name}`,
    bodyHtml: `
<section id="seo-loc-${slug}" style="max-width:960px;margin:2rem auto;padding:1.5rem;font-family:system-ui,sans-serif;line-height:1.55;color:#0D3B66">
  <p><a href="/">CareNest Home Health</a> · <a href="/locations">Locations</a></p>
  <h1>Home Healthcare in ${name}</h1>
  <p>Patient Care at Home, Elder Care at Home and Nursing Care at Home. Call or WhatsApp CareNest for a free consult.</p>
  <p>Call <a href="tel:+919325702704">+91 9325702704</a> or <a href="https://wa.me/919325702704">WhatsApp CareNest</a>.</p>
</section>`,
  };
});

const ROUTES = [...base, ...serviceRoutes, ...locationRoutes];

module.exports = { SITE, ROUTES };
