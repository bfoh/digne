import type { Catalogue, Piece } from "@/lib/commerce/schema";

/**
 * Catalogue source data.
 *
 * Every piece below is a "showroom-photo" entry: an editorial description of
 * garments visible in Digne's store photography. None is a verified SKU, so
 * prices, sizes, fabric and care are deliberately left empty. When Digne
 * supplies real product data, add entries with `source: "product"` (or connect
 * a CMS — see docs/COMMERCE.md); the UI switches on automatically.
 */

const COLOURS = {
  burgundy: { name: "Burgundy", hex: "#5C1A25" },
  black: { name: "Black", hex: "#141313" },
  greyCheck: { name: "Grey check", hex: "#9A958C" },
  royalBlue: { name: "Royal blue", hex: "#2747A6" },
  cream: { name: "Cream", hex: "#E6DCC8" },
  navy: { name: "Navy", hex: "#1E2A44" },
  brown: { name: "Brown", hex: "#5A3B2A" },
  white: { name: "White", hex: "#F7F6F2" },
  skyBlue: { name: "Sky blue", hex: "#A9C6E3" },
  blush: { name: "Blush", hex: "#D9A8A0" },
  grey: { name: "Grey", hex: "#8A8780" },
} as const;

const showroomEntry = {
  priceMinor: null,
  sizes: [],
  availability: "enquire",
  fabric: null,
  care: null,
  source: "showroom-photo",
  addedAt: null,
} satisfies Pick<Piece, "priceMinor" | "sizes" | "availability" | "fabric" | "care" | "source" | "addedAt">;

/**
 * Preference scales offered when a piece has no verified sizes — the customer
 * names their usual size and the showroom confirms fit and availability.
 * TODO(business): confirm the size labels Digne uses (EU numeric jackets?
 * letter-sized shirts?) — see docs/BUSINESS-INPUTS.md.
 */
const JACKET_SIZES = ["46", "48", "50", "52", "54", "56", "58"];
const SHIRT_SIZES = ["S", "M", "L", "XL", "XXL"];
const WAIST_SIZES = ["30", "32", "34", "36", "38", "40"];

