/**
 * Approved CareNest services (exactly 11).
 * Slugs preserve Google-indexed URLs from the live sitemap where they match.
 * Alzheimer's uses indexed slug `alzheimer-care` (not alzheimers-care).
 */

export const SERVICE_SLUGS = [
  "elder-care",
  "caregiver-services",
  "attendant-services",
  "home-nursing",
  "24x7-nursing-care",
  "post-operative-care",
  "bedridden-patient-care",
  "dementia-care",
  "alzheimer-care",
  "paralysis-care",
  "mother-baby-care",
] as const;

export type ServiceSlug = (typeof SERVICE_SLUGS)[number];

export type ServiceFAQ = { q: string; a: string };

export type ServiceContent = {
  slug: ServiceSlug;
  name: string;
  shortName: string;
  navLabel: string;
  tagline: string;
  summary: string;
  /** SEO */
  title: string;
  description: string;
  /** Imagery */
  image: string;
  imageAlt: string;
  /** Related service slugs */
  related: ServiceSlug[];
  /** Unique page sections */
  overview: string[];
  whoNeeds: string[];
  includes: string[];
  activities: string[];
  howArranged: string[];
  benefits: string[];
  whyCareNest: string[];
  puneContext: string;
  safety: string[];
  enquire: string;
  faqs: ServiceFAQ[];
};

