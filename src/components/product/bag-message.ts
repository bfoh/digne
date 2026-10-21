import { site } from "@/config/site";
import type { PieceSummary } from "@/lib/commerce/catalogue";
import { bagEnquiryMessage } from "@/lib/whatsapp";
import type { BagLine } from "@/stores/bag";

/** Lines whose piece is still in the catalogue, paired with that piece. */
export function resolveLines(lines: BagLine[], bySlug: Map<string, PieceSummary>) {
  return lines.flatMap((line) => {
    const piece = bySlug.get(line.slug);
    return piece ? [{ line, piece }] : [];
  });
}

export function bagMessage(items: ReturnType<typeof resolveLines>) {
  return bagEnquiryMessage(
    items.map(({ line, piece }) => ({
      name: piece.name,
      colour: line.colour,
      size: line.size,
      quantity: line.quantity,
      url: `${site.url}/products/${piece.slug}`,
    })),
  );
}
