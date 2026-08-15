// Shared static SEO route metadata for bootstrap + prerender.
// Titles must match PAGE_SEO / buildPageSeo output (brand already included where needed).
const SITE = "https://carenesthomehealth.in";

const ROUTES = [
  {
    path: "/",
    file: "index.html",
    title: "24 Hour Home Care in Pune & PCMC · CareNest Home Health",
    description:
      "What is 24 Hour Home Care? Continuous care at home in Pune and PCMC, arranged with Patient Care, Elder Care or Nursing Care. Call or WhatsApp CareNest for a free consult.",
    canonical: `${SITE}/`,
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
  <p>Call <a href="tel:+919175724546">+91 9175724546</a> or <a href="/contact">contact us</a>.</p>
</section>`,
  },
  {
    path: "/services",
    file: "services/index.html",
    title: "Home Healthcare Services — Nursing, Patient & Elder Care · CareNest Home Health",
    description:
      "Explore CareNest’s three primary services: Patient Care at Home, Elder Care at Home, and Nursing Care at Home in Pune and PCMC, including 24 Hour Home Care options.",
    canonical: `${SITE}/services`,
    h1: "Three primary care services.",
  },
  {
    path: "/about",
    file: "about/index.html",
    title: "About CareNest Home Health",
    description:
      "Founded by Riya Shaikh, CareNest brings Patient Care at Home, Elder Care at Home and Nursing Care at Home to families in Pune and PCMC — with dignity and clear coordination.",
    canonical: `${SITE}/about`,
    h1: "CareNest brings skilled care into the home.",
  },
  {
    path: "/contact",
    file: "contact/index.html",
    title: "Contact CareNest Home Health",
    description:
      "Call, WhatsApp or message CareNest for Patient Care at Home, Elder Care at Home and Nursing Care at Home in Pune and PCMC.",
    canonical: `${SITE}/contact`,
    h1: "A care coordinator is one call away.",
  },
  {
    path: "/faq",
    file: "faq/index.html",
    title: "Home Healthcare FAQ · CareNest Home Health",
    description:
      "Answers about CareNest nursing, patient care, elder care, 24 Hour Home Care and how care starts in Pune and PCMC.",
    canonical: `${SITE}/faq`,
    h1: "Common questions.",
  },
];

module.exports = { SITE, ROUTES };
