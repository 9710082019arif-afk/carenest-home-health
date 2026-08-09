// Verify redirect map integrity (no cycles, primary destinations exist, expected counts).
const {
  SERVICES,
  LOCATIONS,
  SERVICE_REDIRECTS,
  PAGE_REDIRECTS,
} = require("./seo-data");

const primary = new Set(SERVICES);
let failed = 0;

const fail = (msg) => {
  console.error("FAIL:", msg);
  failed += 1;
};

Object.entries(SERVICE_REDIRECTS).forEach(([from, to]) => {
  if (primary.has(from)) fail(`primary slug redirected: ${from}`);
  if (!primary.has(to)) fail(`redirect target not primary: ${from} → ${to}`);
  if (SERVICE_REDIRECTS[to]) fail(`redirect chain/cycle: ${from} → ${to} → ${SERVICE_REDIRECTS[to]}`);
});

if (!primary.has("patient-care")) fail("missing patient-care primary");
if (!primary.has("home-nursing")) fail("missing home-nursing primary");
if (!primary.has("elder-care")) fail("missing elder-care primary");
if (SERVICE_REDIRECTS["bedridden-patient-care"] !== "patient-care") {
  fail("bedridden-patient-care must 301 to patient-care");
}

const expectedServiceRedirects = Object.keys(SERVICE_REDIRECTS).length;
const expectedPageRedirects = Object.keys(PAGE_REDIRECTS).length;
const expectedCity = LOCATIONS.length * expectedServiceRedirects;
const expectedTotal = expectedPageRedirects + expectedServiceRedirects + expectedCity;

console.log("Primary services:", SERVICES.join(", "));
console.log("Page redirects:", expectedPageRedirects);
console.log("Service redirects:", expectedServiceRedirects);
console.log("City×service redirects:", expectedCity);
console.log("Total 301 rules:", expectedTotal);
console.log("Locations retained (SEO shells):", LOCATIONS.length);

if (expectedTotal !== 266) {
  // 6 page + 20 service + 12*20 city = 266
  console.warn(`Note: expected 266 historically; got ${expectedTotal}`);
}

if (failed) {
  console.error(`\n${failed} verification failure(s)`);
  process.exit(1);
}
console.log("\nRedirect map OK");
