// Central data source for services, locations, testimonials, faqs, team.

export const COMPANY = {
  name: "CareNest Home Health",
  short: "CareNest",
  phone: "+91 9175724546",
  phoneDigits: "919175724546",
  whatsapp: "919175724546",
  email: "info@carenesthomehealth.in",
  website: "https://carenesthomehealth.in",
  tagline: "Premium home healthcare, delivered.",
  address: "Serving families across India · Head office · Pune",
  socials: {
    instagram: "https://www.instagram.com/carenesthomehealth",
    facebook: "https://www.facebook.com/carenesthomehealth",
    linkedin: "https://www.linkedin.com/company/carenesthomehealth",
    youtube: "https://www.youtube.com/@carenesthomehealth",
  },
  logo: "/logo.svg",
  logoWordmark: "/logo-wordmark.svg",
};

export const SERVICES = [
  { slug: "home-nursing", name: "Home Nursing", icon: "Stethoscope", tagline: "Skilled nurses, round-the-clock.", short: "Wound care, IV, injections, monitoring at home by trained RNs.", category: "nursing", rate: "₹2,800 – ₹3,000", rateUnit: "per day", rateNote: "24-hour skilled nursing, rate varies by patient condition" },
  { slug: "caregiver-services", name: "Caregiver Services", icon: "HeartHandshake", tagline: "Compassion. Consistency. Care.", short: "Trained caregivers for daily living, mobility and companionship.", category: "care", rate: "₹700 – ₹850", rateUnit: "per 12-hour shift", rateNote: "Starting rate · non-clinical support" },
  { slug: "doctor-at-home", name: "Doctor At Home", icon: "Stethoscope", tagline: "A physician at your doorstep.", short: "GP and specialist visits with prescription & follow-up.", category: "clinical", rate: "From ₹1,200", rateUnit: "per visit", rateNote: "GP visit · specialist visits quoted separately" },
  { slug: "icu-at-home", name: "ICU At Home", icon: "Activity", tagline: "Hospital-grade critical care at home.", short: "Ventilators, monitors, trained ICU nurses & consultants.", category: "critical", rate: "From ₹4,500", rateUnit: "per day", rateNote: "Nursing only · equipment (ventilator, monitors, bed) billed separately" },
  { slug: "physiotherapy-at-home", name: "Physiotherapy At Home", icon: "Dumbbell", tagline: "Recover in the comfort of home.", short: "Neuro, ortho, cardio-pulmonary rehab by licensed physios.", category: "rehab", rate: "₹800", rateUnit: "per session", rateNote: "45–60 minute physio session at home" },
  { slug: "medical-equipment-rental", name: "Medical Equipment Rental", icon: "Package", tagline: "Same-day delivery, sanitised & serviced.", short: "Beds, oxygen concentrators, BiPAP/CPAP, wheelchairs & more.", category: "equipment", rate: "From ₹150", rateUnit: "per day", rateNote: "Wheelchair ₹150/day · Hospital bed ₹250/day · Oxygen concentrator ₹500/day · BiPAP ₹800/day" },
  { slug: "bedridden-patient-care", name: "Bedridden Patient Care", icon: "BedDouble", tagline: "Dignified care that prevents bedsores.", short: "Positioning, hygiene, feeding, catheter & bedsore protocols.", category: "care", rate: "₹850 – ₹1,000", rateUnit: "per 12-hour shift", rateNote: "Trained attendant · nursing add-on available" },
  { slug: "stroke-rehabilitation", name: "Stroke Rehabilitation", icon: "Brain", tagline: "Reclaim mobility, one milestone at a time.", short: "Physio, speech, occupational therapy & caregiver support.", category: "rehab", rate: "₹800 – ₹1,200", rateUnit: "per session", rateNote: "Physio ₹800 · Speech therapy ₹1,200 · package plans available" },
  { slug: "paralysis-care", name: "Paralysis Care", icon: "Wheelchair", tagline: "Restoring independence with structured therapy.", short: "Long-term rehab and daily support for hemi/paraplegia.", category: "rehab", rate: "₹850 – ₹1,000", rateUnit: "per 12-hour shift", rateNote: "Attendant + physio sessions billed separately" },
  { slug: "cancer-patient-care", name: "Cancer Patient Care", icon: "Ribbon", tagline: "Gentle care through every cycle.", short: "Chemo aftercare, pain & symptom management, family support.", category: "critical", rate: "₹1,000 – ₹1,200", rateUnit: "per 12-hour shift", rateNote: "Skilled nurse · consultant escalation included" },
  { slug: "palliative-care", name: "Palliative Care", icon: "HeartPulse", tagline: "Comfort, dignity, presence.", short: "Symptom control & emotional support for life-limiting illness.", category: "critical", rate: "₹1,000 – ₹1,200", rateUnit: "per 12-hour shift", rateNote: "Nurse + care manager · consultant visits arranged" },
  { slug: "mother-baby-care", name: "Mother & Baby Care", icon: "Baby", tagline: "For the most precious first weeks.", short: "Postnatal care, lactation, newborn hygiene & massage.", category: "care", rate: "₹850 – ₹1,000", rateUnit: "per 12-hour shift", rateNote: "Trained maternity caregiver · 21 & 40 day packages available" },
  { slug: "dementia-care", name: "Dementia Care", icon: "Brain", tagline: "Familiar routines. Familiar faces.", short: "Structured cognitive & behavioural care at home.", category: "care", rate: "₹900 – ₹1,100", rateUnit: "per 12-hour shift", rateNote: "Specialised memory-care caregiver" },
  { slug: "alzheimer-care", name: "Alzheimer Care", icon: "Brain", tagline: "Specialised memory care.", short: "Safe environments, tailored routines, family training.", category: "care", rate: "₹900 – ₹1,100", rateUnit: "per 12-hour shift", rateNote: "Specialised memory-care caregiver + family training" },
  { slug: "post-operative-care", name: "Post Operative Care", icon: "Bandage", tagline: "A smoother recovery, at home.", short: "Wound care, mobilisation, medication & recovery tracking.", category: "clinical", rate: "₹1,000 – ₹1,200", rateUnit: "per 12-hour shift", rateNote: "Skilled nurse · care plan tuned to your surgery" },
  { slug: "tracheostomy-care", name: "Tracheostomy Care", icon: "Wind", tagline: "Specialised airway management.", short: "Suctioning, tube care, humidification & emergency protocols.", category: "critical", rate: "₹1,200 – ₹1,500", rateUnit: "per 12-hour shift", rateNote: "Trained ICU/tracheostomy nurse only" },
  { slug: "ventilator-support", name: "Ventilator Support", icon: "Waves", tagline: "24×7 ventilator & ICU nurses.", short: "Invasive/non-invasive ventilation with consultant oversight.", category: "critical", rate: "From ₹3,500", rateUnit: "per day", rateNote: "Nursing only · ventilator/BiPAP rental billed separately" },
  { slug: "injection-dressing", name: "Injection & Dressing", icon: "Syringe", tagline: "Sterile, punctual, professional.", short: "IV/IM injections and wound dressing at your convenience.", category: "clinical", rate: "₹600", rateUnit: "per visit", rateNote: "₹600 per injection · ₹600 per dressing" },
  { slug: "attendant-services", name: "Attendant Services", icon: "UserRound", tagline: "Round-the-clock personal help.", short: "12h or 24h attendants trained in patient handling.", category: "care", rate: "₹700 – ₹850", rateUnit: "per 12-hour shift", rateNote: "Non-clinical trained attendant" },
  { slug: "elder-care", name: "Elder Care", icon: "Users", tagline: "Because they cared for us first.", short: "Full-spectrum senior care from meals to medical.", category: "care", rate: "₹850 – ₹900", rateUnit: "per shift", rateNote: "₹850 for 12-hour shift · ₹900 for 24-hour" },
  { slug: "24x7-nursing-care", name: "24×7 Nursing Care", icon: "Clock", tagline: "Uninterrupted, always on.", short: "Continuous shift-based nursing with structured handover.", category: "nursing", rate: "₹2,800 – ₹3,000", rateUnit: "per day", rateNote: "Rate depends on patient condition and clinical scope" },
  { slug: "critical-care", name: "Critical Care", icon: "Activity", tagline: "Advanced life-support, at home.", short: "Multi-parameter monitoring & consultant-led interventions.", category: "critical", rate: "₹1,200", rateUnit: "per day", rateNote: "Starting rate — final plan depends on equipment & clinical support" },
];

