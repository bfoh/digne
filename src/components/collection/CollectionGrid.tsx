import { ProductCard } from "@/components/product/ProductCard";
import type { PieceSummary } from "@/lib/commerce/catalogue";

/** The product grid: two columns on phones, three from desktop — as in the reference. */
export function CollectionGrid({ pieces }: { pieces: PieceSummary[] }) {
  return (
    <ul className="grid grid-cols-2 gap-x-3 gap-y-12 sm:gap-x-5 lg:grid-cols-3 lg:gap-x-6 lg:gap-y-16">
      {pieces.map((piece) => (
        <li key={piece.slug}>
          <ProductCard piece={piece} variant="grid" sizes="(min-width: 64rem) 31vw, 48vw" />
        </li>
      ))}
    </ul>
  );
}
