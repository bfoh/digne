import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { ViewTransition } from "react";

import { TouchPeek } from "@/components/animation/TouchPeek";
import { media } from "@/content/media";
import type { PieceSummary } from "@/lib/commerce/catalogue";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";

import { QuickAddButton } from "./QuickAddButton";
import { Swatches } from "./Swatches";
import { WishlistButton } from "./WishlistButton";

interface ProductCardProps {
  piece: PieceSummary;
  index?: string;
  className?: string;
  /** editorial: left-aligned with an index numeral · grid: centred caption for collection grids. */
  variant?: "editorial" | "grid";
  aspect?: "portrait" | "tall";
  sizes?: string;
}

/**
 * A piece in the catalogue. Hovering reveals its second view — on-model when
 * that photography exists, otherwise a close-up; on touch screens the view
 * changes as the card passes through the middle of the screen. A "+" opens
 * the quick view. The photograph morphs into the product page on navigation.
 */
export function ProductCard({ piece, index, className, variant = "editorial", aspect = "portrait", sizes = "(min-width: 64rem) 25vw, 50vw" }: ProductCardProps) {
  const [primary] = piece.media;
  const main = media[primary.key];
  const alt = piece.hover ? media[piece.hover.key] : null;
  const frame = aspect === "tall" ? "aspect-[3/4]" : "aspect-[4/5]";

  return (
    <article className={cn("piece-card group relative", className)}>
      <Link href={`/products/${piece.slug}` as Route} data-cursor="View" className="block">
        <ViewTransition name={`piece-${piece.slug}`} share="morph" default="none">
          <div className={cn("relative overflow-hidden bg-cream", frame)}>
            <div className="piece-card__views absolute inset-0">
              <Image
                src={main.src}
                alt={main.alt}
                fill
                sizes={sizes}
                placeholder="blur"
                className="piece-card__main object-cover"
                style={{ objectPosition: primary.focus ?? main.focus.narrow }}
              />
              {alt && piece.hover && (
                <Image
                  src={alt.src}
                  alt=""
                  fill
                  sizes={sizes}
                  className="piece-card__alt object-cover"
                  style={{ objectPosition: piece.hover.focus ?? alt.focus.narrow }}
                />
              )}
            </div>
          </div>
        </ViewTransition>

        {variant === "grid" ? (
          <div className="mt-5 grid justify-items-center gap-1.5 text-center">
            <p className="eyebrow text-muted">{piece.categoryTitle}</p>
            <h3 className="font-display text-[1.4rem] leading-tight transition-colors duration-500 group-hover:text-heritage group-peek:text-heritage">{piece.name}</h3>
            <p className="text-sm tracking-[0.06em] text-charcoal/70">{formatPrice(piece.priceMinor)}</p>
          </div>
        ) : (
          <>
            <div className="mt-4 flex items-baseline justify-between gap-4">
              <p className="eyebrow text-muted">{piece.categoryTitle}</p>
              {index && <span className="numeral text-sm text-muted">{index}</span>}
            </div>
            <h3 className="display-sm mt-1.5 transition-colors duration-500 group-hover:text-heritage group-peek:text-heritage">{piece.name}</h3>
            <div className="mt-2.5 flex items-center justify-between gap-4">
              <p className="text-sm text-charcoal/75">{formatPrice(piece.priceMinor)}</p>
              <Swatches colours={piece.colours} />
            </div>
          </>
        )}
      </Link>

      <TouchPeek />

      {/* Controls float over the photograph, outside the link. */}
      <div className={cn("pointer-events-none absolute inset-x-0 top-0", frame)}>
        <WishlistButton slug={piece.slug} name={piece.name} className="pointer-events-auto absolute top-3 right-3" />
        <QuickAddButton piece={piece} className="pointer-events-auto absolute right-3 bottom-3" />
      </div>
    </article>
  );
}
