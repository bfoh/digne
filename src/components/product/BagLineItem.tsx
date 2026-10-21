"use client";

import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";

import { media } from "@/content/media";
import type { PieceSummary } from "@/lib/commerce/catalogue";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import { useBag, type BagLine } from "@/stores/bag";
import { useUI } from "@/stores/ui";

import { QuantityStepper } from "./QuantityStepper";

/** One line of the bag: thumbnail, piece, chosen options, quantity, remove. */
export function BagLineItem({ line, piece, size = "sm" }: { line: BagLine; piece: PieceSummary; size?: "sm" | "lg" }) {
  const setQuantity = useBag((s) => s.setQuantity);
  const remove = useBag((s) => s.remove);
  const announce = useUI((s) => s.announce);
  const view = piece.media[0];
  const asset = media[view.key];
  const href = `/products/${piece.slug}` as Route;
  const options = [line.colour, line.size ? `Size ${line.size}` : piece.sizesVerified ? null : "Size to confirm"].filter(Boolean).join(" · ");

  return (
    <li className={cn("grid items-start gap-5", size === "lg" ? "grid-cols-[7rem_1fr] sm:grid-cols-[9rem_1fr]" : "grid-cols-[5.5rem_1fr]")}>
      <Link href={href} className="relative block aspect-[4/5] overflow-hidden bg-cream" tabIndex={-1} aria-hidden>
        <Image src={asset.src} alt="" fill sizes={size === "lg" ? "9rem" : "5.5rem"} className="object-cover" style={{ objectPosition: view.focus ?? asset.focus.narrow }} />
      </Link>
      <div className="min-w-0">
        <p className="eyebrow text-muted">{piece.categoryTitle}</p>
        <h3 className={cn("mt-1.5 font-display leading-tight", size === "lg" ? "text-[1.6rem]" : "text-[1.3rem]")}>
          <Link href={href} className="hover:text-heritage">
            {piece.name}
          </Link>
        </h3>
        {options && <p className="mt-1 text-sm text-muted">{options}</p>}
        <p className="mt-1 text-sm text-charcoal/75">{formatPrice(piece.priceMinor)}</p>
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3">
          <QuantityStepper size="sm" value={line.quantity} onChange={(q) => setQuantity(line.id, q)} label={`Quantity of ${piece.name}`} />
          <button
            type="button"
            className="link-under text-sm text-muted hover:text-charcoal"
            onClick={() => {
              remove(line.id);
              announce(`${piece.name} removed from your bag`);
            }}
          >
            Remove<span className="sr-only"> {piece.name}</span>
          </button>
        </div>
      </div>
    </li>
  );
}
