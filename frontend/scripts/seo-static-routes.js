// Shared static SEO route metadata for bootstrap + prerender.
// Keep in sync with src/lib/seo.js PAGE_SEO for key indexable hubs.

const SITE = "https://carenesthomehealth.in";

const ROUTES = [
  {
    path: "/",
    file: "index.html",
    title: "CareNest Home Health · Premium Home Healthcare Services",
    description:
      "CareNest Home Health delivers premium home nursing, doctor-at-home, ICU-at-home, physiotherapy, caregivers and elder care across 12 Indian cities. 24×7 professional support at your doorstep.",
    canonical: `${SITE}/`,
    h1: "Professional home healthcare, delivered.",
  },
  {
    path: "/locations",
    file: "locations/index.html",
    title: "Home Healthcare Locations Across India · CareNest Home Health",
    description:
      "CareNest Home Health serves Pune, Mumbai, Bengaluru, Hyderabad, Delhi NCR, Kolkata, Goa and more. Find local home nursing, ICU-at-home and elder care in your city.",
    canonical: `${SITE}/locations`,
    h1: "Home healthcare across 12 Indian cities",
    keywords:
      "home healthcare near me, home nursing Pune, home care Mumbai, elder care Bengaluru, CareNest locations",
    bodyHtml: `
<section id="seo-locations-hub" style="max-width:960px;margin:2rem auto;padding:1.5rem;font-family:system-ui,sans-serif;line-height:1.55;color:#0D3B66">
  <p><a href="/">CareNest Home Health</a> · Locations</p>
  <h1>Home healthcare across 12 Indian cities</h1>
  <p>CareNest Home Health provides premium home nursing, ICU-at-home, doctor visits, physiotherapy, caregivers and elder care with local care managers and same-day deployment.</p>
  <h2>Cities we serve</h2>
  <ul>
    <li><a href="/locations/pune">Home healthcare in Pune</a></li>
    <li><a href="/locations/mumbai">Home healthcare in Mumbai</a></li>
    <li><a href="/locations/navi-mumbai">Home healthcare in Navi Mumbai</a></li>
    <li><a href="/locations/thane">Home healthcare in Thane</a></li>
    <li><a href="/locations/pimpri-chinchwad">Home healthcare in Pimpri-Chinchwad</a></li>
    <li><a href="/locations/bengaluru">Home healthcare in Bengaluru</a></li>
    <li><a href="/locations/hyderabad">Home healthcare in Hyderabad</a></li>
    <li><a href="/locations/delhi-ncr">Home healthcare in Delhi NCR</a></li>
    <li><a href="/locations/kolkata">Home healthcare in Kolkata</a></li>
    <li><a href="/locations/bhubaneswar">Home healthcare in Bhubaneswar</a></li>
    <li><a href="/locations/ranchi">Home healthcare in Ranchi</a></li>
    <li><a href="/locations/goa">Home healthcare in Goa</a></li>
  </ul>
  <p>Call <a href="tel:+919175724546">+91 9175724546</a> or <a href="/book-appointment">book an appointment</a>.</p>
</section>`,
  },
  {
    path: "/services",
    file: "services/index.html",
    title: "Home Healthcare Services — Nursing, ICU, Physio & More · CareNest Home Health",
    description:
      "Explore 22 CareNest home healthcare services: home nursing, ICU-at-home, doctor visits, physiotherapy, elder care, palliative care, equipment rental and more across India.",
    canonical: `${SITE}/services`,
    h1: "Twenty-two services, one team.",
  },
  {
    path: "/about",
    file: "about/index.html",
    title: "About CareNest Home Health · CareNest Home Health",
    description:
      "Founded by Riya Shaikh, CareNest Home Health brings hospital-grade nursing, physicians and caregivers into Indian homes — with dignity, punctuality and a dedicated care manager per family.",
    canonical: `${SITE}/about`,
    h1: "A promise: to bring the hospital home — humanely.",
  },
  {
    path: "/contact",
    file: "contact/index.html",
    title: "Contact CareNest Home Health · CareNest Home Health",
    description:
      "Call, WhatsApp or email CareNest Home Health 24×7. Reach our care coordinators for home nursing, ICU setup, physiotherapy and elder care across India.",
    canonical: `${SITE}/contact`,
    h1: "A care coordinator is one call away.",
  },
  {
    path: "/faq",
    file: "faq/index.html",
    title: "Home Healthcare FAQ — CareNest Answers · CareNest Home Health",
    description:
      "Answers to common questions about CareNest home nursing, pricing, insurance, emergencies, nurse qualifications and same-day deployment across India.",
    canonical: `${SITE}/faq`,
    h1: "Answers, honestly.",
  },
];

module.exports = { SITE, ROUTES };
