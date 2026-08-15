// Central data source for CareNest — simplified to 3 primary services (Pune-first).

export const COMPANY = {
  name: "CareNest Home Health",
  short: "CareNest",
  phone: "+91 9175724546",
  phoneDigits: "919175724546",
  whatsapp: "919175724546",
  email: "info@carenesthomehealth.in",
  website: "https://carenesthomehealth.in",
  tagline: "24 Hour Home Care in Pune & PCMC.",
  address: "Serving families in Pune and Pimpri-Chinchwad (PCMC)",
  socials: {
    instagram: "https://www.instagram.com/carenesthomehealth",
    facebook: "https://www.facebook.com/carenesthomehealth",
    linkedin: "https://www.linkedin.com/company/carenesthomehealth",
    youtube: "https://www.youtube.com/@carenesthomehealth",
  },
  logo: "/logo.svg",
  logoWordmark: "/logo-wordmark.svg",
};

/** Three primary services — only these appear in nav, homepage, and sitemap. */
export const SERVICES = [
  {
    slug: "home-nursing",
    name: "Nursing Care at Home",
    icon: "Stethoscope",
    tagline: "Skilled nursing with continuous support when needed.",
    short:
      "Wound care, injections, vitals monitoring and clinical nursing at home by trained RNs — including 24 Hour Home Care cover when continuous nursing support is required.",
    suitability:
      "Suitable for post-hospital recovery, wound care, injections, vitals monitoring, and families who need trained nursing support at home in Pune or PCMC.",
    includes:
      "Clinical nursing tasks, medication support as advised, vitals checks, and coordination with your care manager for continuous or day-based plans.",
    category: "nursing",
    rate: "₹2,800 – ₹3,000",
    rateUnit: "per day",
    rateNote: "24-hour skilled nursing; rate varies by patient condition",
    image: "/brand-kit/images/nursing-care.jpg",
  },
  {
    slug: "patient-care",
    name: "Patient Care at Home",
    icon: "HeartPulse",
    tagline: "Recovery support with continuous care options.",
    short:
      "Personalised 24 Hour Patient Care for bedridden support, post-op recovery, rehab coordination and day-to-day clinical assistance at home.",
    suitability:
      "Suitable for bedridden patients, post-operative recovery, and families who need reliable patient support at home in Pune or Pimpri-Chinchwad (PCMC).",
    includes:
      "Personal care assistance, mobility help, medication reminders, recovery support, and continuous care/support when a 24-hour plan is agreed.",
    category: "care",
    rate: "₹850 – ₹1,200",
    rateUnit: "per day",
    rateNote: "Trained attendant or skilled nurse depending on clinical need; 24-hour plans available",
    image: "/brand-kit/images/patient-care.jpg",
  },
  {
    slug: "elder-care",
    name: "Elder Care at Home",
    icon: "Users",
    tagline: "Companionship and continuous senior support.",
    short:
      "24 Hour Elder Care with daily living support and warm companionship — meals, mobility help, medication reminders and trusted presence at home.",
    suitability:
      "Suitable for seniors who need companionship, daily living help, medication reminders, or continuous overnight support in Pune and PCMC.",
    includes:
      "Daily living assistance, companionship, medication reminders, mobility support, and continuous care/support for families who need round-the-clock presence.",
    category: "care",
    rate: "₹850 – ₹900",
    rateUnit: "per day",
    rateNote: "24 Hour Elder Care plans; rate varies by support level",
    image: "/brand-kit/images/elder-care.jpg",
  },
];

/** Cities retained for lightweight SEO shells (not in main nav). Pune is primary. */
export const LOCATIONS = [
  { slug: "pune", name: "Pune", state: "Maharashtra", hero: "Pune", featured: true },
  { slug: "pimpri-chinchwad", name: "Pimpri-Chinchwad", state: "Maharashtra" },
  { slug: "mumbai", name: "Mumbai", state: "Maharashtra", featured: true },
  { slug: "navi-mumbai", name: "Navi Mumbai", state: "Maharashtra" },
  { slug: "thane", name: "Thane", state: "Maharashtra" },
  { slug: "bengaluru", name: "Bengaluru", state: "Karnataka", featured: true },
  { slug: "hyderabad", name: "Hyderabad", state: "Telangana", featured: true },
  { slug: "delhi-ncr", name: "Delhi NCR", state: "Delhi", featured: true },
  { slug: "ranchi", name: "Ranchi", state: "Jharkhand" },
  { slug: "bhubaneswar", name: "Bhubaneswar", state: "Odisha" },
  { slug: "kolkata", name: "Kolkata", state: "West Bengal" },
  { slug: "goa", name: "Goa", state: "Goa" },
];

