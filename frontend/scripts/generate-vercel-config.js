// Generate vercel.json — SEO 301s + SPA rewrite + preview noindex.
// Source of truth: seo-data.js (same as nginx redirects.map).
const fs = require("fs");
const path = require("path");
const { SERVICES, LOCATIONS, SERVICE_REDIRECTS, PAGE_REDIRECTS } = require("./seo-data");

const redirects = [];

Object.entries(PAGE_REDIRECTS).forEach(([from, to]) => {
  redirects.push({ source: from, destination: to, permanent: true });
});

Object.entries(SERVICE_REDIRECTS).forEach(([fromSlug, toSlug]) => {
  redirects.push({
    source: `/services/${fromSlug}`,
    destination: `/services/${toSlug}`,
    permanent: true,
  });
});

LOCATIONS.forEach((city) => {
  Object.entries(SERVICE_REDIRECTS).forEach(([fromSlug, toSlug]) => {
    redirects.push({
      source: `/locations/${city}/${fromSlug}`,
      destination: `/locations/${city}/${toSlug}`,
      permanent: true,
    });
  });
});

const config = {
  $schema: "https://openapi.vercel.sh/vercel.json",
  framework: "create-react-app",
  buildCommand: "yarn build",
  outputDirectory: "build",
  redirects,
  rewrites: [
    // SPA fallback — Vercel prefers /api serverless and static files over this.
    { source: "/((?!api/).*)", destination: "/index.html" },
  ],
  headers: [
    {
      source: "/(.*)",
      has: [{ type: "host", value: "(?<host>.*)\\.vercel\\.app" }],
      headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
    },
  ],
};

const out = path.join(__dirname, "..", "vercel.json");
fs.writeFileSync(out, `${JSON.stringify(config, null, 2)}\n`);

console.log(`Wrote ${redirects.length} redirects to ${out}`);
console.log(`Primary services retained: ${SERVICES.join(", ")}`);
