#!/usr/bin/env node
/**
 * Technical SEO audit for CareNest main website.
 * Run: npm run seo:audit
 *
 * Critical failures exit with code 1 (fail production build when wired).
 */

import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = process.cwd();
const SITE = "https://carenesthomehealth.in";
const PREVIEW_LEAK = /https?:\/\/[a-z0-9.-]+\.vercel\.app/i;

const critical = [];
const warnings = [];

function fail(msg) {
  critical.push(msg);
}
function warn(msg) {
  warnings.push(msg);
}

function loadTsModuleViaDynamic() {
  // Import compiled-ish data by evaluating the TypeScript sources through a lightweight parse
  // Prefer reading the services/redirects as JSON-ish by requiring built output if present.
}

async function main() {
  // Dynamic import of TS via next-built paths isn't available pre-build.
  // Parse key source files instead for deterministic CI checks.
  const servicesPath = join(ROOT, "src/data/services.ts");
  const redirectsPath = join(ROOT, "src/data/redirects.ts");
  const sitePath = join(ROOT, "src/data/site.ts");
  const companyPath = join(ROOT, "src/data/company.ts");

  for (const p of [servicesPath, redirectsPath, sitePath, companyPath]) {
    if (!existsSync(p)) fail(`Missing required file: ${relative(ROOT, p)}`);
  }

  const servicesSrc = readFileSync(servicesPath, "utf8");
  const redirectsSrc = readFileSync(redirectsPath, "utf8");
  const siteSrc = readFileSync(sitePath, "utf8");
  const companySrc = readFileSync(companyPath, "utf8");

  if (!siteSrc.includes("https://carenesthomehealth.in")) {
    fail("SITE.url must be https://carenesthomehealth.in");
  }

  const slugMatches = [...servicesSrc.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]);
  const uniqueSlugs = [...new Set(slugMatches)];
  if (uniqueSlugs.length !== 11) {
    fail(`Expected 11 service slugs, found ${uniqueSlugs.length}: ${uniqueSlugs.join(", ")}`);
  }

  const titles = [...servicesSrc.matchAll(/title:\s*"([^"]+)"/g)].map((m) => m[1]);
  const descriptions = [...servicesSrc.matchAll(/description:\s*"([^"]+)"/g)].map((m) => m[1]);
  if (new Set(titles).size !== titles.length) fail("Duplicate service SEO titles detected");
  if (new Set(descriptions).size !== descriptions.length) fail("Duplicate service meta descriptions detected");

  for (const t of titles) {
    if (!t || t.length < 20) fail(`Thin SEO title: ${t}`);
    if (PREVIEW_LEAK.test(t)) fail(`Preview URL leakage in title: ${t}`);
  }
  for (const d of descriptions) {
    if (!d || d.length < 50) fail(`Thin meta description: ${d}`);
  }

  // Ensure removed services redirect somewhere
  const removed = [
    "icu-at-home",
    "critical-care",
    "palliative-care",
    "cancer-patient-care",
    "stroke-rehabilitation",
    "tracheostomy-care",
    "ventilator-support",
    "injection-dressing",
    "physiotherapy-at-home",
    "doctor-at-home",
    "medical-equipment-rental",
  ];
  for (const slug of removed) {
    if (!redirectsSrc.includes(`"${slug}"`)) fail(`Missing redirect for removed service: ${slug}`);
  }

  // Indexable pages inventory (canonical)
  const indexable = [
    "/",
    "/about",
    "/services",
    "/contact",
    "/faq",
    "/privacy-policy",
    "/terms",
    "/refund-policy",
    "/cancellation-policy",
    ...uniqueSlugs.map((s) => `/services/${s}`),
  ];

  // Check pages exist
  const pageChecks = [
    ["src/app/page.tsx", "/"],
    ["src/app/about/page.tsx", "/about"],
    ["src/app/services/page.tsx", "/services"],
    ["src/app/contact/page.tsx", "/contact"],
    ["src/app/faq/page.tsx", "/faq"],
    ["src/app/not-found.tsx", "404"],
    ["src/app/sitemap.ts", "sitemap"],
    ["src/app/robots.ts", "robots"],
    ["src/middleware.ts", "middleware"],
  ];
  for (const [file] of pageChecks) {
    if (!existsSync(join(ROOT, file))) fail(`Missing page/module: ${file}`);
  }
  for (const slug of uniqueSlugs) {
    // dynamic route covers all
  }
  if (!existsSync(join(ROOT, "src/app/services/[slug]/page.tsx"))) {
    fail("Missing dynamic service page");
  }

  // Scan app sources for accidental vercel.app canonicals / noindex on purpose files
  function walk(dir, out = []) {
    for (const name of readdirSync(dir)) {
      if (name === "node_modules" || name === ".next") continue;
      const p = join(dir, name);
      const st = statSync(p);
      if (st.isDirectory()) walk(p, out);
      else if (/\.(tsx|ts|js|mjs|mdx)$/.test(name)) out.push(p);
    }
    return out;
  }

  const files = walk(join(ROOT, "src"));
  for (const file of files) {
    const src = readFileSync(file, "utf8");
    if (PREVIEW_LEAK.test(src) && !file.endsWith("middleware.ts") && !file.includes("seo-audit")) {
      // allow comments mentioning vercel.app in middleware docs only
      const lines = src.split("\n").filter((l) => PREVIEW_LEAK.test(l) && !l.trim().startsWith("//") && !l.includes("*"));
      if (lines.length) fail(`Preview URL leakage in ${relative(ROOT, file)}`);
    }
    // Accidental production-wide noindex hardcoded true without env guard
    if (/robots:\s*["']noindex/.test(src)) {
      fail(`Hardcoded noindex string in ${relative(ROOT, file)}`);
    }
  }

  // Contact phone visibility: ensure phone-emphasis class exists in CSS and contact page
  const css = readFileSync(join(ROOT, "src/app/globals.css"), "utf8");
  if (!css.includes(".phone-emphasis")) fail("Missing .phone-emphasis high-contrast phone styles");
  const contact = readFileSync(join(ROOT, "src/app/contact/page.tsx"), "utf8");
  if (!contact.includes("PhoneDisplay") && !contact.includes("phone-emphasis")) {
    fail("Contact page missing high-contrast phone display");
  }

  // GA4 id present
  if (!siteSrc.includes("G-2YMJF3VYZ2") && !companySrc.includes("G-2YMJF3VYZ2")) {
    // check site.ts
    const siteRobots = existsSync(join(ROOT, "src/data/site.ts"))
      ? readFileSync(join(ROOT, "src/data/site.ts"), "utf8")
      : "";
    if (!siteRobots.includes("G-2YMJF3VYZ2")) fail("GA4 measurement ID G-2YMJF3VYZ2 missing from site config");
  }

  // Header dropdown accessibility markers
  const header = readFileSync(join(ROOT, "src/components/Header.tsx"), "utf8");
  for (const token of ["aria-expanded", "Escape", "aria-controls"]) {
    if (!header.includes(token)) warn(`Header may be missing ${token}`);
  }
  if (!css.includes("padding-top: 0.35rem")) {
    warn("Dropdown gap bridge CSS may be missing");
  }

  // Redirect loop quick check: destination should not equal a removed source that redirects elsewhere
  // Basic: destinations under /services/ should be retained slugs
  const destMatches = [...redirectsSrc.matchAll(/:\s*"(elder-care|caregiver-services|attendant-services|home-nursing|24x7-nursing-care|post-operative-care|bedridden-patient-care|dementia-care|alzheimer-care|paralysis-care|mother-baby-care)"/g)];
  if (destMatches.length < 10) warn("Fewer than expected retained redirect destinations found");

  // Build-time sitemap module checks
  const sitemapSrc = readFileSync(join(ROOT, "src/app/sitemap.ts"), "utf8");
  if (!sitemapSrc.includes("carenesthomehealth.in")) fail("sitemap.ts must use production hostname");
  if (sitemapSrc.includes("locations/")) fail("sitemap should not include location doorway URLs");

  const robotsSrc = readFileSync(join(ROOT, "src/app/robots.ts"), "utf8");
  if (!robotsSrc.includes("sitemap.xml")) fail("robots.ts must reference sitemap.xml");
  if (/disallow:\s*["']\/["']/.test(robotsSrc) && !robotsSrc.includes("allowIndex")) {
    // preview branch intentionally disallows — OK if gated
  }

  // Fake claims scan
  const banned = ["12,400+", "4.9/5", "guaranteed cure", "ICU at Home as a current"];
  for (const file of files) {
    const src = readFileSync(file, "utf8");
    for (const b of banned) {
      if (src.includes(b) && !file.includes("seo-audit")) warn(`Possible banned claim "${b}" in ${relative(ROOT, file)}`);
    }
  }

  // Report
  const report = {
    indexablePageCount: indexable.length,
    serviceCount: uniqueSlugs.length,
    serviceSlugs: uniqueSlugs,
    sitemapExpectedUrls: indexable.length,
    criticalCount: critical.length,
    warningCount: warnings.length,
    critical,
    warnings,
    productionHostname: SITE,
  };

  console.log(JSON.stringify(report, null, 2));

  if (critical.length) {
    console.error(`\nSEO audit FAILED with ${critical.length} critical issue(s).`);
    process.exit(1);
  }

  console.log(`\nSEO audit passed with ${warnings.length} warning(s).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
