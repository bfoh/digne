import { site } from "@/config/site";

export const DEFAULT_ENQUIRY =
  "Hello Digne Suits & More, I found your website and would like to enquire about your collection.";

/** Builds a wa.me link with a safely encoded, prefilled message. */
export function whatsappHref(message: string = DEFAULT_ENQUIRY): string {
  return `https://wa.me/${site.phone.whatsapp}?text=${encodeURIComponent(message)}`;
}

export interface PieceEnquiry {
  name: string;
  colour?: string | null;
  size?: string | null;
  quantity?: number;
  url?: string;
}

/** "Name (colour: X, size: Y)" — one piece as written in an enquiry. */
export function describePiece({ name, colour, size, quantity }: PieceEnquiry): string {
  const extras = [colour && `colour: ${colour}`, size && `size: ${size}`, quantity && quantity > 1 && `qty: ${quantity}`]
    .filter(Boolean)
    .join(", ");
  return extras ? `${name} (${extras})` : name;
}

export function pieceEnquiryMessage(piece: PieceEnquiry): string {
  const lines = [
    "Hello Digne Suits & More, I found your website and would like to enquire about:",
    describePiece(piece),
    piece.url ?? "",
    "Could you confirm availability, sizes and price?",
  ];
  return lines.filter(Boolean).join("\n");
}

export function bagEnquiryMessage(items: PieceEnquiry[]): string {
  return [
    "Hello Digne Suits & More, I found your website and would like to enquire about these pieces:",
    ...items.map((item, i) => `${i + 1}. ${describePiece(item)}`),
    "Could you confirm availability, sizes and prices?",
  ].join("\n");
}
