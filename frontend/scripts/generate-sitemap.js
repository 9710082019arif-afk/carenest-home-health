// Generate sitemap.xml — primary URLs only (redirected URLs omitted).
const fs = require("fs");
const path = require("path");
const { SERVICES, LOCATIONS, SITE } = require("./seo-data");

const today = new Date().toISOString().slice(0, 10);
const urls = [];
const add = (loc, priority, changefreq = "weekly") => {
  urls.push({
    loc: loc === "/" ? `${SITE}/` : `${SITE}${loc}`,
    priority,
    changefreq,
    lastmod: today,
  });
};

[
  ["/", "1.0"],
  ["/about", "0.8"],
  ["/services", "0.9"],
  ["/locations", "0.7"],
  ["/contact", "0.8"],
  ["/faq", "0.6"],
  ["/privacy-policy", "0.3"],
  ["/terms", "0.3"],
  ["/refund-policy", "0.3"],
  ["/cancellation-policy", "0.3"],
].forEach(([p, pri]) => add(p, pri, p.includes("policy") || p === "/terms" ? "yearly" : "weekly"));

SERVICES.forEach((s) => add(`/services/${s}`, "0.9"));
LOCATIONS.forEach((l) => add(`/locations/${l}`, l === "pune" ? "0.9" : "0.6", "monthly"));
LOCATIONS.forEach((l) =>
  SERVICES.forEach((s) => add(`/locations/${l}/${s}`, l === "pune" ? "0.8" : "0.5", "monthly"))
);

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
