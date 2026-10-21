import { z } from "zod";

/**
 * Contact and visit-request forms.
 *
 * Today both hand off to WhatsApp: the form builds a message and the visitor
 * chooses whether to send it. Nothing is stored or sent by this site. To route
 * requests to email or a CRM instead, validate the same schemas in a server
 * action and keep the WhatsApp hand-off as the fallback (docs/COMMERCE.md).
 */

const name = z.string().trim().min(2, "Please tell us your name.").max(80, "Please keep your name under 80 characters.");

const phone = z
  .string()
  .trim()
  .max(24, "That number looks too long.")
  .refine((v) => !v || /^\+?[\d\s()-]{7,}$/.test(v), "Enter a number we can call, or leave this blank.");

/* ───────────────────────────── Contact ───────────────────────────── */

export const CONTACT_TOPICS = [
  "A piece I saw online",
  "Sizes and fit",
  "Dressing for an occasion",
  "Visiting the showroom",
  "Something else",
] as const;

export const contactSchema = z.object({
  name,
  topic: z.enum(CONTACT_TOPICS, { error: "Choose what your message is about." }),
  message: z.string().trim().min(10, "Tell us a little more — at least a sentence.").max(1000, "Please keep your message under 1,000 characters."),
});

export type ContactInput = z.infer<typeof contactSchema>;

export function contactMessage({ name, topic, message }: ContactInput): string {
  return [
    "Hello Digne Suits & More, I found your website and would like to get in touch.",
    `Name: ${name}`,
    `About: ${topic}`,
    "",
    message,
  ].join("\n");
}

/* ───────────────────────────── Visit request ───────────────────────────── */

export const VISIT_TIMES = ["Morning", "Afternoon", "Evening"] as const;

export const VISIT_OCCASIONS = [
  "A wedding",
  "Work and business",
  "A celebration or event",
  "A new everyday wardrobe",
  "Just browsing",
] as const;

export const PARTY_SIZES = ["Just me", "Two of us", "3–5 people", "6 or more"] as const;

/** Today in the visitor's time zone, as YYYY-MM-DD (the value format of <input type="date">). */
export function todayISO(now = new Date()): string {
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
}

export const visitSchema = z.object({
  name,
  phone,
  date: z
    .string()
    .min(1, "Choose a preferred date.")
    .refine((v) => /^\d{4}-\d{2}-\d{2}$/.test(v), "Choose a preferred date.")
    .refine((v) => v >= todayISO(), "Choose today or a later date."),
  time: z.enum(VISIT_TIMES, { error: "Choose a time of day." }),
  occasion: z.enum(VISIT_OCCASIONS, { error: "Choose what you’re dressing for." }),
  party: z.enum(PARTY_SIZES, { error: "Tell us how many are coming." }),
  includeBag: z.boolean(),
  notes: z.string().trim().max(600, "Please keep notes under 600 characters."),
});

export type VisitInput = z.infer<typeof visitSchema>;

export function formatVisitDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date(y, m - 1, d));
}

export function visitMessage(input: VisitInput, pieces: string[] = []): string {
  const lines = [
    "Hello Digne Suits & More, I found your website and would like to request a visit to the showroom.",
    `Name: ${input.name}`,
    `Preferred date: ${formatVisitDate(input.date)} (${input.time.toLowerCase()})`,
    `Dressing for: ${input.occasion}`,
    `Coming: ${input.party}`,
  ];
  if (input.phone) lines.push(`Best number to reach me: ${input.phone}`);
  if (input.includeBag && pieces.length) {
    lines.push("", "Pieces I’d like to see:", ...pieces.map((p, i) => `${i + 1}. ${p}`));
  }
  if (input.notes) lines.push("", input.notes);
  lines.push("", "Could you let me know if this time works?");
  return lines.join("\n");
}