export const SERVICE_CATEGORIES = [
  { key: "all", label: "All care" },
  { key: "nursing", label: "Nursing" },
  { key: "clinical", label: "Clinical" },
  { key: "critical", label: "Critical" },
  { key: "care", label: "Everyday care" },
  { key: "rehab", label: "Rehabilitation" },
  { key: "equipment", label: "Equipment" },
];

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

export const TESTIMONIALS = [
  { id: 1, name: "Aarti Deshpande", city: "Pune", relation: "Daughter of patient", rating: 5, text: "CareNest's team looked after my father after his stroke — the physiotherapist and the night nurse were exceptional. He is walking with a stick again, at 78." },
  { id: 2, name: "Rohit Menon", city: "Mumbai", relation: "Son of patient", rating: 5, text: "We set up ICU-at-home in under 4 hours for my mother post-cardiac surgery. Consultants and monitors — everything was ready. Deeply grateful." },
  { id: 3, name: "Kavya R.", city: "Bengaluru", relation: "New mother", rating: 5, text: "My postnatal caregiver was a genuine godsend. Kind, calm and skilled. I wish we had known about them with my first baby." },
  { id: 4, name: "Dr. Suresh Iyer", city: "Hyderabad", relation: "Referring physician", rating: 5, text: "I have referred many of my post-op patients to CareNest. Consistent hand-hygiene, careful charting, and a nurse who actually listens. Rare in home care." },
  { id: 5, name: "Meera Patil", city: "Thane", relation: "Wife of patient", rating: 5, text: "Palliative care for my husband was handled with such dignity. They didn't rush, they cared. That is worth more than I can say." },
  { id: 6, name: "Anup Sharma", city: "Ranchi", relation: "Son of patient", rating: 5, text: "Equipment rental delivered the same evening. The team even trained my sister to use the BiPAP. Punctual and professional." },
];