export const catalogueData = {
  categories: [
    {
      slug: "suits",
      title: "Suits",
      summary: "Suits for the office, the aisle and every occasion in between.",
      media: { key: "suitWall" },
      enquirySizes: JACKET_SIZES,
    },
    {
      slug: "blazers",
      title: "Blazers",
      summary: "Statement colour, quiet texture and classic checks — jackets that carry a look.",
      media: { key: "maroonCheck" },
      enquirySizes: JACKET_SIZES,
    },
    {
      slug: "shirts",
      title: "Shirts",
      summary: "Dress shirts to sit beneath a jacket, and patterned styles that stand on their own.",
      media: { key: "reception", focus: "88% 30%" },
      enquirySizes: SHIRT_SIZES,
    },
    {
      slug: "trousers",
      title: "Trousers",
      summary: "Trousers to complete a suit or anchor a look built from separates.",
      media: { key: "boutique", focus: "64% 70%" },
      enquirySizes: WAIST_SIZES,
    },
    {
      slug: "occasionwear",
      title: "Occasionwear",
      summary: "For weddings, celebrations and evenings that call for something memorable.",
      media: { key: "embellished" },
      enquirySizes: JACKET_SIZES,
    },
  ],
  pieces: [
    {
      ...showroomEntry,
      slug: "burgundy-waistcoat-ensemble",
      name: "Burgundy Waistcoat Ensemble",
      category: "suits",
      summary: "A double-breasted burgundy waistcoat and matching trousers — formal, warm and assured.",
      details: [
        "Double-breasted waistcoat with a shawl lapel",
        "Gold-tone buttons",
        "Matching trousers with a pressed front crease",
        "Styled with a white shirt and gold patterned tie",
      ],
      colours: [COLOURS.burgundy],
      media: [{ key: "burgundy" }, { key: "waistcoatDetail" }],
      featured: true,
      pairsWith: ["dress-shirts", "burgundy-blazer"],
    },
    {
      ...showroomEntry,
      slug: "black-safari-jacket",
      name: "Black Safari Jacket",
      category: "occasionwear",
      summary: "A short-sleeved safari-style jacket in black, finished with gold-tone buttons.",
      details: [
        "Short sleeves and a point collar",
        "Single-breasted button front",
        "Four flap pockets with gold-tone buttons",
        "Similar jackets photographed on the rail in burgundy",
      ],
      colours: [COLOURS.black],
      media: [{ key: "charcoal" }, { key: "safariDetail" }, { key: "suitWall", focus: "34% 60%" }],
      featured: true,
      pairsWith: ["tailored-trousers"],
    },
    {
      ...showroomEntry,
      slug: "pearl-shoulder-evening-blazer",
      name: "Pearl-Shoulder Evening Blazer",
      category: "occasionwear",
      summary: "A black evening blazer with pearl and bead detailing scattered across the shoulders.",
      details: ["Pearl and bead embellishment across the shoulders", "Notch lapel", "Single-button front"],
      colours: [COLOURS.black],
      media: [{ key: "embellished" }, { key: "pearlDetail" }],
      featured: true,
      pairsWith: ["dress-shirts", "tailored-trousers"],
    },
    {
      ...showroomEntry,
      slug: "royal-blue-blazer",
      name: "Royal Blue Blazer",
      category: "blazers",
      summary: "A vivid royal blue jacket for when the room should notice.",
      details: ["Royal blue jacket", "Four-button cuffs", "Pairs with cream, grey or black trousers"],
      colours: [COLOURS.royalBlue],
      media: [{ key: "suitSelection", focus: "84% 50%" }, { key: "royalBlueDetail" }, { key: "showroom", focus: "68% 45%" }],
      featured: true,
      pairsWith: ["tailored-trousers", "dress-shirts"],
    },
    {
      ...showroomEntry,
      slug: "grey-check-blazer",
      name: "Grey Check Blazer",
      category: "blazers",
      summary: "A grey check jacket — classic pattern, easy to dress up or down.",
      details: ["Grey check pattern", "Four-button cuffs", "Single-breasted"],
      colours: [COLOURS.greyCheck],
      media: [{ key: "maroonCheck", focus: "62% 50%" }, { key: "checkCuffsDetail" }, { key: "suitSelection", focus: "48% 50%" }],
      featured: false,
      pairsWith: ["tailored-trousers", "dress-shirts"],
    },
    {
      ...showroomEntry,
      slug: "burgundy-blazer",
      name: "Burgundy Blazer",
      category: "blazers",
      summary: "A burgundy jacket with a softly visible weave and gold-tone cuff buttons.",
      details: ["Burgundy jacket with a visible weave", "Flap pockets", "Gold-tone cuff buttons on selected styles"],
      colours: [COLOURS.burgundy],
      media: [{ key: "maroonCheck", focus: "18% 50%" }, { key: "burgundyCuffsDetail" }, { key: "suitSelection", focus: "12% 50%" }],
      featured: false,
      pairsWith: ["dress-shirts", "tailored-trousers"],
    },
    {
      ...showroomEntry,
      slug: "two-piece-suits",
      name: "Two-Piece Suits",
      category: "suits",
      summary: "The suit wall: navy, royal blue, brown, cream, grey and burgundy, ready to be tried on.",
      details: [
        "Shown in navy, royal blue, brown, cream, grey and burgundy",
        "Single-breasted jackets",
        "Displayed with matching trousers",
      ],
      colours: [COLOURS.navy, COLOURS.royalBlue, COLOURS.brown, COLOURS.cream, COLOURS.grey, COLOURS.burgundy],
      media: [{ key: "showroom", focus: "52% 35%" }, { key: "suitRailsDetail" }, { key: "suitWall", focus: "50% 50%" }],
      featured: false,
      pairsWith: ["dress-shirts"],
    },
    {
      ...showroomEntry,
      slug: "dress-shirts",
      name: "Dress Shirts",
      category: "shirts",
      summary: "Folded dress shirts in light shades, alongside darker patterned styles.",
      details: ["White, sky blue and blush dress shirts", "Darker patterned shirts", "Displayed folded and packaged"],
      colours: [COLOURS.white, COLOURS.skyBlue, COLOURS.blush, COLOURS.black],
      media: [{ key: "reception", focus: "88% 30%" }, { key: "shirtShelvesDetail" }, { key: "boutique", focus: "4% 30%" }],
      featured: false,
      pairsWith: ["two-piece-suits", "royal-blue-blazer"],
    },
    {
      ...showroomEntry,
      slug: "tailored-trousers",
      name: "Tailored Trousers",
      category: "trousers",
      summary: "Trousers in brown and grey, hung on the showroom rail.",
      details: ["Brown and grey trousers", "Displayed on the centre rail"],
      colours: [COLOURS.brown, COLOURS.grey],
      media: [{ key: "boutique", focus: "64% 70%" }, { key: "trouserRailDetail" }],
      featured: false,
      pairsWith: ["grey-check-blazer", "dress-shirts"],
    },
  ],
} satisfies Catalogue;
