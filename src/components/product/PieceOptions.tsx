"use client";

import { useId, useRef, useState, type ReactNode } from "react";

import { isEnquiryMode } from "@/config/commerce";
import { site } from "@/config/site";
import type { PieceSummary } from "@/lib/commerce/catalogue";
import { formatPrice } from "@/lib/format";
import { pieceEnquiryMessage, whatsappHref } from "@/lib/whatsapp";
import { useBag } from "@/stores/bag";
import { useUI } from "@/stores/ui";

import { QuantityStepper } from "./QuantityStepper";
import { StickyAddBar } from "./StickyAddBar";
import { WishlistButton } from "./WishlistButton";

const NOT_SURE = "";

interface PieceOptionsProps {
  piece: PieceSummary;
  /** quick: inside the quick view · page: the product page (adds Save). */
  variant: "quick" | "page";
  /** Quick view only: shown beside the WhatsApp link (the "Show details" link). */
  footer?: ReactNode;
}

/**
 * Colour, size and quantity, then the bag. In enquiry mode the size is a
 * preference (the showroom confirms fit and stock) and the bag gathers pieces
 * for one WhatsApp message; nothing is reserved or charged.
 */
export function PieceOptions({ piece, variant, footer }: PieceOptionsProps) {
  const id = useId();
  const [colour, setColour] = useState(piece.colours.length === 1 ? piece.colours[0].name : "");
  const [size, setSize] = useState(NOT_SURE);
  const [quantity, setQuantity] = useState(1);
  const addButton = useRef<HTMLButtonElement>(null);
  const sizeGroup = useRef<HTMLFieldSetElement>(null);
  const add = useBag((s) => s.add);
  const announce = useUI((s) => s.announce);
  const setBagOpen = useUI((s) => s.setBagOpen);

  const needsSize = piece.sizesVerified && size === NOT_SURE;
  const enquiry = pieceEnquiryMessage({
    name: piece.name,
    colour: colour || null,
    size: size || null,
    quantity,
    url: `${site.url}/products/${piece.slug}`,
  });

  const addToBag = () => {
    if (needsSize) return;
    add({ slug: piece.slug, colour: colour || null, size: size || null }, quantity);
    announce(`${piece.name} added to your ${isEnquiryMode ? "enquiry bag" : "bag"}`);
    setBagOpen(true);
  };

  /** The sticky bar's action: add, or take the visitor back to the sizes. */
  const fromBar = () => {
    if (!needsSize) return addToBag();
    sizeGroup.current?.scrollIntoView({ block: "center", behavior: "smooth" });
    sizeGroup.current?.querySelector<HTMLInputElement>("input:not(:disabled)")?.focus({ preventScroll: true });
  };

  return (
    <div className={variant === "quick" ? "grid gap-6" : "grid gap-7"}>
      {piece.colours.length > 1 ? (
        <fieldset>
          <legend className="flex w-full justify-between gap-4 text-sm">
            <span>
              Colour: <span className="text-muted">{colour || "Choose a colour"}</span>
            </span>
          </legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {piece.colours.map((c) => (
              <label key={c.name} className="relative">
                <input type="radio" name={`${id}-colour`} value={c.name} checked={colour === c.name} onChange={() => setColour(c.name)} className="peer sr-only" />
                <span className="option-block">
                  <span aria-hidden className="size-3 rounded-full ring-1 ring-charcoal/15" style={{ background: c.hex }} />
                  {c.name}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      ) : (
        <p className="text-sm">
          Colour: <span className="text-muted">{piece.colours[0]?.name}</span>
        </p>
      )}

      <fieldset ref={sizeGroup} aria-describedby={`${id}-size-hint`}>
        <legend className="text-sm">
          {piece.sizesVerified ? "Size" : "Your size"}: <span className="text-muted">{size || (piece.sizesVerified ? "Choose a size" : "Not sure")}</span>
        </legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {piece.sizes.map((s) => (
            <label key={s.label} className="relative">
              <input
                type="radio"
                name={`${id}-size`}
                value={s.label}
                checked={size === s.label}
                disabled={!s.available}
                onChange={() => setSize(s.label)}
                className="peer sr-only"
              />
              <span className="option-block">
                {s.label}
                {!s.available && <span className="sr-only"> (unavailable)</span>}
              </span>
            </label>
          ))}
          {!piece.sizesVerified && (
            <label className="relative">
              <input type="radio" name={`${id}-size`} value={NOT_SURE} checked={size === NOT_SURE} onChange={() => setSize(NOT_SURE)} className="peer sr-only" />
              <span className="option-block">Not sure</span>
            </label>
          )}
        </div>
        <p id={`${id}-size-hint`} className="mt-3 text-xs leading-relaxed text-muted">
          {piece.sizesVerified ? "Struck-through sizes are currently unavailable." : "Tell us your usual size — the showroom confirms fit and availability."}
        </p>
      </fieldset>

      <div className="grid gap-3">
        <QuantityStepper value={quantity} onChange={setQuantity} label={`Quantity of ${piece.name}`} className="justify-self-start" />
        <button ref={addButton} type="button" className="btn btn-block" onClick={addToBag} aria-disabled={needsSize || undefined}>
          {needsSize ? "Choose a size" : isEnquiryMode ? "Add to enquiry bag" : "Add to bag"}
        </button>
        {variant === "page" && (
          <div className="grid gap-3 sm:grid-cols-2">
            <a href={whatsappHref(enquiry)} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-block">
              Ask on WhatsApp <span className="arrow" aria-hidden>↗</span>
              <span className="sr-only">(opens WhatsApp)</span>
            </a>
            <WishlistButton slug={piece.slug} name={piece.name} variant="inline" className="btn-block" />
          </div>
        )}
      </div>

      {variant === "page" && (
        <StickyAddBar
          anchor={addButton}
          title={piece.name}
          detail={[formatPrice(piece.priceMinor), colour, size && `Size ${size}`].filter(Boolean).join(" · ")}
          action={needsSize ? "Choose a size" : "Add to bag"}
          onAction={fromBar}
        />
      )}

      {isEnquiryMode && (
        <p className="text-xs leading-relaxed text-muted">Adding a piece doesn’t reserve it. The showroom confirms availability, sizes and price before anything is arranged.</p>
      )}
      {variant === "quick" && (
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
          {footer}
          <a href={whatsappHref(enquiry)} target="_blank" rel="noopener noreferrer" className="link-under text-[0.95rem]">
            Ask on WhatsApp <span aria-hidden>↗</span>
            <span className="sr-only">(opens WhatsApp)</span>
          </a>
        </div>
      )}
    </div>
  );
}