export const SERVICES: ServiceContent[] = [
  {
    slug: "elder-care",
    name: "Elder Care",
    shortName: "Elder Care",
    navLabel: "Elder Care",
    tagline: "Respectful daily support for seniors at home.",
    summary:
      "Elder care support for seniors in Pune who need help with daily routines, companionship and reliable presence — arranged around your family’s schedule.",
    title: "Elder Care at Home in Pune | CareNest Home Health",
    description:
      "CareNest provides elder care at home in Pune — daily living support, companionship and coordinated care for seniors. Call or WhatsApp to enquire.",
    image: "/brand-kit/images/elder-care.jpg",
    imageAlt: "Caregiver supporting an elderly person at home in a calm indoor setting",
    related: ["caregiver-services", "attendant-services", "dementia-care", "home-nursing"],
    overview: [
      "Elder care at home helps older adults remain in a familiar environment while receiving practical, respectful support. For many families in Pune, this means assistance with everyday routines rather than a hospital stay.",
      "CareNest arranges elder care support matched to the senior’s needs — from companionship and mealtime help to mobility assistance and coordination with the family’s preferred clinicians when required.",
      "Our approach focuses on dignity, clear communication with family members, and steady routines that reduce stress for both seniors and caregivers at home.",
    ],
    whoNeeds: [
      "Seniors who need help with bathing, dressing, meals or mobility",
      "Older adults living alone or with working family members",
      "Families seeking trustworthy companionship for a parent or grandparent",
      "Seniors recovering from a mild illness who still need daily support",
      "Households that want structured check-ins without relocating their loved one",
    ],
    includes: [
      "Personal care assistance tailored to comfort and privacy preferences",
      "Companionship and meaningful daily engagement",
      "Medication reminders as directed by the family or prescribing clinician",
      "Help with meals, hydration and light household support related to care",
      "Mobility assistance within the home",
      "Regular updates for designated family contacts",
    ],
    activities: [
      "Morning and evening care routines",
      "Assistance with walking, transfers and safe seating",
      "Preparing or serving meals according to family guidance",
      "Encouraging light, appropriate activity and rest",
      "Keeping the care area tidy and organised",
      "Noting concerns and sharing them promptly with the family",
    ],
    howArranged: [
      "You contact CareNest by phone, WhatsApp or enquiry form.",
      "A care coordinator discusses the senior’s routines, preferences and any clinical notes the family shares.",
      "We recommend a suitable care support plan and timing.",
      "Agreed care support is arranged, with follow-up so the family can request adjustments.",
    ],
    benefits: [
      "Seniors stay in familiar surroundings",
      "Families gain reliable daytime or ongoing support",
      "Routines remain personal rather than institutional",
      "Communication stays centred on the family’s priorities",
    ],
    whyCareNest: [
      "Pune-focused coordination that understands local family needs",
      "Clear discussion of requirements before care begins",
      "Emphasis on dignity, privacy and respectful communication",
      "Simple call and WhatsApp access for family members",
    ],
    puneContext:
      "Many Pune families balance work, travel and multi-generational homes. Elder care at home helps seniors in neighbourhoods across the city receive practical support without unnecessary disruption to family life.",
    safety: [
      "Care is arranged only after understanding household expectations",
      "Privacy and personal dignity are treated as non-negotiable",
      "Families are encouraged to share relevant clinician instructions",
      "Concerns are escalated to the family promptly — CareNest does not replace emergency medical services",
    ],
    enquire:
      "Tell us about your parent’s or grandparent’s daily needs. We will discuss suitable elder care support in Pune and how to get started.",
    faqs: [
      {
        q: "Is elder care the same as nursing?",
        a: "Not always. Elder care often focuses on daily living support and companionship. If clinical nursing tasks are needed, we can discuss home nursing or related options.",
      },
      {
        q: "Can elder care be arranged for part of the day?",
        a: "Yes. Share the hours you need and we will discuss what can be arranged based on availability and the senior’s requirements.",
      },
      {
        q: "Do you provide care only in Pune?",
        a: "Pune is our primary service focus. Contact us with your locality and we will confirm whether we can help.",
      },
      {
        q: "Will the same caregiver come every day?",
        a: "We aim for continuity whenever possible. If a change is required, we coordinate with the family.",
      },
      {
        q: "Can you help with medication reminders?",
        a: "Yes, as reminders based on instructions shared by the family or prescribing clinician. CareNest does not prescribe medicines.",
      },
      {
        q: "How do we start?",
        a: "Call, WhatsApp or submit the enquiry form. A coordinator will discuss requirements and next steps.",
      },
    ],
  },
  {
    slug: "caregiver-services",
    name: "Caregiver Services",
    shortName: "Caregiver Services",
    navLabel: "Caregiver Services",
    tagline: "Trained caregivers for dependable home support.",
    summary:
      "Caregiver services for families in Pune who need trained support with personal care, routine assistance and attentive presence at home.",
    title: "Caregiver Services at Home in Pune | CareNest Home Health",
    description:
      "Arrange caregiver services at home in Pune with CareNest — personal care support, daily assistance and family-centred coordination. Enquire by call or WhatsApp.",
    image: "/brand-kit/images/home-care.jpg",
    imageAlt: "Home caregiver assisting a family member in a residential setting",
    related: ["attendant-services", "elder-care", "bedridden-patient-care", "mother-baby-care"],
    overview: [
      "Caregiver services provide hands-on help for people who need assistance with personal care and daily activities at home. Unlike a short clinic visit, caregiver support stays with the person through the routines that matter most.",
      "CareNest works with families to understand the care recipient’s abilities, preferences and household setup before arranging caregiver support in Pune.",
      "The goal is practical help delivered with patience — so families can work, rest or travel knowing someone attentive is present.",
    ],
    whoNeeds: [
      "Adults recovering at home who need personal care help",
      "Seniors who require more support than family can provide alone",
      "People with limited mobility who need transfer and hygiene assistance",
      "Families seeking a trained caregiver for daytime or ongoing cover",
      "Households coordinating care after hospital discharge",
    ],
    includes: [
      "Assistance with bathing, grooming and dressing",
      "Support with feeding or mealtime supervision when needed",
      "Help with mobility and safe movement inside the home",
      "Companionship and observation of general wellbeing",
      "Light care-related housekeeping in the patient’s space",
      "Updates to family members as agreed",
    ],
    activities: [
      "Personal hygiene routines with attention to comfort",
      "Positioning support for comfort during rest",
      "Assisting with prescribed exercise reminders if the family shares a plan",
      "Encouraging hydration and regular meals",
      "Keeping a simple care notes habit for family review",
      "Supporting peaceful night or day rest as scheduled",
    ],
    howArranged: [
      "Share the care recipient’s needs, preferred hours and locality in Pune.",
      "We discuss skill level required — caregiver support versus nursing.",
      "Suitable caregiver support is matched and timing is confirmed.",
      "Service coordination continues so you can request changes.",
    ],
    benefits: [
      "Consistent help with tasks that are physically or emotionally demanding for families",
      "Greater confidence leaving a loved one at home",
      "Support shaped around household routines",
      "A single coordination point via CareNest",
    ],
    whyCareNest: [
      "Requirements are discussed before anyone is sent to the home",
      "We distinguish caregiver support from clinical nursing clearly",
      "Family communication is treated as part of the service",
      "Pune-oriented arrangement and follow-up",
    ],
    puneContext:
      "In Pune’s busy residential areas, caregiver services help families manage workdays and travel while someone dependable stays with a parent, spouse or recovering relative.",
    safety: [
      "Caregivers follow household guidance on privacy and gender preferences where feasible",
      "Clinical procedures remain with qualified nursing support when needed",
      "Emergency situations require calling local emergency services; caregivers alert the family",
      "We encourage families to share any fall-risk or allergy information upfront",
    ],
    enquire:
      "Describe the help you need at home. CareNest will discuss caregiver options for your Pune household.",
    faqs: [
      {
        q: "What is the difference between a caregiver and an attendant?",
        a: "Roles often overlap. Caregiver services typically emphasise personal care and daily support. Attendant services may focus more on presence, mobility help and general assistance. We help you choose based on need.",
      },
      {
        q: "Can a caregiver give injections?",
        a: "Injections and clinical nursing tasks require appropriate nursing support. Tell us what is needed and we will guide you to the right service.",
      },
      {
        q: "Do you offer male and female caregivers?",
        a: "Share your preference when you enquire. We try to accommodate based on availability.",
      },
      {
        q: "How quickly can caregiver support begin?",
        a: "Timing depends on the requirement and availability. Contact us and a coordinator will discuss realistic timelines for your case.",
      },
      {
        q: "Is caregiver support available overnight?",
        a: "Discuss the hours you need. We arrange support based on the care plan and availability — without promising options we cannot fulfil.",
      },
      {
        q: "Will you train the caregiver on our routine?",
        a: "Family briefings on routines, preferences and clinician instructions are an important part of starting care.",
      },
    ],
  },
  {
    slug: "attendant-services",
    name: "Attendant Services",
    shortName: "Attendant Services",
    navLabel: "Attendant Services",
    tagline: "Reliable attendants for day-to-day assistance.",
    summary:
      "Attendant services in Pune for patients and seniors who need a responsible helper for mobility, personal assistance and steady supervision at home.",
    title: "Attendant Services at Home in Pune | CareNest Home Health",
    description:
      "CareNest attendant services in Pune provide practical home assistance, mobility help and dependable presence. Call or WhatsApp to discuss your needs.",
    image: "/brand-kit/images/patient-care.jpg",
    imageAlt: "Patient attendant helping with daily support at home",
    related: ["caregiver-services", "elder-care", "bedridden-patient-care", "paralysis-care"],
    overview: [
      "Attendant services offer practical, person-focused help for individuals who should not be left alone for long periods or who need assistance moving safely around the home.",
      "Families often request an attendant after a hospital stay, during convalescence, or when a senior needs a responsible presence during the day.",
      "CareNest arranges attendant support in Pune with attention to punctuality, respectful conduct and clear reporting to the family.",
    ],
    whoNeeds: [
      "Patients who need help getting in and out of bed or chairs",
      "Seniors who require supervision for safety during the day",
      "People with temporary weakness after illness",
      "Families needing relief while managing work commitments",
      "Individuals who need escort-style help within the home environment",
    ],
    includes: [
      "Assistance with transfers and walking support inside the home",
      "Help with basic personal care as appropriate",
      "Monitoring general comfort and alerting the family to concerns",
      "Support during meals and rest periods",
      "Companionship to reduce isolation",
      "Coordination notes for the family’s preferred contact person",
    ],
    activities: [
      "Helping the person change position for comfort",
      "Assisting with washroom visits where needed",
      "Supporting prescribed rest and activity patterns shared by the family",
      "Keeping walking paths clear of obvious trip hazards when possible",
      "Encouraging fluid intake as advised by the family",
      "Maintaining a calm, respectful presence",
    ],
    howArranged: [
      "Contact CareNest with the patient’s condition summary and hours required.",
      "We clarify whether attendant, caregiver or nursing support is the better fit.",
      "Attendant support is arranged and the family is briefed on what to expect.",
      "Follow-up allows adjustments if needs change.",
    ],
    benefits: [
      "Extra hands for physically demanding assistance",
      "Improved peace of mind for working family members",
      "Support that stays in the home environment",
      "Flexible discussion of daytime or extended presence based on availability",
    ],
    whyCareNest: [
      "Honest matching — we will say if nursing is more appropriate",
      "Focus on safe mobility assistance and attentive presence",
      "Simple family communication channels",
      "Local Pune coordination",
    ],
    puneContext:
      "Apartment living and busy commute patterns in Pune make attendant support especially useful when relatives cannot stay home all day but still want someone responsible nearby.",
    safety: [
      "Attendants are not a substitute for emergency medical care",
      "Lift and transfer techniques should follow any clinician guidance the family provides",
      "Home safety concerns are shared with the family promptly",
      "Medication administration is not assumed — ask us if nursing support is required",
    ],
    enquire:
      "Share who needs help and for which hours. We will discuss attendant services for your home in Pune.",
    faqs: [
      {
        q: "Can an attendant stay overnight?",
        a: "Tell us the schedule you need. We discuss options based on the care requirement and availability.",
      },
      {
        q: "Does an attendant cook full meals?",
        a: "Support around meals and light care-related help is common. Full household domestic work is not the primary purpose of attendant care.",
      },
      {
        q: "What if the patient’s needs increase?",
        a: "Contact your coordinator. We can discuss stepping up to caregiver services, bedridden care support or nursing.",
      },
      {
        q: "Are attendants experienced with elderly patients?",
        a: "Many attendant assignments involve seniors. Describe the specific needs so we can arrange suitable support.",
      },
      {
        q: "How do payments work?",
        a: "Pricing depends on hours and care complexity. We explain costs clearly when discussing your plan — we do not publish misleading fixed medical outcome packages.",
      },
      {
        q: "Can we meet or brief the attendant first?",
        a: "Yes. Family briefing on routines and expectations is encouraged before regular service continues.",
      },
    ],
  },
  {
    slug: "home-nursing",
    name: "Home Nursing",
    shortName: "Home Nursing",
    navLabel: "Home Nursing",
    tagline: "Skilled nursing support in the comfort of home.",
    summary:
      "Home nursing in Pune for wound care, vitals monitoring, injections as prescribed, and clinical support coordinated with your family’s care plan.",
    title: "Home Nursing Services in Pune | CareNest Home Health",
    description:
      "CareNest home nursing in Pune offers skilled nursing support at home — vitals, wound care and clinical assistance arranged with family coordination. Enquire today.",
    image: "/brand-kit/images/nursing-care.jpg",
    imageAlt: "Home nurse providing skilled nursing care in a patient’s residence",
    related: ["24x7-nursing-care", "post-operative-care", "bedridden-patient-care", "elder-care"],
    overview: [
      "Home nursing brings qualified nursing support to the patient’s residence so routine clinical tasks and monitoring can happen without unnecessary travel when appropriate.",
      "CareNest arranges home nursing in Pune for families who have clinician guidance and need reliable nursing assistance at home.",
      "We emphasise careful listening to the discharge summary or doctor’s instructions the family shares, and clear boundaries about what nursing support can and cannot do.",
    ],
    whoNeeds: [
      "Patients needing wound care or dressing changes at home",
      "People requiring vitals monitoring and nursing observation",
      "Individuals with prescribed injections to be given by a nurse",
      "Families supporting a recovering patient after hospital discharge",
      "Seniors who need intermittent skilled nursing visits or shifts",
    ],
    includes: [
      "Nursing assessment of immediate care needs in the home setting",
      "Vitals monitoring and observation notes for the family",
      "Wound care and dressing support as appropriate to the nurse’s scope",
      "Administration of prescribed injections when ordered by a clinician",
      "Support with nursing care plans shared by the treating doctor",
      "Coordination updates for family decision-makers",
    ],
    activities: [
      "Checking temperature, pulse, blood pressure and other relevant vitals",
      "Maintaining clean technique for dressings where applicable",
      "Supporting hygiene for patients with limited independence",
      "Encouraging adherence to clinician-directed care routines",
      "Documenting observations the family can share with their doctor",
      "Escalating urgent concerns to the family immediately",
    ],
    howArranged: [
      "Call or message CareNest with the nursing tasks required and any discharge notes.",
      "We confirm whether visit-based or shift-based nursing support fits better.",
      "Suitable nursing support is arranged for your Pune address.",
      "Ongoing coordination helps adjust the plan as recovery progresses.",
    ],
    benefits: [
      "Clinical tasks can be handled at home when suitable",
      "Less strain travelling to facilities for routine nursing needs",
      "Family stays informed through coordinated updates",
      "Care happens in a familiar environment",
    ],
    whyCareNest: [
      "Clear scoping of nursing versus caregiver tasks",
      "Respect for clinician instructions provided by the family",
      "Pune-centred service coordination",
      "Straightforward enquiry via call, WhatsApp or form",
    ],
    puneContext:
      "From central Pune to emerging residential corridors, home nursing helps families continue recovery plans without repeated facility visits when a nurse at home is appropriate.",
    safety: [
      "Home nursing does not replace emergency departments or ICU-level hospital care",
      "Nurses follow scope-of-practice limits and clinician orders shared by the family",
      "Infection-prevention habits are expected for wound and invasive care tasks",
      "Unexpected deterioration should prompt emergency services and clinician contact",
    ],
    enquire:
      "Share the nursing tasks your doctor recommended. CareNest will discuss home nursing support in Pune.",
    faqs: [
      {
        q: "Is home nursing available for one-time visits?",
        a: "Often yes for defined tasks such as a dressing or injection. Tell us what is required and we will confirm.",
      },
      {
        q: "Do you provide doctors at home?",
        a: "CareNest focuses on nursing and care support services listed on this website. For medical consultation, follow your treating clinician’s advice.",
      },
      {
        q: "Can nurses handle catheter or Ryle’s tube care?",
        a: "Some nursing tasks can be supported when appropriate and ordered. Describe the exact need so we can confirm suitability.",
      },
      {
        q: "What should we keep ready at home?",
        a: "Discharge summary, prescription list, consumables advised by your clinician, and a clean care space help nursing visits go smoothly.",
      },
      {
        q: "How is home nursing different from 24×7 nursing care?",
        a: "Home nursing may be visit-based or shift-based. 24×7 nursing care is for continuous nursing presence when that level of cover is needed and arranged.",
      },
      {
        q: "Will the nurse coordinate with our doctor?",
        a: "Families usually remain the link with their treating doctor. Nurses can provide observation notes you may share with your clinician.",
      },
    ],
  },
  {
    slug: "24x7-nursing-care",
    name: "24×7 Nursing Care",
    shortName: "24×7 Nursing",
    navLabel: "24×7 Nursing Care",
    tagline: "Round-the-clock nursing presence when continuous cover is needed.",
    summary:
      "24×7 nursing care in Pune for patients who need continuous skilled nursing presence at home, arranged with clear family coordination.",
    title: "24×7 Nursing Care at Home in Pune | CareNest Home Health",
    description:
      "Arrange 24×7 nursing care at home in Pune with CareNest — continuous nursing support and family coordination. Call or WhatsApp to enquire.",
    image: "/brand-kit/images/nursing-care.jpg",
    imageAlt: "Nurse providing continuous nursing care support at a patient’s home",
    related: ["home-nursing", "bedridden-patient-care", "post-operative-care", "paralysis-care"],
    overview: [
      "24×7 nursing care is for situations where intermittent visits are not enough and the patient needs skilled nursing presence across day and night shifts.",
      "CareNest arranges continuous nursing cover in Pune after understanding the clinical tasks involved, household setup and family expectations.",
      "This service is about vigilant nursing support at home — not a claim to replace hospital intensive care.",
    ],
    whoNeeds: [
      "Patients who need continuous nursing observation at home",
      "Families managing complex care routines around the clock",
      "Bedridden patients with nursing requirements beyond attendant help",
      "Post-operative cases where clinicians advise ongoing nursing supervision",
      "Households that need night and day nursing handover continuity",
    ],
    includes: [
      "Round-the-clock nursing presence arranged in shifts",
      "Ongoing vitals observation and nursing notes for the family",
      "Support with prescribed nursing procedures within scope",
      "Assistance with hygiene, positioning and comfort care",
      "Timely escalation of concerns to the family",
      "Handover discipline between nursing shifts",
    ],
    activities: [
      "Scheduled vitals checks through the day and night as appropriate",
      "Position changes to support comfort and skin care routines",
      "Medication reminders or nursing administration as prescribed",
      "Maintaining a calm night environment for rest",
      "Recording notable changes for family and clinician review",
      "Coordinating with household members on supplies and access",
    ],
    howArranged: [
      "Discuss the patient’s condition, nursing tasks and home environment with CareNest.",
      "We confirm whether continuous nursing is appropriate versus other support levels.",
      "Shift-based nursing cover is arranged with clear start timing.",
      "Coordinators remain available for service follow-up and adjustments.",
    ],
    benefits: [
      "Continuous skilled presence when the care plan requires it",
      "Reduced burden on family members overnight",
      "More consistent observation than ad-hoc arrangements",
      "Structured handovers instead of fragmented cover",
    ],
    whyCareNest: [
      "We set expectations honestly about what home-based nursing can provide",
      "Coordination is built for families, not only for shift logistics",
      "Pune service focus with practical scheduling discussions",
      "Easy escalation path via phone and WhatsApp",
    ],
    puneContext:
      "For Pune families managing serious home care after discharge, 24×7 nursing cover can make staying at home feasible when clinicians agree home-based nursing support is appropriate.",
    safety: [
      "24×7 nursing at home is not ICU-at-home or ventilator ICU substitution",
      "Emergency medical services must be called for life-threatening events",
      "Families should keep treating clinician contacts accessible",
      "Home power, lighting and basic care supplies affect safe nursing delivery",
    ],
    enquire:
      "If you need continuous nursing support at home in Pune, contact CareNest to discuss suitability and arrangement.",
    faqs: [
      {
        q: "Is 24×7 nursing the same as ICU at home?",
        a: "No. CareNest provides nursing and care support services. We do not advertise ICU-at-home or critical-care hospital substitution.",
      },
      {
        q: "How are shifts structured?",
        a: "Continuous cover is typically arranged through nursing shifts with handover. Exact patterns are confirmed when we discuss your case.",
      },
      {
        q: "Can we start with nights only?",
        a: "If you need night nursing rather than full continuous cover, tell us. We will discuss what can be arranged.",
      },
      {
        q: "What clinical information should we share?",
        a: "Discharge summary, current prescriptions, device or wound care needs, and mobility status help us plan appropriately.",
      },
      {
        q: "Will a care coordinator stay in touch?",
        a: "Yes. Service coordination and follow-up are part of how CareNest works with families.",
      },
      {
        q: "What if the patient improves?",
        a: "We can discuss stepping down to home nursing visits, caregiver support or other suitable services.",
      },
    ],
  },
  {
    slug: "post-operative-care",
    name: "Post-Operative Care",
    shortName: "Post-Operative Care",
    navLabel: "Post-Operative Care",
    tagline: "Supportive recovery care after surgery, at home.",
    summary:
      "Post-operative care at home in Pune to help patients follow recovery routines, manage daily needs and receive appropriate nursing or care support after surgery.",
    title: "Post-Operative Care at Home in Pune | CareNest Home Health",
    description:
      "CareNest post-operative care in Pune supports recovery at home with nursing or caregiver assistance arranged around your surgeon’s guidance. Enquire now.",
    image: "/brand-kit/images/patient-care.jpg",
    imageAlt: "Patient receiving post-operative support during recovery at home",
    related: ["home-nursing", "24x7-nursing-care", "bedridden-patient-care", "caregiver-services"],
    overview: [
      "After surgery, many patients recover better in a quiet home setting — provided the right support is available for wound care, mobility, medication routines and daily living help.",
      "CareNest arranges post-operative care support in Pune aligned with the instructions families receive from their surgeon or hospital team.",
      "We focus on practical recovery support and observation, not on promising surgical outcomes.",
    ],
    whoNeeds: [
      "Patients discharged after planned or emergency surgery",
      "People who need help with wound care and mobility during recovery",
      "Individuals advised to limit exertion for a period after an operation",
      "Families who cannot provide full-day assistance alone",
      "Patients needing nursing observation in the early recovery phase",
    ],
    includes: [
      "Support with personal care while mobility is limited",
      "Nursing assistance for dressings and vitals when required",
      "Help following activity restrictions shared by the clinician",
      "Medication reminders based on the discharge prescription",
      "Assistance with safe transfers and short walks as advised",
      "Family updates on comfort and notable changes",
    ],
    activities: [
      "Helping the patient change position comfortably",
      "Supporting hygiene while protecting surgical sites as instructed",
      "Encouraging rest and paced activity per clinician guidance",
      "Monitoring for concerning symptoms the family should report to the doctor",
      "Keeping the recovery space organised and accessible",
      "Assisting with nutrition and hydration routines the family sets",
    ],
    howArranged: [
      "Share the type of surgery (at a high level), discharge instructions and support hours needed.",
      "We recommend nursing, caregiver or attendant support based on tasks involved.",
      "Care begins at home with attention to the recovery plan you provide.",
      "Follow-up helps adapt support as independence improves.",
    ],
    benefits: [
      "Recovery support in a familiar environment",
      "Less strain on family caregivers during a demanding period",
      "Help sticking to clinician-directed routines",
      "A clearer bridge between hospital discharge and everyday life",
    ],
    whyCareNest: [
      "We plan support around your discharge notes rather than generic scripts",
      "Honest distinction between nursing and non-clinical help",
      "Responsive coordination for Pune homes",
      "Simple enquiry process for urgent post-discharge needs",
    ],
    puneContext:
      "Pune’s major hospitals discharge many patients who still need structured help at home. Post-operative care support helps families continue recovery plans in their own neighbourhoods.",
    safety: [
      "Sudden bleeding, breathing difficulty or collapse requires emergency care immediately",
      "Wound care must follow clinician technique and material guidance",
      "CareNest does not alter surgical advice — follow your operating team",
      "Inform us of drains, restrictions and red-flag symptoms listed at discharge",
    ],
    enquire:
      "Recovering after surgery in Pune? Tell us what support your discharge plan requires and we will discuss options.",
    faqs: [
      {
        q: "When should post-operative home care start?",
        a: "Often on the day of discharge or the next day, depending on hospital advice and home readiness. Contact us as soon as you know the discharge timing.",
      },
      {
        q: "Do you guarantee faster healing?",
        a: "No. We provide supportive care. Healing timelines depend on the surgery, clinician guidance and individual factors.",
      },
      {
        q: "Can you help after orthopaedic surgery?",
        a: "Yes, many families request support after orthopaedic procedures. Share mobility restrictions and nursing needs so we can plan appropriately.",
      },
      {
        q: "What if staples or sutures need removal?",
        a: "Follow your surgeon’s plan. If nursing assistance is appropriate for a scheduled removal, discuss it with us and your clinician.",
      },
      {
        q: "Is physiotherapy included?",
        a: "Physiotherapy is not listed as a standalone CareNest service. We can support daily routines and remind patients of exercises their clinician prescribed.",
      },
      {
        q: "How long is post-operative support needed?",
        a: "It varies widely. Many families start with more intensive help and reduce support as independence returns.",
      },
    ],
  },
  {
    slug: "bedridden-patient-care",
    name: "Bedridden Patient Care",
    shortName: "Bedridden Care",
    navLabel: "Bedridden Patient Care",
    tagline: "Attentive care for patients with limited mobility.",
    summary:
      "Bedridden patient care in Pune focused on comfort, hygiene, positioning support and dependable assistance for people who spend most of their time in bed.",
    title: "Bedridden Patient Care at Home in Pune | CareNest Home Health",
    description:
      "CareNest provides bedridden patient care at home in Pune — hygiene, positioning support and coordinated assistance. Call or WhatsApp to enquire.",
    image: "/brand-kit/images/patient-care.jpg",
    imageAlt: "Care support for a bedridden patient in a home bedroom setting",
    related: ["attendant-services", "caregiver-services", "home-nursing", "paralysis-care"],
    overview: [
      "Bedridden patient care addresses the daily realities of limited mobility: skin comfort, hygiene, feeding support, safe positioning and vigilant observation.",
      "CareNest arranges home-based support for bedridden patients in Pune, working from the family’s care goals and any clinical instructions they share.",
      "The emphasis is on dignity, prevention of avoidable discomfort, and reducing caregiver burnout in the household.",
    ],
    whoNeeds: [
      "Patients who cannot get out of bed without substantial help",
      "People with advanced frailty or neurological weakness",
      "Individuals recovering from illness who are temporarily bedbound",
      "Families needing trained hands for hygiene and repositioning",
      "Households supporting long-term home-bound care",
    ],
    includes: [
      "Assistance with bed baths and personal hygiene",
      "Support with repositioning and comfort alignment",
      "Help with feeding or supervised meals as needed",
      "Oral care and grooming support",
      "Observation of skin condition and reporting concerns",
      "Coordination with nursing support when clinical tasks are required",
    ],
    activities: [
      "Scheduled position changes to improve comfort",
      "Keeping bedding clean and dry",
      "Supporting range-of-motion reminders if a clinician provided a plan",
      "Monitoring intake and reporting poor appetite or reduced fluids to the family",
      "Maintaining a respectful, calm bedside manner",
      "Assisting with bedpan or incontinence care as required",
    ],
    howArranged: [
      "Describe mobility level, nursing needs and preferred care hours.",
      "We identify whether attendant, caregiver, nursing or combined support is suitable.",
      "Bedside care support is arranged at your Pune home.",
      "Follow-up helps refine routines that work for the patient and family.",
    ],
    benefits: [
      "More consistent hygiene and comfort routines",
      "Practical relief for family caregivers",
      "Earlier awareness of concerning changes",
      "Care that protects privacy and personal dignity",
    ],
    whyCareNest: [
      "We treat bedridden care as skilled, respectful work — not an afterthought",
      "Clear escalation to nursing when clinical tasks appear",
      "Family-centred updates",
      "Pune coordination with realistic scheduling conversations",
    ],
    puneContext:
      "Many Pune families care for bedridden relatives in apartments where space is limited. Organised home care support helps maintain cleanliness, comfort and safer daily routines.",
    safety: [
      "Pressure injuries and infections need clinician attention — we encourage prompt medical advice",
      "Safe lifting matters; share any hospital guidance on transfers",
      "Choking risk during feeding should be discussed upfront",
      "Emergency symptoms require calling emergency services",
    ],
    enquire:
      "If someone in your family is bedridden and needs structured home support in Pune, contact CareNest to discuss care options.",
    faqs: [
      {
        q: "Do you provide medical equipment?",
        a: "Medical equipment rental is not a CareNest service on this site. Families usually arrange beds or cushions via their clinician’s recommendation or suppliers.",
      },
      {
        q: "Can bedridden care include nursing?",
        a: "Yes, when nursing tasks are needed we discuss home nursing or continuous nursing options alongside bedside support.",
      },
      {
        q: "How often should positioning happen?",
        a: "Follow clinician advice. Families often use a regular repositioning routine; we align with the plan you share.",
      },
      {
        q: "Is this suitable for palliative situations?",
        a: "We can discuss comfort-focused bedside support. We do not market separate palliative or cancer programmes as standalone services.",
      },
      {
        q: "What training do caregivers have for bedridden patients?",
        a: "Assignments consider hygiene, mobility assistance and dignity. Share specific clinical needs so we arrange the right skill mix.",
      },
      {
        q: "Can care be increased temporarily during an infection or fever?",
        a: "Yes — contact your coordinator to discuss short-term changes.",
      },
    ],
  },
  {
    slug: "dementia-care",
    name: "Dementia Care",
    shortName: "Dementia Care",
    navLabel: "Dementia Care",
    tagline: "Patient, structured support for dementia at home.",
    summary:
      "Dementia care support in Pune for families seeking calm routines, safety-minded supervision and compassionate assistance at home.",
    title: "Dementia Care at Home in Pune | CareNest Home Health",
    description:
      "CareNest dementia care at home in Pune focuses on routine support, supervision and family coordination for people living with dementia. Enquire today.",
    image: "/brand-kit/images/elder-care.jpg",
    imageAlt: "Compassionate home support for a person living with dementia",
    related: ["alzheimer-care", "elder-care", "caregiver-services", "attendant-services"],
    overview: [
      "Dementia changes how a person experiences memory, communication and daily tasks. Home-based dementia care aims to preserve familiarity while adding the supervision and assistance families cannot always provide alone.",
      "CareNest supports Pune families with dementia care assistance focused on routine, patience and safety awareness — not on promising cognitive recovery.",
      "We work with the family’s knowledge of triggers, preferences and calming strategies that already work for their loved one.",
    ],
    whoNeeds: [
      "People with diagnosed or suspected dementia needing daily supervision",
      "Seniors who become disoriented when left alone",
      "Families managing sundowning-related evening challenges",
      "Households needing help with personal care for someone with memory loss",
      "Care partners seeking respite while remaining involved",
    ],
    includes: [
      "Supervision oriented toward safety and reassurance",
      "Help with personal care delivered at the person’s pace",
      "Support maintaining simple daily routines",
      "Companionship that reduces isolation and agitation where possible",
      "Reminders for meals, hydration and prescribed medicines",
      "Observation notes for the family",
    ],
    activities: [
      "Using familiar cues and calm communication",
      "Assisting with dressing and hygiene without rushing",
      "Engaging in simple, meaningful activities the person enjoys",
      "Redirecting gently when confusion causes distress",
      "Supporting safe movement within the home",
      "Sharing patterns of behaviour changes with the family",
    ],
    howArranged: [
      "Talk through diagnosis stage (as you understand it), behaviours and home risks with CareNest.",
      "We discuss caregiver or attendant support and whether nursing input is also needed.",
      "Support is arranged with emphasis on continuity where possible.",
      "Families can refine routines with the coordinator over time.",
    ],
    benefits: [
      "Familiar home environment that can feel safer than sudden relocation",
      "Structured help for exhausting daily care tasks",
      "Another attentive adult present for supervision",
      "Space for family members to rest without withdrawing from care",
    ],
    whyCareNest: [
      "We listen to the person’s history and preferences, not only a checklist",
      "No exaggerated claims about reversing dementia",
      "Coordination that respects family caregivers as partners",
      "Pune-focused arrangement and follow-up",
    ],
    puneContext:
      "In Pune’s multi-generational homes, dementia care support helps working adults and spouses sustain care with less isolation — while the person remains among known rooms, voices and routines.",
    safety: [
      "Wandering risk, kitchen hazards and medication mishaps should be discussed at intake",
      "Sudden confusion with fever or head injury needs urgent medical review",
      "CareNest support does not replace specialist medical care for dementia",
      "Physical restraint is not an acceptable care approach",
    ],
    enquire:
      "If dementia is affecting daily life at home in Pune, contact CareNest to discuss supportive care options.",
    faqs: [
      {
        q: "Is dementia care different from Alzheimer’s care?",
        a: "Alzheimer’s disease is one cause of dementia. Our Alzheimer’s care page focuses on that condition; dementia care covers broader memory and cognition support needs. Overlap is common.",
      },
      {
        q: "Can you manage aggressive behaviour?",
        a: "Tell us what is happening. We discuss whether home support is appropriate and when clinical advice is needed. Safety for the patient and caregiver comes first.",
      },
      {
        q: "Do you provide memory therapy programmes?",
        a: "We provide supportive home care and engagement. Formal therapies should be guided by qualified clinicians.",
      },
      {
        q: "How do you reduce sundowning stress?",
        a: "By keeping evenings calm, maintaining routines and following strategies the family already finds helpful. We do not claim a universal cure for sundowning.",
      },
      {
        q: "Should someone with dementia be left with a new caregiver immediately?",
        a: "A gradual introduction and family briefing usually helps. We encourage a clear handover of preferences and triggers.",
      },
      {
        q: "Can nursing support be added?",
        a: "Yes, if clinical nursing tasks are required alongside dementia support.",
      },
    ],
  },
  {
    slug: "alzheimer-care",
    name: "Alzheimer’s Care",
    shortName: "Alzheimer’s Care",
    navLabel: "Alzheimer’s Care",
    tagline: "Gentle, consistent support for Alzheimer’s at home.",
    summary:
      "Alzheimer’s care at home in Pune with emphasis on familiar routines, personal care assistance and compassionate supervision for families.",
    title: "Alzheimer’s Care at Home in Pune | CareNest Home Health",
    description:
      "CareNest Alzheimer’s care in Pune offers home-based support, supervision and family coordination for people living with Alzheimer’s. Call or WhatsApp to enquire.",
    image: "/brand-kit/images/elder-care.jpg",
    imageAlt: "Family-centred Alzheimer’s care support in a home environment",
    related: ["dementia-care", "elder-care", "caregiver-services", "home-nursing"],
    overview: [
      "Alzheimer’s disease affects memory, judgement and independence over time. Home care support can help families maintain dignity and structure as needs evolve.",
      "CareNest arranges Alzheimer’s care support in Pune grounded in patience, routine and clear family communication.",
      "We avoid miracle claims. Our role is practical, respectful assistance that helps daily life work more smoothly.",
    ],
    whoNeeds: [
      "People diagnosed with Alzheimer’s who need daily living help",
      "Families noticing increasing forgetfulness and safety risks at home",
      "Spouses who need respite while remaining the primary care partner",
      "Households seeking consistent supervision during work hours",
      "Patients who become unsettled with unfamiliar institutional settings",
    ],
    includes: [
      "Personal care assistance adapted to cognitive changes",
      "Routine-based daily structure",
      "Safety-minded supervision inside the home",
      "Companionship and reassurance",
      "Medication reminders per family or clinician instructions",
      "Updates when behaviour or appetite patterns change",
    ],
    activities: [
      "Supporting familiar morning and evening rituals",
      "Offering simple choices to preserve autonomy where possible",
      "Using calm tone and short, clear instructions",
      "Assisting with meals and hydration",
      "Encouraging safe, light engagement the person still enjoys",
      "Helping the home stay predictable and uncluttered in care areas",
    ],
    howArranged: [
      "Share diagnosis details you are comfortable providing, current challenges and preferred hours.",
      "CareNest discusses suitable caregiver support and continuity options.",
      "Home support begins with a thorough family briefing.",
      "Plans are reviewed as symptoms and family needs change.",
    ],
    benefits: [
      "Care in a known environment that can reduce distress",
      "Help with intimate care tasks that become difficult over time",
      "A steadier day structure for the person and the family",
      "Practical partnership for spouses and adult children",
    ],
    whyCareNest: [
      "Respectful language and approach — the person is not defined only by diagnosis",
      "No fabricated success statistics",
      "Coordination that includes the family’s experience as expertise",
      "Accessible contact channels for Pune families",
    ],
    puneContext:
      "Alzheimer’s care at home is increasingly requested by Pune families who want their parent or spouse to remain in a neighbourhood and household they recognise, with added daytime or ongoing support.",
    safety: [
      "Door security, gas knobs and medication storage should be reviewed with the family",
      "Unexplained injuries or sudden decline require medical attention",
      "CareNest does not provide experimental treatments",
      "Driver or outdoor escort needs should be discussed separately for safety planning",
    ],
    enquire:
      "For Alzheimer’s care support at home in Pune, contact CareNest. We will listen first, then discuss suitable assistance.",
    faqs: [
      {
        q: "Why is your URL alzheimer-care not alzheimers-care?",
        a: "We preserve the existing indexed URL for continuity. Both spellings refer to the same CareNest Alzheimer’s care page.",
      },
      {
        q: "Can home care replace a specialist doctor?",
        a: "No. Continue follow-up with your treating clinician. We provide supportive care at home.",
      },
      {
        q: "What stage of Alzheimer’s do you support?",
        a: "Families contact us across different stages. We assess whether home support is appropriate for the current behaviours and care load.",
      },
      {
        q: "How do you handle repeated questions or confusion?",
        a: "With patience, reassurance and consistent answers aligned to the family’s approach — not argument or embarrassment.",
      },
      {
        q: "Is night support available?",
        a: "Discuss night-time needs with us. Arrangement depends on the care plan and availability.",
      },
      {
        q: "Can the same caregiver continue long term?",
        a: "Continuity is especially valuable in Alzheimer’s care. We prioritise it whenever feasible.",
      },
    ],
  },
  {
    slug: "paralysis-care",
    name: "Paralysis Care",
    shortName: "Paralysis Care",
    navLabel: "Paralysis Care",
    tagline: "Mobility-aware support for paralysis-related needs at home.",
    summary:
      "Paralysis care support in Pune for personal care, positioning, mobility assistance and nursing coordination when weakness or paralysis affects daily living.",
    title: "Paralysis Care at Home in Pune | CareNest Home Health",
    description:
      "CareNest paralysis care at home in Pune helps with personal care, positioning and coordinated support for mobility-limited patients. Enquire by call or WhatsApp.",
    image: "/brand-kit/images/physiotherapy.jpg",
    imageAlt: "Home care support for a person with mobility limitation due to paralysis",
    related: ["bedridden-patient-care", "attendant-services", "home-nursing", "post-operative-care"],
    overview: [
      "Paralysis or significant weakness changes every part of daily living — from turning in bed to bathing and communicating needs. Home care support focuses on safe assistance and comfort.",
      "CareNest arranges paralysis-related care support in Pune based on the person’s mobility level and the guidance families receive from their clinicians.",
      "We support daily care; specialised rehabilitation therapies remain under the direction of the patient’s qualified clinicians when prescribed.",
    ],
    whoNeeds: [
      "People with partial or complete paralysis needing daily assistance",
      "Patients recovering from neurological events with residual weakness",
      "Individuals who need help with transfers and personal hygiene",
      "Families managing long-term mobility limitation at home",
      "Patients who require nursing plus attendant support together",
    ],
    includes: [
      "Assistance with transfers and positioning",
      "Personal hygiene support adapted to mobility limits",
      "Skin observation and comfort care",
      "Help during meals when hand or swallowing stamina is limited",
      "Support following clinician-shared home exercise reminders",
      "Coordination with nursing for clinical tasks when needed",
    ],
    activities: [
      "Careful log-rolling or transfer help as instructed",
      "Supporting sitting tolerance if clinically advised",
      "Assisting with compression garments or braces only if the family is trained and asks for help within safe limits",
      "Encouraging participation in self-care where residual ability exists",
      "Keeping frequently used items within reach",
      "Reporting pain, swelling or new weakness to the family promptly",
    ],
    howArranged: [
      "Explain mobility status, communication ability and nursing requirements.",
      "We recommend attendant, caregiver, nursing or combined support.",
      "Home care is arranged with attention to equipment the family already uses (wheelchair, walker, hospital bed).",
      "Follow-up supports changes during recovery or long-term care.",
    ],
    benefits: [
      "Safer daily assistance for transfers and hygiene",
      "More consistent comfort and skin care routines",
      "Family relief from round-the-clock physical strain",
      "Home-based support that respects independence goals set with clinicians",
    ],
    whyCareNest: [
      "We plan around real mobility constraints rather than generic elder-care scripts",
      "Clear about what is care support versus clinical rehabilitation",
      "Responsive Pune coordination",
      "Respectful communication with patients who may have speech or fatigue challenges",
    ],
    puneContext:
      "Paralysis care at home is a frequent need for Pune families after neurological illness or injury, especially when outpatient therapy visits are only part of the week and daily living help is still required.",
    safety: [
      "Incorrect transfers can cause injury — share training your hospital provided",
      "Breathing difficulty, chest pain or sudden deterioration needs emergency care",
      "CareNest does not claim to restore movement or replace physiotherapy clinics",
      "Aspiration risk during feeding must be flagged during intake",
    ],
    enquire:
      "Tell us about mobility and daily support needs. CareNest will discuss paralysis care assistance for your home in Pune.",
    faqs: [
      {
        q: "Do you provide physiotherapy for paralysis?",
        a: "Physiotherapy is not offered as a standalone CareNest service. We can support daily care and remind patients of exercises prescribed by their clinician.",
      },
      {
        q: "Can you help after a stroke?",
        a: "Many families seek support for weakness after neurological events. We provide care assistance; stroke rehabilitation programmes are clinician-led.",
      },
      {
        q: "What if the patient cannot speak clearly?",
        a: "Share communication methods that work — gestures, boards or routines. Caregivers should follow the family’s approach.",
      },
      {
        q: "Is hospital bed experience required?",
        a: "Helpful but not always essential. Describe the home setup so we arrange suitable support.",
      },
      {
        q: "Can nursing and attendant support combine?",
        a: "Yes. Mixed plans are common when clinical and personal care needs coexist.",
      },
      {
        q: "How do we prevent pressure sores?",
        a: "Follow clinician guidance on repositioning and skin care. Our support can help execute the routine you are given and report skin changes early.",
      },
    ],
  },
  {
    slug: "mother-baby-care",
    name: "Mother & Baby Care",
    shortName: "Mother & Baby Care",
    navLabel: "Mother & Baby Care",
    tagline: "Supportive postnatal care for mothers and newborns at home.",
    summary:
      "Mother and baby care support in Pune for postnatal recovery, newborn care assistance and practical help during the early weeks at home.",
    title: "Mother & Baby Care at Home in Pune | CareNest Home Health",
    description:
      "CareNest mother and baby care in Pune offers postnatal and newborn care support at home with family coordination. Call or WhatsApp to enquire.",
    image: "/brand-kit/images/home-care.jpg",
    imageAlt: "Postnatal mother and baby care support in a home setting",
    related: ["caregiver-services", "home-nursing", "attendant-services", "elder-care"],
    overview: [
      "The early postnatal period can be physically demanding and emotionally intense. Mother and baby care support helps new parents with practical newborn care and recovery assistance at home.",
      "CareNest arranges mother and baby care support in Pune with respect for family parenting choices, privacy and clinician guidance from the obstetric or paediatric team.",
      "We provide supportive care — not medical replacement for your doctor or paediatrician.",
    ],
    whoNeeds: [
      "Mothers recovering from vaginal birth or caesarean delivery",
      "Families welcoming a newborn who want experienced hands at home",
      "Parents with limited local family support",
      "Households managing twins or a recovering mother with mobility limits",
      "Families who need night or daytime help with newborn routines",
    ],
    includes: [
      "Newborn care assistance such as bathing support and diapering help",
      "Support for the mother’s personal care and rest",
      "Help with feeding routines as guided by the family and clinician advice",
      "Light care-related organisation of the baby’s space",
      "Observation and prompt reporting of concerns to parents",
      "Encouragement of rest and recovery for the mother",
    ],
    activities: [
      "Assisting with newborn hygiene using family-preferred methods",
      "Supporting burping, swaddling and settling routines the parents choose",
      "Helping the mother move comfortably after caesarean recovery when needed",
      "Encouraging hydration and meals for the mother",
      "Keeping feeding and diaper supplies organised",
      "Giving parents clear handovers at shift changes",
    ],
    howArranged: [
      "Share expected delivery or discharge timing, type of birth and hours of help needed.",
      "We discuss suitable support and start dates around your hospital discharge.",
      "Mother and baby care support is arranged at home in Pune.",
      "Parents can adjust timing as confidence and recovery grow.",
    ],
    benefits: [
      "Practical help during a sleepless, physically demanding phase",
      "Support that lets parents learn hands-on rather than feel replaced",
      "More rest for the recovering mother",
      "A calmer transition from hospital to home",
    ],
    whyCareNest: [
      "Respect for breastfeeding or formula choices guided by parents and clinicians",
      "Privacy-conscious care in the family home",
      "Clear boundaries — we do not override paediatric advice",
      "Straightforward Pune coordination for new parents",
    ],
    puneContext:
      "Nuclear families in Pune often need extra hands after delivery when grandparents live in another city. Mother and baby care support fills that practical gap at home.",
    safety: [
      "Newborn fever, poor feeding, breathing concerns or maternal heavy bleeding require urgent medical care",
      "Safe sleep guidance from your paediatrician should be followed",
      "CareNest does not replace lactation consultants or obstetric follow-up",
      "Hygiene standards for newborn care are essential — discuss household expectations at start",
    ],
    enquire:
      "Expecting or recently home with your baby in Pune? Contact CareNest to discuss mother and baby care support.",
    faqs: [
      {
        q: "Can support begin immediately after discharge?",
        a: "Often yes if you contact us before discharge with timing and requirements. We confirm availability when you enquire.",
      },
      {
        q: "Do you provide lactation consultancy?",
        a: "We provide supportive care around feeding routines parents already follow. Specialist lactation advice should come from qualified professionals.",
      },
      {
        q: "Is caesarean recovery support included?",
        a: "Help with the mother’s mobility and personal care after caesarean is a common request. Share your surgeon’s restrictions.",
      },
      {
        q: "Can you support night feeds?",
        a: "Discuss night schedules with us. Arrangement depends on the plan you want and availability.",
      },
      {
        q: "Do you only support newborn care, not the mother?",
        a: "Mother and baby care intentionally supports both — newborn assistance and maternal recovery help.",
      },
      {
        q: "How long do families usually continue this service?",
        a: "Many families use support for the early weeks and then taper. Your timeline can be flexible based on recovery and confidence.",
      },
    ],
  },
];

export const getServiceBySlug = (slug: string) =>
  SERVICES.find((s) => s.slug === slug);

export const getRelatedServices = (slug: ServiceSlug) => {
  const service = getServiceBySlug(slug);
  if (!service) return [];
  return service.related
    .map((r) => getServiceBySlug(r))
    .filter((s): s is ServiceContent => Boolean(s));
};
