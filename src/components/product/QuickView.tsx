"use client";

import { X } from "lucide-react";
import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Sheet } from "@/components/ui/Sheet";
import type { PieceSummary } from "@/lib/commerce/catalogue";
import { formatPrice } from "@/lib/format";
import { useUI } from "@/stores/ui";

import { PieceGallery } from "./MediaTrack";
import { PieceOptions } from "./PieceOptions";

/**
 * Quick view — opened from the "+" on any product card. A centred card on
 * larger screens and a bottom sheet on phones, with the gallery, options and
 * a path to the full product page.
 */
export function QuickView() {
  const piece = useUI((s) => s.quickView);
  const close = useUI((s) => s.closeQuickView);
  const pathname = usePathname();
  // Keep the last piece on screen while the sheet animates closed.
  const [shown, setShown] = useState<PieceSummary | null>(piece);
  if (piece && piece !== shown) setShown(piece);

  useEffect(() => {
    close();
  }, [pathname, close]);

  return (
    <Sheet open={piece !== null} onClose={close} variant="modal" labelledBy="quick-view-title" id="quick-view">
      {shown && <QuickViewBody key={shown.slug} piece={shown} onClose={close} />}
    </Sheet>
  );
}

function QuickViewBody({ piece, onClose }: { piece: PieceSummary; onClose: () => void }) {
  return (
    <div className="relative">
      {/* A titled header on phones; on larger screens it collapses to the close button alone. */}
      <div className="sticky top-0 z-10 h-14 border-b hairline bg-ivory md:h-0 md:border-0">
        <p className="eyebrow grid h-full place-items-center md:hidden">Quick view</p>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close quick view"
          data-autofocus=""
          className="absolute top-1.5 right-1.5 grid size-11 place-items-center opacity-70 transition-opacity hover:opacity-100 md:top-4 md:right-4"
        >
          <X aria-hidden className="size-5" strokeWidth={1.2} />
        </button>
      </div>

      <div className="grid md:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] md:items-center md:gap-12 md:px-12 md:py-11">
        <div className="gutter pt-5 md:p-0">
          <PieceGallery name={piece.name} views={piece.media} sizes="(min-width: 48rem) 26rem, 100vw" className="mx-auto max-w-[22rem] md:max-w-none" />
        </div>

        <div className="gutter pb-8 md:p-0">
          <div className="mt-6 text-center md:mt-0 md:text-left">
            <p className="eyebrow text-muted">Digne · {piece.categoryTitle}</p>
            <h2 id="quick-view-title" className="display-md mt-3">
              {piece.name}
            </h2>
            <p className="mt-3 text-[0.95rem] tracking-[0.08em] text-charcoal/75">{formatPrice(piece.priceMinor)}</p>
          </div>
          <hr className="my-6 hairline" />
          <PieceOptions
            piece={piece}
            variant="quick"
            footer={
              <Link href={`/products/${piece.slug}` as Route} onClick={onClose} className="link-under text-[0.95rem]">
                Show details
              </Link>
            }
          />
        </div>
      </div>
    </div>
  );
}
