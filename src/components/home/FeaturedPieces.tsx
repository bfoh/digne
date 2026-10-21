import Link from "next/link";

import { Reveal } from "@/components/animation/Reveal";
import { SplitHeading } from "@/components/animation/SplitHeading";
import { ProductCard } from "@/components/product/ProductCard";
import { SwipeProgress } from "@/components/ui/SwipeProgress";
import type { PieceSummary } from "@/lib/commerce/catalogue";
import { cn } from "@/lib/cn";
import { pad2 } from "@/lib/format";

/**
 * Section 05 — featured pieces. Until verified product data exists these are
 * showroom-photographed pieces, labelled as such, with prices on request.
 * Phones get a swipe row of large cards; wider screens a staggered grid.
 */
export function FeaturedPieces({ pieces }: { pieces: PieceSummary[] }) {
  const editorial = pieces.every((p) => p.source === "showroom-photo");
  return (
    <section data-theme="light" aria-labelledby="featured-title" className="relative z-10 bg-ivory">
      <div className="gutter py-24 lg:py-40">
        <div className="grid grid-cols-12 items-end gap-x-6 gap-y-8">
          <div className="col-span-12 lg:col-span-8">
            <p className="eyebrow text-muted">
              <span className="numeral mr-2 text-base tracking-normal normal-case text-heritage">03</span>Featured pieces
            </p>
            <SplitHeading id="featured-title" className="display-xl mt-7 uppercase">
              Considered pieces.
              <br />
              <em className="font-normal text-heritage">Lasting impressions.</em>
            </SplitHeading>
          </div>
          <Reveal className="col-span-12 lg:col-span-4 lg:pb-3">
            {editorial && (
              <p className="max-w-sm border-l border-heritage/40 pl-5 text-[0.95rem] text-muted">
                From the showroom floor. These pieces are photographed in store — ask for sizes, current availability and prices.
              </p>
            )}
            <Link href="/collections" className="link-line mt-6 text-charcoal">
              View all pieces <span className="arrow" aria-hidden>→</span>
            </Link>
          </Reveal>
        </div>

        <Reveal
          as="ul"
          id="featured-row"
          stagger={0.12}
          y={48}
          className="swipe-row -mx-[var(--gutter)] mt-12 gap-3 px-[var(--gutter)] sm:mx-0 sm:mt-16 sm:grid sm:grid-cols-2 sm:gap-x-5 sm:gap-y-12 sm:overflow-visible sm:px-0 lg:mt-24 lg:grid-cols-4 lg:gap-x-6"
        >
          {pieces.map((piece, i) => (
            <li key={piece.slug} data-reveal-item className={cn("w-[72vw] shrink-0 snap-start sm:w-auto", i % 2 === 1 && "sm:mt-12 lg:mt-28")}>
              <ProductCard piece={piece} index={pad2(i + 1)} sizes="(min-width: 64rem) 24vw, (min-width: 40rem) 48vw, 72vw" />
            </li>
          ))}
        </Reveal>
        <SwipeProgress target="featured-row" className="mt-8 sm:hidden" />
      </div>
    </section>
  );
}
