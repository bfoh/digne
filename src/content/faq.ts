import type { Route } from "next";

import { formattedAddress, site } from "@/config/site";
import { route } from "@/lib/route";

export interface Faq {
  question: string;
  /** Plain text — also used for FAQPage structured data. */
  answer: string;
  link?: { href: Route; label: string };
}

export interface FaqGroup {
  title: string;
  items: Faq[];
}

const hours = site.hours
  ? `The showroom is open ${site.hours.map((h) => `${h.days}, ${h.opens}–${h.closes}`).join("; ")}.`
  : "Opening hours aren’t listed here yet, so please call or message ahead to confirm the showroom is open before you travel.";

/**
 * Only questions the site can answer truthfully today. Tailoring, alterations,
 * payment methods and delivery are left out until Digne confirms them
 * (docs/BUSINESS-INPUTS.md).
 */
export const faqGroups: FaqGroup[] = [
  {
    title: "Visiting",
    items: [
      {
        question: "Where is the showroom?",
        answer: `${site.name} is in ${formattedAddress}. The “Get directions” links on this site open the showroom’s Google Maps listing.`,
        link: { href: route("/the-showroom"), label: "Plan your visit" },
      },
      { question: "When is the showroom open?", answer: hours },
      {
        question: "Do I need an appointment?",
        answer:
          "You can request a visit for a particular day and time of day. The request opens in WhatsApp, and your visit is confirmed only when the showroom replies.",
        link: { href: route("/appointments"), label: "Request a visit" },
      },
      {
        question: "I’m dressing a wedding party. Can you help?",
        answer:
          "Tell the showroom about it in a visit request or a message — the date, how many people and the colours you have in mind — and they’ll let you know what they can do.",
        link: { href: route("/appointments"), label: "Request a visit" },
      },
    ],
  },
  {
    title: "Pieces & prices",
    items: [
      {
        question: "Can I buy online?",
        answer:
          "Not yet. You can save pieces and gather them in an enquiry bag, then send the list to the showroom on WhatsApp. Nothing is reserved or charged online.",
        link: { href: route("/collections"), label: "Explore the collections" },
      },
      {
        question: "Why aren’t prices shown?",
        answer: "Prices haven’t been published on the website yet. The showroom will confirm the price of any piece when you enquire or visit.",
      },
      {
        question: "Is a piece I see on the website in stock?",
        answer:
          "The website doesn’t show live stock. The pieces were photographed on the showroom floor, so message or call to check what’s on the rail today.",
      },
      {
        question: "Are the photographs accurate?",
        answer:
          "The photographs show the showroom and its rails, and have been digitally enhanced for the website — so colour and fine detail may differ from the garment itself. Ask for a photo on WhatsApp, or see it in person, before you decide.",
      },
    ],
  },
  {
    title: "Sizes & fit",
    items: [
      {
        question: "What sizes are available?",
        answer:
          "When you enquire you can name the size you usually wear — or choose “Not sure”. The showroom confirms which sizes are available and helps you find the fit when you try pieces on.",
        link: { href: route("/size-guide"), label: "Size guide" },
      },
      {
        question: "Can I return or exchange a piece?",
        answer: "Exchange and returns terms are set by the showroom. Please confirm them when you buy.",
        link: { href: route("/shipping-returns"), label: "Delivery & returns" },
      },
    ],
  },
  {
    title: "This website",
    items: [
      {
        question: "Where are my saved pieces and enquiry bag kept?",
        answer: "In your browser, on this device only. They aren’t sent anywhere until you choose to send an enquiry.",
        link: { href: route("/privacy-policy"), label: "Privacy" },
      },
    ],
  },
];