export const FAQS = [
  { q: "How quickly can care begin?", a: "For most non-critical services we deploy within 4–8 hours of confirmation. Critical / ICU-at-home is possible within 3–6 hours in metros." },
  { q: "Are your nurses qualified?", a: "All our RNs are GNM or B.Sc Nursing qualified, background-verified, trained in home-care protocols and reviewed monthly." },
  { q: "Do you serve outside metros?", a: "Yes — we currently operate across Pune, Mumbai, Bengaluru, Hyderabad, Kolkata, Bhubaneswar, Ranchi, Goa and expanding. Call us to check your PIN." },
  { q: "How is pricing decided?", a: "We share a personalised plan after a free 10-minute consult. Pricing depends on skill level, hours, equipment and clinical complexity." },
  { q: "Can I hire only for the night?", a: "Absolutely. 12-hour night shifts, 24-hour attendants and hourly nurse visits are all available." },
  { q: "Do you work with insurance?", a: "We provide detailed invoices, claim-ready documentation and coordinate with most major insurers on cashless / reimbursement plans." },
  { q: "How do you handle emergencies?", a: "Every case has an assigned care manager reachable 24×7. Escalations reach a consultant physician within minutes and, if needed, we coordinate ambulance transfer." },
  { q: "Can I change the assigned caregiver?", a: "Yes — comfort matters. A single call to your care manager will initiate a swap, usually within 24 hours." },
];

export const STATS = [
  { value: "12,400+", label: "Families cared for" },
  { value: "4.9/5", label: "Google rating" },
  { value: "24×7", label: "Care coordination" },
  { value: "12", label: "Cities served" },
];

export const TEAM = [
  { name: "Riya Shaikh", role: "Founder & Managing Director", city: "India", img: "/brand-kit/team/riya-shaikh.svg", bio: "Riya founded CareNest Home Health to bring hospital-grade care into the warmth of the home — with dignity, punctuality and a genuinely human touch. She leads clinical partnerships, care standards and everyday operations across all cities we serve." },
];

export const PARTNERS = [];

export const BLOG_POSTS = [
  { slug: "bedsore-prevention-guide", title: "A family's guide to preventing bedsores", excerpt: "Simple, evidence-based turns, cushions and skin-care every family can practise at home.", tag: "Care Guide", read: "6 min", img: "/brand-kit/images/patient-care.jpg" },
  { slug: "post-stroke-recovery-milestones", title: "Post-stroke recovery: what to expect in month 1", excerpt: "Neuro-rehab benchmarks and how to celebrate the small wins that add up.", tag: "Rehab", read: "8 min", img: "/brand-kit/images/physiotherapy.jpg" },
  { slug: "choosing-an-attendant", title: "How to choose a home attendant — 7 red flags", excerpt: "A checklist we wish more families used before signing on.", tag: "Hiring", read: "5 min", img: "/brand-kit/images/elder-care.jpg" },
];

export const IMAGES = {
  heroPrimary: "/brand-kit/social/hero-banner.jpg",
  heroSecondary: "/brand-kit/images/nursing-care.jpg",
  doctorHome: "/brand-kit/images/doctor-visit.jpg",
  physioHome: "/brand-kit/images/physiotherapy.jpg",
  elderCare: "/brand-kit/images/elder-care.jpg",
  nurseCare: "/brand-kit/images/nursing-care.jpg",
  goldTexture: "/brand-kit/social/gbp-cover.jpg",
  gallery: [
    "/brand-kit/images/nursing-care.jpg",
    "/brand-kit/images/elder-care.jpg",
    "/brand-kit/images/icu-at-home.jpg",
    "/brand-kit/images/physiotherapy.jpg",
    "/brand-kit/images/patient-care.jpg",
    "/brand-kit/images/doctor-visit.jpg",
    "/brand-kit/images/medical-equipment.jpg",
    "/brand-kit/images/home-care.jpg",
  ],
};

export const TRUST_BADGES = [
  { label: "Background-verified staff" },
  { label: "In-network with major insurers" },
  { label: "MOHFW-aligned protocols" },
  { label: "24×7 care manager" },
];
