// Central data source for CareNest — simplified to 3 primary services (Pune-first).

export const COMPANY = {
  name: "CareNest Home Health",
  short: "CareNest",
  phone: "+91 9175724546",
  phoneDigits: "919175724546",
  whatsapp: "919175724546",
  email: "info@carenesthomehealth.in",
  website: "https://carenesthomehealth.in",
  tagline: "Care at home in Pune.",
  address: "Serving families in Pune · Head office · Pune",
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
    slug: "patient-care",
    name: "Patient Care",
    icon: "HeartPulse",
    tagline: "Patient care at home.",
    short:
      "Personalised support for bedridden care, post-op recovery, rehab coordination and day-to-day clinical assistance at home.",
    category: "care",
    rate: "₹850 – ₹1,200",
    rateUnit: "per 12-hour shift",
    rateNote: "Trained attendant or skilled nurse depending on clinical need",
    image: "/brand-kit/images/patient-care.jpg",
  },
  {
    slug: "elder-care",
    name: "Elder Care",
    icon: "Users",
    tagline: "Elder care at home.",
    short:
      "Senior care, daily living support and warm companionship — meals, mobility help, medication reminders and trusted presence.",
    category: "care",
    rate: "₹850 – ₹900",
    rateUnit: "per shift",
    rateNote: "₹850 for 12-hour shift · ₹900 for 24-hour",
    image: "/brand-kit/images/elder-care.jpg",
  },
  {
    slug: "home-nursing",
    name: "Nursing Care",
    icon: "Stethoscope",
    tagline: "Nursing care at home.",
    short:
      "Wound care, injections, vitals monitoring and clinical nursing at home by trained RNs — including 12-hour and 24×7 cover.",
    category: "nursing",
    rate: "₹2,800 – ₹3,000",
    rateUnit: "per day",
    rateNote: "24-hour skilled nursing; rate varies by patient condition",
    image: "/brand-kit/images/nursing-care.jpg",
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
    a: "For most services we deploy within 4–8 hours of confirmation in Pune. Urgent cases are prioritised — call or WhatsApp us and a care coordinator will respond quickly.",
  },
  {
    q: "Are your nurses qualified?",
    a: "All our RNs are GNM or B.Sc Nursing qualified, background-verified, trained in home-care protocols and reviewed regularly.",
  },
  {
    q: "Which services do you offer?",
    a: "We focus on three core services: Patient Care, Elder Care, and Nursing Care at home. Tell us the patient's needs and we'll recommend the right plan.",
  },
  {
    q: "How is pricing decided?",
    a: "We share a personalised plan after a free consult. Pricing depends on skill level, hours and clinical complexity.",
  },

  {
    q: "Can I hire only for the night?",
    a: "Yes. 12-hour night shifts, 24-hour cover and visit-based nursing are available.",
  },
  {
    q: "Do you work with insurance?",
    a: "We provide detailed invoices and claim-ready documentation, and coordinate with most major insurers on cashless / reimbursement plans.",
  },
];

export const STATS = [
  { value: "12,400+", label: "Families cared for" },
  { value: "4.9/5", label: "Google rating" },
  { value: "24×7", label: "Care coordination" },
  { value: "Pune", label: "Primary service area" },
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
    title: "Pune-focused coordination",
    text: "Local care managers who know Pune neighbourhoods and can deploy quickly.",
  },
  {
    title: "Clear communication",
    text: "Simple updates for families — call, WhatsApp or your care manager.",
  },
  {
    title: "Three focused services",
    text: "Patient Care, Elder Care, or Nursing Care — matched to what your family needs.",
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
    d: "We recommend Patient Care, Elder Care or Nursing Care and confirm next steps.",
  },
  {
    n: "03",
    t: "Care at home",
    d: "A verified professional arrives — with ongoing coordination from your care manager.",
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
  { label: "Pune same-day deployment" },
  { label: "24×7 care manager" },
];
