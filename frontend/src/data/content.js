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
    slug: "home-nursing",
    name: "Nursing Care",
    icon: "Stethoscope",
    tagline: "Skilled nurses, when you need them.",
    short:
      "Wound care, injections, vitals monitoring and clinical nursing at home by trained RNs — including 12-hour and 24×7 cover.",
    category: "nursing",
    rate: "₹2,800 – ₹3,000",
    rateUnit: "per day",
    rateNote: "24-hour skilled nursing; rate varies by patient condition",
    image: "/brand-kit/images/nursing-care.jpg",
  },
  {
    slug: "patient-care",
    name: "Patient Care",
    icon: "HeartPulse",
    tagline: "Recovery support at home.",
    short:
      "Personalised patient support for bedridden care, post-op recovery, rehab coordination and day-to-day clinical assistance at home.",
    category: "care",
    rate: "₹850 – ₹1,200",
    rateUnit: "per 12-hour shift",
    rateNote: "Trained attendant or skilled nurse depending on clinical need",
    image: "/brand-kit/images/patient-care.jpg",
  },
  {
    slug: "elder-care",
    name: "Elder Care & Companionship",
    icon: "Users",
    tagline: "Companionship with dignity.",
    short:
      "Senior care, daily living support and warm companionship — meals, mobility help, medication reminders and trusted presence.",
    category: "care",
    rate: "₹850 – ₹900",
    rateUnit: "per shift",
    rateNote: "₹850 for 12-hour shift · ₹900 for 24-hour",
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
    a: "For most services we deploy within 4–8 hours of confirmation in Pune. Urgent cases are prioritised — call or WhatsApp us and a care coordinator will respond quickly.",
  },
  {
    q: "Are your nurses qualified?",
    a: "All our RNs are GNM or B.Sc Nursing qualified, background-verified, trained in home-care protocols and reviewed regularly.",
  },
  {
    q: "Which services do you offer?",
    a: "We focus on three core services: Nursing Care, Patient Care, and Elder Care & Companionship. Tell us the patient's needs and we'll recommend the right plan.",
  },
  {
    q: "How is pricing decided?",
    a: "We share a personalised plan after a free consult. Pricing depends on skill level, hours and clinical complexity. Indicative rates are shown on each service page.",
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
    title: "One plan, three services",
    text: "Nursing, patient support or elder companionship — matched to real need.",
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
    d: "We recommend Nursing Care, Patient Care or Elder Care & Companionship and confirm rates.",
  },
  {
    n: "03",
    t: "Care at home",
    d: "A verified professional arrives in Pune — with ongoing coordination from your care manager.",
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

/**
 * Expanded, unique SEO copy for the 3 primary service pages.
 * Kept in data so ServiceDetail stays lightweight.
 */
export const SERVICE_PAGE_CONTENT = {
  "home-nursing": {
    overview:
      "CareNest Nursing Care brings qualified registered nurses into your home in Pune for clinical tasks that used to mean hospital visits or uncertain private arrangements. From wound dressing and injections to vitals monitoring and continuous shift cover, we match nurse skill to the patient's condition — with a care coordinator who stays reachable.",
    whoNeeds: [
      "Patients discharged after surgery who still need skilled nursing at home",
      "Families managing IV therapy, catheter care, or complex medication schedules",
      "Households that need reliable 12-hour or 24×7 nursing cover in Pune",
      "Anyone who wants clinical oversight without another hospital admission",
    ],
    included: [
      "GNM / B.Sc Nursing qualified, background-verified RNs",
      "Wound care, injections, vitals and clinical charting as agreed in the plan",
      "12-hour or 24×7 shift options with structured handover",
      "Care coordinator for timing, replacements and family updates",
      "Insurance-ready invoices and clear documentation",
      "Escalation path when the patient's condition changes",
    ],
    howItWorks: [
      "Share the doctor's advice, current medicines and preferred hours.",
      "We recommend a nursing plan and indicative rate for Pune.",
      "A verified nurse is assigned; your coordinator confirms start time.",
      "Daily updates stay simple — call or WhatsApp when you need clarity.",
    ],
    benefits: [
      "Hospital-grade nursing routines in a familiar home setting",
      "Faster deployment across Pune neighbourhoods we already serve",
      "One coordinator instead of juggling multiple freelancers",
      "Plans that can step up or down as recovery progresses",
    ],
    puneContext:
      "Pune is CareNest's primary service area. Whether you are in Kothrud, Baner, Hadapsar, Kharadi, Pimpri-Chinchwad or nearby localities, we prioritise clear timing and local coordination so nursing care starts without unnecessary delay.",
    faqs: [
      {
        q: "Is home nursing in Pune available for night shifts?",
        a: "Yes. We offer 12-hour night shifts and 24×7 nursing cover, subject to nurse availability and the clinical scope required.",
      },
      {
        q: "Are CareNest nurses qualified and verified?",
        a: "Yes. Our RNs are GNM or B.Sc Nursing qualified and background-verified before assignment. Skill match depends on the care plan.",
      },
      {
        q: "How soon can nursing care start in Pune?",
        a: "For many non-critical plans we aim for same-day or next-day start after confirmation. Urgent needs are prioritised — call or WhatsApp for the fastest update.",
      },
      {
        q: "What clinical tasks can a home nurse handle?",
        a: "Typical scope includes wound care, injections, vitals monitoring, catheter support and medication administration as defined in your plan. Complex ICU-level needs are assessed case by case.",
      },
      {
        q: "Can the same nurse continue for long-term care?",
        a: "We try to keep continuity where possible. If a replacement is needed, your coordinator arranges handover so the family is not left guessing.",
      },
      {
        q: "How is nursing priced?",
        a: "Indicative 24-hour skilled nursing rates start around ₹2,800–₹3,000 per day and vary by condition and scope. We confirm a written plan after a short consult.",
      },
      {
        q: "Do you share updates with the family?",
        a: "Yes. Families receive clear updates via call or WhatsApp, and we keep documentation organised for doctors and insurers when needed.",
      },
    ],
  },
  "patient-care": {
    overview:
      "CareNest Patient Care supports recovery at home in Pune when a loved one needs more than companionship but may not need full clinical nursing every hour. We help with bedridden care, post-operative routines, mobility assistance and day-to-day patient support — matched to real need, with trained staff and a coordinator who keeps the plan practical.",
    whoNeeds: [
      "Bedridden patients who need positioning, hygiene and safe handling",
      "Families managing post-operative recovery at home",
      "Patients who need help with feeding, mobility and daily clinical assistance",
      "Caregivers who need reliable shift support so they can rest",
    ],
    included: [
      "Trained attendant or skilled support based on clinical need",
      "Help with hygiene, positioning, mobility and daily routines",
      "Medication reminders and simple progress notes for the family",
      "Coordination with Nursing Care when clinical tasks require an RN",
      "Flexible 12-hour shifts with clear start and end times",
      "Insurance-ready invoices where applicable",
    ],
    howItWorks: [
      "Tell us about the patient's condition, mobility and home setup.",
      "We recommend Patient Care alone or alongside Nursing Care if needed.",
      "A verified caregiver is briefed on routines your family already follows.",
      "Your coordinator stays available for changes, night cover or extensions.",
    ],
    benefits: [
      "Safer daily support than ad-hoc local hires",
      "Clearer boundaries between attendant care and skilled nursing",
      "Less burnout for family caregivers in Pune households",
      "A plan you can adjust as the patient improves or needs change",
    ],
    puneContext:
      "From hospital discharge in Pune to longer recovery at home, families often need dependable patient support quickly. CareNest focuses on Pune so coordinators understand local travel times, apartment living constraints and how to set up practical shift cover.",
    faqs: [
      {
        q: "How is Patient Care different from Nursing Care?",
        a: "Patient Care focuses on daily support, mobility, hygiene and recovery routines. Nursing Care is for clinical tasks by qualified RNs. Many families use both in a combined plan.",
      },
      {
        q: "Can you support bedridden patients at home in Pune?",
        a: "Yes. We train for safe positioning, hygiene and handling protocols. If bedsore risk or clinical complexity is high, we may recommend adding nursing oversight.",
      },
      {
        q: "Do you provide post-operative patient support?",
        a: "Yes. We help with mobility, routine assistance and family updates after discharge. Wound care or injections are handled under Nursing Care when required.",
      },
      {
        q: "What shift lengths are available?",
        a: "Most Patient Care plans run as 12-hour shifts. We can discuss extended cover based on availability and the patient's needs.",
      },
      {
        q: "Will the caregiver follow our doctor's instructions?",
        a: "We brief staff on the routines and precautions you share. Clinical procedures stay with qualified nurses; attendants support the day-to-day plan.",
      },
      {
        q: "How fast can Patient Care begin?",
        a: "In Pune we often start within hours of confirmation for standard cases. Share timing constraints when you enquire so we can plan accordingly.",
      },
      {
        q: "What does Patient Care cost?",
        a: "Indicative rates are about ₹850–₹1,200 per 12-hour shift depending on skill level. Final pricing is confirmed after understanding the patient's needs.",
      },
      {
        q: "Can I switch from Patient Care to Nursing Care later?",
        a: "Yes. Your coordinator can revise the plan if the clinical need increases — without starting the whole search process again.",
      },
    ],
  },
  "elder-care": {
    overview:
      "CareNest Elder Care & Companionship is for seniors in Pune who need trustworthy daily support and warm presence — not necessarily intensive clinical nursing. We help with meals, mobility, medication reminders, personal care and companionship so older adults stay safer and less alone at home, while families get reliable backup.",
    whoNeeds: [
      "Seniors living alone or with family members who work full days",
      "Parents who need help with meals, walks, bathing or medication reminders",
      "Families seeking respectful companionship for an ageing parent in Pune",
      "Households that want consistent caregivers instead of rotating strangers",
    ],
    included: [
      "Background-verified caregivers trained for senior support",
      "Assistance with daily living: meals, mobility, personal hygiene",
      "Medication reminders and simple wellbeing check-ins",
      "Companionship that respects dignity and familiar routines",
      "12-hour or 24-hour shift options where available",
      "Coordinator support for replacements and schedule changes",
    ],
    howItWorks: [
      "Describe your parent's routine, mobility and what matters most at home.",
      "We match Elder Care & Companionship — or combine with nursing if needed.",
      "The caregiver is introduced with clear do's and don'ts from your family.",
      "You stay updated; changes to hours or support level are easy to request.",
    ],
    benefits: [
      "Peace of mind for working children in Pune and nearby cities",
      "Seniors keep independence at home with a trusted helper nearby",
      "Fewer last-minute scrambles when a regular attendant cancels",
      "A respectful, structured alternative to impersonal institutional care",
    ],
    puneContext:
      "Many Pune families balance careers with ageing parents at home. Elder Care & Companionship from CareNest is built for that reality — local coordination, clear communication in familiar languages where possible, and caregivers who understand everyday senior routines across the city.",
    faqs: [
      {
        q: "Is Elder Care the same as a medical nurse?",
        a: "No. Elder Care & Companionship focuses on daily living support and presence. If clinical nursing is required, we recommend Nursing Care or a combined plan.",
      },
      {
        q: "Can caregivers help with bathing and meals?",
        a: "Yes. Personal hygiene support, meal assistance and mobility help are common parts of elder-care plans, based on what the senior is comfortable with.",
      },
      {
        q: "Do you offer 24-hour elder care in Pune?",
        a: "24-hour cover is available on many plans. Indicative pricing is shared upfront; final confirmation depends on caregiver availability.",
      },
      {
        q: "How do you choose the right caregiver?",
        a: "We consider temperament, language comfort, mobility needs and household preferences — not only shift timing — so the match feels workable day to day.",
      },
      {
        q: "What if my parent has dementia or memory concerns?",
        a: "Tell us during enquiry. We can plan for structured routines and closer supervision, and advise when skilled nursing should be added.",
      },
      {
        q: "Can family still stay involved?",
        a: "Absolutely. CareNest support is meant to assist the family, not replace it. You set preferences; we keep communication open.",
      },
      {
        q: "How much does Elder Care & Companionship cost?",
        a: "Indicative rates are about ₹850 for a 12-hour shift and ₹900 for 24-hour cover. We confirm the plan after understanding routines and hours needed.",
      },
      {
        q: "How do I start elder care in Pune?",
        a: "Call, WhatsApp or use the enquiry form on this page. A coordinator will respond with availability and next steps — usually the same day.",
      },
    ],
  },
};
