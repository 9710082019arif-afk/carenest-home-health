import { COMPANY } from "@/data/content";

/** Canonical phone dial link */
export const PHONE_HREF = `tel:+${COMPANY.phoneDigits}`;

/** Pre-filled WhatsApp enquiry message */
export const WHATSAPP_MESSAGE =
  "Hello CareNest, I need information about home care.";

/** Canonical WhatsApp deep link with enquiry text */
export const WHATSAPP_HREF = `https://wa.me/${COMPANY.whatsapp}?text=${encodeURIComponent(
  WHATSAPP_MESSAGE
)}`;

export const PHONE_DISPLAY = COMPANY.phone;
