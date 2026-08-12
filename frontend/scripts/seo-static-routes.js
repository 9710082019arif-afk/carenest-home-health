// Shared static SEO route metadata for bootstrap + prerender.
const SITE = "https://carenesthomehealth.in";

const ROUTES = [
  {
    path: "/",
    file: "index.html",
    title: "Care at Home in Pune · CareNest Home Health",
    description:
      "CareNest Home Health provides Nursing Care, Patient Care, and Elder Care at home in Pune. Call or WhatsApp for a free care consult.",
    canonical: `${SITE}/`,
    h1: "Care at Home in Pune",
  },
  {
    path: "/locations",
    file: "locations/index.html",
    title: "CareNest Locations — Pune Primary · CareNest Home Health",
    description:
      "Pune is CareNest’s primary service area. Browse city pages for Nursing Care, Patient Care and Elder Care enquiries.",
    canonical: `${SITE}/locations`,
    h1: "Care at home — Pune first.",
    keywords: "home healthcare Pune, home nursing Pune, elder care Pune, CareNest locations",
    bodyHtml: `
<section id="seo-locations-hub" style="max-width:960px;margin:2rem auto;padding:1.5rem;font-family:system-ui,sans-serif;line-height:1.55;color:#0D3B66">
  <p><a href="/">CareNest Home Health</a> · Locations</p>
  <h1>Care at home — Pune first</h1>
  <p>CareNest focuses on Nursing Care, Patient Care and Elder Care &amp; Companionship in Pune. Other city pages remain for enquiries.</p>
  <h2>Cities</h2>
  <ul>
    <li><a href="/locations/pune">Home healthcare in Pune</a> (primary)</li>
    <li><a href="/locations/mumbai">Home healthcare in Mumbai</a></li>
    <li><a href="/locations/pimpri-chinchwad">Home healthcare in Pimpri-Chinchwad</a></li>
  </ul>
  <p>Call <a href="tel:+919175724546">+91 9175724546</a> or <a href="/contact">contact us</a>.</p>
</section>`,
  },
  {
    path: "/services",
    file: "services/index.html",
    title: "Home Healthcare Services — Nursing, Patient & Elder Care · CareNest Home Health",
    description:
      "Explore CareNest’s three primary services: Nursing Care, Patient Care, and Elder Care at home in Pune.",
    canonical: `${SITE}/services`,
    h1: "Three primary care services.",
  },
  {
    path: "/about",
    file: "about/index.html",
    title: "About CareNest Home Health · CareNest Home Health",
    description:
      "Founded by Riya Shaikh, CareNest brings Nursing Care, Patient Care and Elder Care into homes — with dignity and clear coordination in Pune.",
    canonical: `${SITE}/about`,
    h1: "CareNest brings skilled care into the home.",
  },
  {
    path: "/contact",
    file: "contact/index.html",
    title: "Contact CareNest Home Health · CareNest Home Health",
    description:
      "Call, WhatsApp or message CareNest for Nursing Care, Patient Care and Elder Care in Pune.",
    canonical: `${SITE}/contact`,
    h1: "A care coordinator is one call away.",
  },
  {
    path: "/faq",
    file: "faq/index.html",
    title: "Home Healthcare FAQ · CareNest Home Health",
    description:
      "Answers about CareNest nursing, patient care, elder companionship, pricing and how care starts in Pune.",
    canonical: `${SITE}/faq`,
    h1: "Common questions.",
  },
];

module.exports = { SITE, ROUTES };
