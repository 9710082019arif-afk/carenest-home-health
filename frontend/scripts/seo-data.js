// Shared SEO + redirect data for Node scripts (CommonJS).
// Keep in sync with src/data/content.js and src/data/redirects.js

const SERVICES = ["home-nursing", "patient-care", "elder-care"];

const LOCATIONS = [
  "pune",
  "pimpri-chinchwad",
  "mumbai",
  "navi-mumbai",
  "thane",
  "bengaluru",
  "hyderabad",
  "delhi-ncr",
  "ranchi",
  "bhubaneswar",
  "kolkata",
  "goa",
];

/** old service slug → primary slug */
const SERVICE_REDIRECTS = {
  "24x7-nursing-care": "home-nursing",
  "injection-dressing": "home-nursing",
  "post-operative-care": "home-nursing",
  "tracheostomy-care": "home-nursing",
  "ventilator-support": "home-nursing",
  "icu-at-home": "home-nursing",
  "critical-care": "home-nursing",
  "bedridden-patient-care": "patient-care",
  "cancer-patient-care": "patient-care",
  "palliative-care": "patient-care",
  "stroke-rehabilitation": "patient-care",
  "paralysis-care": "patient-care",
  "physiotherapy-at-home": "patient-care",
  "doctor-at-home": "patient-care",
  "medical-equipment-rental": "patient-care",
  "caregiver-services": "elder-care",
  "attendant-services": "elder-care",
  "dementia-care": "elder-care",
  "alzheimer-care": "elder-care",
  "mother-baby-care": "elder-care",
};

const PAGE_REDIRECTS = {
  "/pricing": "/services",
  "/book-appointment": "/contact",
  "/gallery": "/",
  "/testimonials": "/",
  "/blog": "/",
  "/careers": "/about",
};

const SITE = "https://carenesthomehealth.in";

module.exports = {
  SERVICES,
  LOCATIONS,
  SERVICE_REDIRECTS,
  PAGE_REDIRECTS,
  SITE,
};
