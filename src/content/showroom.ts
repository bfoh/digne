import type { MediaKey } from "./media";

/** The four showroom photographs, in walking order. Captions describe only what is visible. */
export const showroomScenes: { key: MediaKey; title: string; caption: string }[] = [
  { key: "reception", title: "Reception", caption: "The illuminated Digne emblem, warm light, and shirts folded within reach." },
  { key: "showroom", title: "The lounge", caption: "Emerald velvet and gold — somewhere to sit, consider and take your time." },
  { key: "boutique", title: "The floor", caption: "Shirts, trousers and suits laid out to browse at an easy pace." },
  { key: "suitWall", title: "The suit wall", caption: "Colour by colour — from navy and brown to burgundy and cream." },
];

/** How a visit works. Nothing here promises a service the showroom hasn't confirmed. */
export const visitSteps: { title: string; body: string }[] = [
  {
    title: "Tell us what you’re dressing for",
    body: "A wedding, a new role, a celebration — send a note or a request ahead so the showroom knows what you’re after.",
  },
  { title: "Browse the rails", body: "Suits, blazers, shirts, trousers and occasionwear, arranged by colour and easy to look through." },
  { title: "Try it on", body: "Take your time with fit and colour. Bring a photo of the occasion, the outfit or the person you’re dressing beside." },
  { title: "Confirm the details", body: "Sizes, availability and prices are confirmed with you in person — what you see is what’s on the rail today." },
];
