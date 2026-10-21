"use client";

import { X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo } from "react";

import { Sheet } from "@/components/ui/Sheet";
import { isEnquiryMode } from "@/config/commerce";
import { useHydrated } from "@/hooks/useHydrated";
import type { PieceSummary } from "@/lib/commerce/catalogue";
import { whatsappHref } from "@/lib/whatsapp";
import { bagCount, useBag } from "@/stores/bag";
import { useUI } from "@/stores/ui";

import { bagMessage, resolveLines } from "./bag-message";
import { BagLineItem } from "./BagLineItem";

/** The bag, sliding in from the right whenever a piece is added (or the header's Bag is pressed). */
export function BagDrawer({ pieces }: { pieces: PieceSummary[] }) {
  const open = useUI((s) => s.bagOpen);
  const setOpen = useUI((s) => s.setBagOpen);
  const pathname = usePathname();
  const hydrated = useHydrated();
  const lines = useBag((s) => s.lines);
  const bySlug = useMemo(() => new Map(pieces.map((p) => [p.slug, p])), [pieces]);
  const items = hydrated ? resolveLines(lines, bySlug) : [];
  const count = bagCount(items.map((i) => i.line));
  const close = () => setOpen(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname, setOpen]);

  return (
    <Sheet open={open} onClose={close} variant="drawer" labelledBy="bag-title" id="bag-drawer">
      <header className="flex h-[var(--header-h)] flex-none items-center justify-between border-b hairline pr-3 pl-6">
        <h2 id="bag-title" className="eyebrow">
          {isEnquiryMode ? "Enquiry bag" : "Bag"} <span className="text-muted">({count})</span>
        </h2>
        <button type="button" onClick={close} aria-label="Close bag" data-autofocus="" className="grid size-11 place-items-center opacity-70 transition-opacity hover:opacity-100">
          <X aria-hidden className="size-5" strokeWidth={1.2} />
        </button>
      </header>

      {items.length ? (
        <>
          <ul className="grid flex-1 content-start gap-8 overflow-y-auto overscroll-contain px-6 py-8">
            {items.map(({ line, piece }) => (
              <BagLineItem key={line.id} line={line} piece={piece} />
            ))}
          </ul>
          <footer className="flex-none border-t hairline px-6 pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
            {isEnquiryMode && (
              <p className="text-xs leading-relaxed text-muted">
                Send the bag to the showroom in one WhatsApp message. They’ll confirm availability, sizes and prices — nothing is reserved or charged.
              </p>
            )}
            <a href={whatsappHref(bagMessage(items))} target="_blank" rel="noopener noreferrer" className="btn btn-block mt-5">
              Send enquiry on WhatsApp <span className="arrow" aria-hidden>↗</span>
              <span className="sr-only">(opens WhatsApp)</span>
            </a>
            <Link href="/cart" className="btn btn-outline btn-block mt-3">
              View bag
            </Link>
          </footer>
        </>
      ) : (
        <div className="grid flex-1 place-content-center gap-6 px-8 text-center">
          <p className="eyebrow">Your bag is empty</p>
          <p className="mx-auto max-w-xs text-sm leading-relaxed text-muted">
            Pieces you add are gathered here, ready to send to the showroom in a single message.
          </p>
          <Link href="/collections" className="btn mx-auto mt-2">
            Explore the collections
          </Link>
        </div>
      )}
    </Sheet>
  );
}
