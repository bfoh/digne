import type { StaticImageData } from "next/image";

import boutique from "@/assets/images/boutique.webp";
import burgundy from "@/assets/images/burgundy.webp";
import charcoal from "@/assets/images/charcoal.webp";
import embellished from "@/assets/images/embellished.webp";
import maroonCheck from "@/assets/images/maroon-check.webp";
import reception from "@/assets/images/reception.webp";
import showroom from "@/assets/images/showroom.webp";
import suitSelection from "@/assets/images/suit-selection.webp";
import suitWall from "@/assets/images/suit-wall.webp";
import burgundyCuffs from "@/assets/images/details/burgundy-cuffs.webp";
import checkCuffs from "@/assets/images/details/check-cuffs.webp";
import pearl from "@/assets/images/details/pearl.webp";
import royalBlue from "@/assets/images/details/royal-blue.webp";
import safari from "@/assets/images/details/safari.webp";
import shirtShelves from "@/assets/images/details/shirt-shelves.webp";
import suitRails from "@/assets/images/details/suit-rails.webp";
import trouserRail from "@/assets/images/details/trouser-rail.webp";
import waistcoat from "@/assets/images/details/waistcoat.webp";

/**
 * What a photograph shows. Product cards reveal an "on-model" view on hover
 * when one exists, otherwise the piece's second view (usually a "detail").
 * "packshot" and "on-model" are reserved for real product photography.
 */
export type MediaKind = "scene" | "detail" | "packshot" | "on-model";

export interface MediaAsset {
  src: StaticImageData;
  alt: string;
  kind: MediaKind;
  /** CSS object-position for wide / narrow crops. */
  focus: { wide: string; narrow: string };
  /**
   * Every photograph was AI-enhanced from Google Maps screenshots. Garment and
   * interior details may differ from reality, so imagery is used for
   * atmosphere and general styling — never as proof of a specific product.
   */
  integrity?: string;
}

const ENHANCED = "AI-enhanced from a Google Maps screenshot; details may differ from the real garment or interior.";

export const media = {
  burgundy: {
    src: burgundy,
    kind: "scene",
    alt: "Showroom mannequin in a burgundy double-breasted waistcoat and matching trousers, worn with a white shirt and gold tie, beside a gilded column.",
    focus: { wide: "50% 28%", narrow: "50% 22%" },
    integrity: ENHANCED,
  },
  charcoal: {
    src: charcoal,
    kind: "scene",
    alt: "Black short-sleeved safari-style jacket with gold-tone buttons and four flap pockets on a dress form, with burgundy jackets hanging behind.",
    focus: { wide: "50% 35%", narrow: "50% 30%" },
    integrity: `${ENHANCED} The hang tag shows a third-party label that must be verified with Digne before launch.`,
  },
  embellished: {
    src: embellished,
    kind: "scene",
    alt: "Black blazers with pearl-embellished shoulders hanging beside crimson belted jackets on a gold rail.",
    focus: { wide: "60% 35%", narrow: "62% 30%" },
    integrity: ENHANCED,
  },
  suitSelection: {
    src: suitSelection,
    kind: "scene",
    alt: "Jackets on a brass rail in burgundy, grey check, royal blue, cream and black.",
    focus: { wide: "50% 50%", narrow: "70% 50%" },
    integrity: ENHANCED,
  },
  maroonCheck: {
    src: maroonCheck,
    kind: "scene",
    alt: "A row of burgundy and grey check jackets on black hangers along a brass rail.",
    focus: { wide: "50% 50%", narrow: "55% 50%" },
    integrity: ENHANCED,
  },
  reception: {
    src: reception,
    kind: "scene",
    alt: "The Digne reception counter with warm strip lighting, the illuminated Digne logo on the wall behind and folded shirts on lilac shelving.",
    focus: { wide: "40% 40%", narrow: "38% 35%" },
    integrity: ENHANCED,
  },
  showroom: {
    src: showroom,
    kind: "scene",
    alt: "Showroom lounge with emerald velvet chairs and a gold table in front of a wall of suits in burgundy, grey, brown, navy and royal blue.",
    focus: { wide: "50% 55%", narrow: "42% 50%" },
    integrity: ENHANCED,
  },
  boutique: {
    src: boutique,
    kind: "scene",
    alt: "Wide view of the Digne boutique: shirt shelving, emerald seating, a trouser rail and a gold-textured column.",
    focus: { wide: "50% 55%", narrow: "66% 55%" },
    integrity: ENHANCED,
  },
  suitWall: {
    src: suitWall,
    kind: "scene",
    alt: "An illuminated display wall of suits and short-sleeved jackets in burgundy, cream, navy, brown and black.",
    focus: { wide: "45% 50%", narrow: "42% 50%" },
    integrity: ENHANCED,
  },

  /* Detail views — 4:5 close-ups cut from the photographs above by
     scripts/build-brand-assets.mjs. They are the second picture a product card
     reveals on hover until packshots and on-model photography are supplied. */
  waistcoatDetail: {
    src: waistcoat,
    kind: "detail",
    alt: "Close-up of the burgundy double-breasted waistcoat: shawl lapel, gold-tone buttons, white shirt and gold tie.",
    focus: { wide: "50% 50%", narrow: "50% 50%" },
    integrity: ENHANCED,
  },
  safariDetail: {
    src: safari,
    kind: "detail",
    alt: "Close-up of the black safari jacket: point collar, gold-tone buttons and two flap chest pockets.",
    focus: { wide: "50% 50%", narrow: "50% 50%" },
    integrity: ENHANCED,
  },
  pearlDetail: {
    src: pearl,
    kind: "detail",
    alt: "Close-up of pearl and bead embellishment scattered across the shoulders of black blazers.",
    focus: { wide: "50% 50%", narrow: "50% 50%" },
    integrity: ENHANCED,
  },
  royalBlueDetail: {
    src: royalBlue,
    kind: "detail",
    alt: "Royal blue jackets on the lower showroom rail, beside an emerald velvet chair.",
    focus: { wide: "50% 50%", narrow: "50% 50%" },
    integrity: ENHANCED,
  },
  checkCuffsDetail: {
    src: checkCuffs,
    kind: "detail",
    alt: "Close-up of grey check jacket sleeves with four-button cuffs.",
    focus: { wide: "50% 50%", narrow: "50% 50%" },
    integrity: ENHANCED,
  },
  burgundyCuffsDetail: {
    src: burgundyCuffs,
    kind: "detail",
    alt: "Close-up of a burgundy jacket's woven texture and gold-tone cuff buttons.",
    focus: { wide: "50% 50%", narrow: "50% 50%" },
    integrity: ENHANCED,
  },
  suitRailsDetail: {
    src: suitRails,
    kind: "detail",
    alt: "Two lit rails of suits in burgundy, cream, navy and black on the display wall.",
    focus: { wide: "50% 50%", narrow: "50% 50%" },
    integrity: ENHANCED,
  },
  shirtShelvesDetail: {
    src: shirtShelves,
    kind: "detail",
    alt: "Folded dress shirts in sky blue, white and blush, with darker patterned shirts on the shelf beside them.",
    focus: { wide: "50% 50%", narrow: "50% 50%" },
    integrity: ENHANCED,
  },
  trouserRailDetail: {
    src: trouserRail,
    kind: "detail",
    alt: "Brown and grey trousers hanging on the gold centre rail.",
    focus: { wide: "50% 50%", narrow: "50% 50%" },
    integrity: ENHANCED,
  },
} satisfies Record<string, MediaAsset>;

export type MediaKey = keyof typeof media;

export const mediaKind = (key: MediaKey): MediaKind => media[key].kind;
