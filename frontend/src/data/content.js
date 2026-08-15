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
    tagline: "Clinical nursing by trained RNs at home.",
    short:
      "Nursing Care at Home is clinical nursing delivered by trained registered nurses — wound care, injections, vitals monitoring and medication support as advised — with continuous nursing cover available when needed.",
    differentiation:
      "Choose Nursing Care when the patient needs clinical nursing skills (for example injections, wound care or vitals monitoring by an RN). It is different from Elder Care companionship or general Patient Care attendant support.",
    suitability:
      "Suitable for post-hospital recovery, wound care, injections, vitals monitoring, and families who need trained nursing support at home in Pune or PCMC.",
    includesList: [
      "Clinical nursing tasks by a trained RN",
      "Wound care and dressings as advised",
      "Injections and vitals monitoring",
      "Medication support as advised by the treating doctor",
      "Care coordinator updates for the family",
      "Continuous nursing cover when a 24-hour nursing plan is agreed",
    ],
    excludesList: [
      "Hospital admission, ICU setup or emergency ambulance services",
      "Diagnosis or prescribing of medicines (follows the treating doctor’s advice)",
      "Companion-only elder sitting without clinical nursing need",
      "Guaranteed same-day deployment in every case — timing is confirmed after assessment",
    ],
    faqs: [
      {
        q: "What does nursing care at home include?",
        a: "It typically includes clinical nursing tasks by a trained RN such as wound care, injections, vitals monitoring and medication support as advised, coordinated for families in Pune and PCMC.",
      },
      {
        q: "When should we choose nursing care instead of patient or elder care?",
        a: "Choose Nursing Care when clinical nursing skills are required. Patient Care focuses more on recovery and personal support; Elder Care focuses on senior companionship and daily living help.",
      },
    ],
    category: "nursing",
    rate: "₹2,800 – ₹3,000",
    rateUnit: "per day",
    rateNote: "Indicative for skilled nursing; final plan depends on patient condition",
    image: "/brand-kit/images/nursing-care.jpg",
  },
  {
    slug: "patient-care",
    name: "Patient Care at Home",
    icon: "HeartPulse",
    tagline: "Recovery and personal support at home.",
    short:
      "Patient Care at Home supports recovery and day-to-day personal care — bedridden support, post-op help, mobility assistance and medication reminders — with continuous care available when the family needs round-the-clock presence.",
    differentiation:
      "Choose Patient Care for recovery and personal support at home. It is broader attendant-style care, not the same as RN-led clinical Nursing Care, and not primarily companionship-focused Elder Care.",
    suitability:
      "Suitable for bedridden patients, post-operative recovery, and families who need reliable patient support at home in Pune or Pimpri-Chinchwad (PCMC).",
    includesList: [
      "Personal care and hygiene assistance",
      "Mobility and positioning support",
      "Medication reminders",
      "Recovery support and daily living help",
      "Family updates via call or WhatsApp",
      "Continuous care/support when a 24-hour plan is agreed",
    ],
    excludesList: [
      "Specialist medical procedures that require a hospital or clinic",
      "Independent medical diagnosis or treatment decisions",
      "Standalone skilled nursing procedures unless a nursing plan is arranged separately",
      "Guaranteed clinical outcomes — care plans support recovery but do not replace doctors",
    ],
    faqs: [
      {
        q: "What is patient care at home?",
        a: "Patient Care at Home helps with recovery and daily personal support — such as bedridden care, post-op assistance, mobility help and medication reminders — coordinated for families in Pune and PCMC.",
      },
      {
        q: "Who needs patient care at home?",
        a: "It is often suitable after surgery, during bedridden periods, or whenever a family needs reliable personal support at home while recovery continues under a doctor’s guidance.",
      },
    ],
    category: "care",
    rate: "₹850 – ₹1,200",
    rateUnit: "per day",
    rateNote: "Indicative; trained attendant or skilled nurse depending on clinical need",
    image: "/brand-kit/images/patient-care.jpg",
  },
  {
    slug: "elder-care",
    name: "Elder Care at Home",
    icon: "Users",
    tagline: "Companionship, caregiver support and senior care at home.",
    short:
      "Elder Care at Home provides senior caregiver support and companionship — meals, mobility help, medication reminders and trusted presence — including continuous overnight support when families need round-the-clock care.",
    differentiation:
      "Choose Elder Care for seniors who need a caregiver for companionship and daily living help. It is not RN-led clinical nursing; if injections, wound care or clinical monitoring are required, Nursing Care is the better fit.",
    suitability:
      "Suitable for seniors who need a home caregiver, companionship, daily living help, medication reminders, or continuous overnight support in Pune and PCMC.",
    includesList: [
      "Home caregiver / attendant support for seniors",
      "Companionship and trusted presence",
      "Meals and daily living assistance",
      "Mobility help and medication reminders",
      "Family communication and care coordination",
      "Continuous care/support when a 24-hour elder care plan is agreed",
    ],
    excludesList: [
      "Clinical nursing procedures that require a registered nurse (arrange Nursing Care if needed)",
      "Hospital or specialist medical treatment",
      "Guaranteed medical outcomes",
      "Live-in domestic housework beyond agreed care tasks",
    ],
    faqs: [
      {
        q: "What does a home caregiver do?",
        a: "A home caregiver typically helps seniors with companionship, daily living tasks, mobility support and medication reminders, with CareNest coordination for families in Pune and PCMC.",
      },
      {
        q: "Is elder care the same as nursing care?",
        a: "No. Elder Care focuses on caregiver support and companionship. Nursing Care is for clinical nursing needs such as wound care, injections or vitals monitoring by a trained RN.",
      },
    ],
    category: "care",
    rate: "₹850 – ₹900",
    rateUnit: "per day",
    rateNote: "Indicative for elder caregiver support; final plan depends on needs",
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

/** Soft trust signals only — no unverified numeric claims. */
export const STATS = [
  { value: "24×7", label: "Care coordination" },
  { value: "Pune & PCMC", label: "Primary service area" },
];

export const TEAM = [
  {
    name: "Riya Shaikh",
    role: "Founder & Managing Director",
    city: "Pune",
    img: "/brand-kit/team/riya-shaikh.svg",
    bio: "Riya founded CareNest Home Health so families in Pune and PCMC can arrange dependable home care with clear coordination — Patient Care, Elder Care and Nursing Care, including continuous support when needed.",
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
    text: "Continuous care/support can be arranged with Patient Care, Elder Care or Nursing Care when your family needs round-the-clock presence.",
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
    d: "We recommend Patient Care at Home, Elder Care at Home or Nursing Care at Home — and explain when continuous 24 Hour Home Care support is appropriate.",
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