export const FAQS = [
  {
    q: "How quickly can care begin in Pune?",
    a: "For most services we deploy within 4–8 hours of confirmation in Pune and Pimpri-Chinchwad (PCMC). Urgent cases are prioritised — call or WhatsApp us and a care coordinator will respond quickly.",
  },
  {
    q: "Are your nurses qualified?",
    a: "All our RNs are GNM or B.Sc Nursing qualified, background-verified, trained in home-care protocols and reviewed regularly.",
  },
  {
    q: "Which services do you offer?",
    a: "We focus on Patient Care at Home, Elder Care at Home, and Nursing Care at Home — including 24 Hour Home Care when continuous support is needed. Tell us the patient's needs and we'll recommend the right plan.",
  },
  {
    q: "How is pricing decided?",
    a: "We share a personalised plan after a free consult. Pricing depends on skill level, hours and clinical complexity. Indicative rates are shown on each service page.",
  },
  {
    q: "Do you provide overnight or continuous care?",
    a: "Yes. CareNest provides 24 Hour Home Care and continuous overnight support for patients and elders in Pune and PCMC, coordinated around the family's needs.",
  },
  {
    q: "Do you work with insurance?",
    a: "We provide detailed invoices and claim-ready documentation, and coordinate with most major insurers on cashless / reimbursement plans.",
  },
];

export const STATS = [
  { value: "12,400+", label: "Families cared for" },
  { value: "24×7", label: "Care coordination" },
  { value: "Pune & PCMC", label: "Primary service area" },
];

export const TEAM = [
  {
    name: "Riya Shaikh",
    role: "Founder & Managing Director",
    city: "Pune",
    img: "/brand-kit/team/riya-shaikh.svg",
    bio: "Riya founded CareNest Home Health to bring hospital-grade care into the warmth of the home — with dignity, punctuality and a genuinely human touch. She leads clinical partnerships, care standards and everyday operations.",
  },
];

export const WHY_CHOOSE = [
  {
    title: "Verified professionals",
    text: "Background-checked nurses and caregivers trained for home settings.",
  },
  {
    title: "Pune & PCMC focus",
    text: "Local care managers who know Pune and Pimpri-Chinchwad neighbourhoods and can deploy quickly.",
  },
  {
    title: "Clear communication",
    text: "Simple updates for families — call, WhatsApp or your care manager.",
  },
  {
    title: "24 Hour Home Care options",
    text: "Patient Care, Elder Care, or Nursing Care — including continuous care/support when your family needs it.",
  },
];

export const HOW_IT_WORKS = [
  {
    n: "01",
    t: "Enquire",
    d: "Call, WhatsApp or submit the form. Share the patient's condition and preferred timing.",
  },
  {
    n: "02",
    t: "Matched care plan",
    d: "We recommend Patient Care at Home, Elder Care at Home or Nursing Care at Home — including 24 Hour Home Care when continuous support is needed.",
  },
  {
    n: "03",
    t: "Care at home",
    d: "A verified professional arrives in Pune or PCMC — with ongoing coordination from your care manager.",
  },
];

export const IMAGES = {
  heroPrimary: "/brand-kit/social/hero-banner.jpg",
  nurseCare: "/brand-kit/images/nursing-care.jpg",
  patientCare: "/brand-kit/images/patient-care.jpg",
  elderCare: "/brand-kit/images/elder-care.jpg",
  doctorHome: "/brand-kit/images/doctor-visit.jpg",
};

export const TRUST_BADGES = [
  { label: "Background-verified staff" },
  { label: "Pune & PCMC deployment" },
  { label: "24 Hour Home Care options" },
];
