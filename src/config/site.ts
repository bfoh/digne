/**
 * Verified business facts. Anything not confirmed by Digne is `null` and is
 * listed in docs/BUSINESS-INPUTS.md — never fill these with guesses.
 */
export const site = {
  name: "Digne Suits & More",
  shortName: "Digne",
  /** Proposed creative line for the site — not a verified company slogan. */
  tagline: "The Art of Dressing Well.",
  description:
    "Digne Suits & More is a formalwear boutique in Agbogba, Accra — suits, blazers, shirts, trousers and occasionwear, with personal service in the showroom.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  locale: "en_GH",
  phone: {
    display: "053 504 6945",
    e164: "+233535046945",
    /** wa.me format: country code + number, digits only. */
    whatsapp: "233535046945",
  },
  address: {
    locality: "Agbogba",
    city: "Accra",
    region: "Greater Accra",
    country: "Ghana",
    countryCode: "GH",
  },
  /** From the Google Business profile pin. */
  geo: { latitude: 5.6820259, longitude: -0.1927671 },
  /** Google Business profile — also the destination for every "Get directions" link. */
  mapsUrl:
    "https://www.google.com/maps/place/Digne+Suits+and+more/@5.6820259,-0.195342,17z/data=!3m1!4b1!4m6!3m5!1s0xfdf9da01be1c4f7:0x334c7b3b38c00fc8!8m2!3d5.6820259!4d-0.1927671!16s%2Fg%2F11nvly1jw4",
  /** TODO(business): verified opening hours, e.g. [{ days: "Mon–Sat", opens: "09:00", closes: "19:00" }]. */
  hours: null as null | { days: string; opens: string; closes: string }[],
  /** TODO(business): verified email address for enquiries. */
  email: null as null | string,
  /** TODO(business): verified social profile URLs. Only real, owned accounts. */
  social: [] as { label: string; href: string }[],
} as const;

export const telHref = `tel:${site.phone.e164}`;

export const formattedAddress = `${site.address.locality}, ${site.address.city}, ${site.address.country}`;
