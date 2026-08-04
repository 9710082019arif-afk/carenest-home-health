// Generate sitemap.xml from content data (run from frontend/)
// Usage: node scripts/generate-sitemap.js

const fs = require("fs");
const path = require("path");

// Kept in sync with src/data/content.js SERVICES/LOCATIONS slugs.
const SERVICES = [
  "home-nursing","caregiver-services","doctor-at-home","icu-at-home","physiotherapy-at-home",
  "medical-equipment-rental","bedridden-patient-care","stroke-rehabilitation","paralysis-care",
  "cancer-patient-care","palliative-care","mother-baby-care","dementia-care","alzheimer-care",
  "post-operative-care","tracheostomy-care","ventilator-support","injection-dressing",
  "attendant-services","elder-care","24x7-nursing-care","critical-care",
];
const LOCATIONS = [
  "pune","pimpri-chinchwad","mumbai","navi-mumbai","thane","bengaluru",
  "hyderabad","delhi-ncr","ranchi","bhubaneswar","kolkata","goa",
];

const SITE = "https://carenesthomehealth.in";
const today = new Date().toISOString().slice(0, 10);

const urls = [];
const add = (loc, priority, changefreq = "weekly") => {
  urls.push({ loc: loc === "/" ? `${SITE}/` : `${SITE}${loc}`, priority, changefreq, lastmod: today });
};

[
  ["/", "1.0"],
  ["/about", "0.8"],
  ["/services", "0.9"],
  ["/pricing", "0.8"],
  ["/locations", "0.9"],
  ["/book-appointment", "0.8"],
  ["/contact", "0.8"],
  ["/faq", "0.8"],
  ["/gallery", "0.6"],
  ["/testimonials", "0.7"],
  ["/blog", "0.7"],
  ["/careers", "0.6"],
  ["/privacy-policy", "0.3"],
  ["/terms", "0.3"],
  ["/refund-policy", "0.3"],
  ["/cancellation-policy", "0.3"],
].forEach(([p, pri]) => add(p, pri, p.includes("policy") || p === "/terms" ? "yearly" : "weekly"));

SERVICES.forEach((s) => add(`/services/${s}`, "0.9"));
LOCATIONS.forEach((l) => add(`/locations/${l}`, "0.9"));
LOCATIONS.forEach((l) => SERVICES.forEach((s) => add(`/locations/${l}/${s}`, "0.8")));

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) =>
      `  <url><loc>${u.loc}</loc><lastmod>${u.lastmod}</lastmod><changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority></url>`
  )
  .join("\n")}
</urlset>
`;

const out = path.join(__dirname, "..", "public", "sitemap.xml");
fs.writeFileSync(out, xml);
console.log(`Wrote ${urls.length} URLs to ${out}`);
