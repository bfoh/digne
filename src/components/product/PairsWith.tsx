import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";

import { media } from "@/content/media";
import type { PieceSummary } from "@/lib/commerce/catalogue";
import { formatPrice } from "@/lib/format";

import { QuickAddButton } from "./QuickAddButton";

/** "Pairs well with" — editorial styling suggestions as compact rows, each with its own quick view. */
export function PairsWith({ pieces }: { pieces: PieceSummary[] }) {
  if (!pieces.length) return null;
  return (
    <section aria-labelledby="pairs-title">
      <h2 id="pairs-title" className="eyebrow">
        Pairs well with
      </h2>
      <ul className="mt-5 grid gap-4">
        {pieces.map((piece) => {
          const [view] = piece.media;
          const asset = media[view.key];
          return (
            <li key={piece.slug} className="piece-card group relative flex items-center gap-5">
              <Link href={`/products/${piece.slug}` as Route} className="flex flex-1 items-center gap-5">
                <span className="relative aspect-[4/5] w-[4.5rem] flex-none overflow-hidden bg-cream">
                  <Image src={asset.src} alt="" fill sizes="4.5rem" className="object-cover" style={{ objectPosition: view.focus ?? asset.focus.narrow }} />
                </span>
                <span className="grid gap-1">
                  <span className="eyebrow text-muted">{piece.categoryTitle}</span>
                  <span className="font-display text-[1.3rem] leading-tight transition-colors group-hover:text-heritage">{piece.name}</span>
                  <span className="text-sm text-charcoal/70">{formatPrice(piece.priceMinor)}</span>
                </span>
              </Link>
              <QuickAddButton piece={piece} className="flex-none border hairline" />
            </li>
          );
        })}
      </ul>
    </section>
  );
}
