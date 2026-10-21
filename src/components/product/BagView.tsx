"use client";

import Link from "next/link";
import { useMemo } from "react";

import { commerce, isEnquiryMode } from "@/config/commerce";
import { site, telHref } from "@/config/site";
import { useHydrated } from "@/hooks/useHydrated";
import type { PieceSummary } from "@/lib/commerce/catalogue";
import { whatsappHref } from "@/lib/whatsapp";
import { bagCount, useBag } from "@/stores/bag";
import { useUI } from "@/stores/ui";

import { bagMessage, resolveLines } from "./bag-message";
import { BagLineItem } from "./BagLineItem";

/** The full bag page. In enquiry mode it ends in a WhatsApp message, never a payment. */
export function BagView({ pieces }: { pieces: PieceSummary[] }) {
  const hydrated = useHydrated();
  const lines = useBag((s) => s.lines);
  const clear = useBag((s) => s.clear);
  const announce = useUI((s) => s.announce);
  const bySlug = useMemo(() => new Map(pieces.map((p) => [p.slug, p])), [pieces]);
  const items = hydrated ? resolveLines(lines, bySlug) : [];
  const count = bagCount(items.map((i) => i.line));

  if (!hydrated) return <div className="min-h-[40svh]" aria-busy="true" />;

  if (!items.length) {
    return (
      <div className="grid justify-items-center gap-6 py-24 text-center">
        <p className="display-sm">Your bag is empty.</p>
        <p className="max-w-sm text-sm leading-relaxed text-muted">Add pieces from the collections and send them to the showroom in a single message.</p>
        <Link href="/collections" className="btn mt-2">
          Explore the collections
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-14 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-20">
      <ul className="grid content-start gap-10 border-t hairline pt-10">
        {items.map(({ line, piece }) => (
          <BagLineItem key={line.id} line={line} piece={piece} size="lg" />
        ))}
      </ul>

      <aside aria-labelledby="bag-summary-title" className="lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:self-start">
        <div className="border hairline p-7 lg:p-9">
          <h2 id="bag-summary-title" className="eyebrow">
            Summary
          </h2>
          <dl className="mt-6 grid gap-3 text-[0.95rem]">
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Pieces</dt>
              <dd className="tabular-nums">{count}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Prices</dt>
              <dd>Confirmed by the showroom</dd>
            </div>
          </dl>
          <hr className="my-7 hairline" />
          <a href={whatsappHref(bagMessage(items))} target="_blank" rel="noopener noreferrer" className="btn btn-block">
            Send enquiry on WhatsApp <span className="arrow" aria-hidden>↗</span>
            <span className="sr-only">(opens WhatsApp)</span>
          </a>
          <a href={telHref} className="btn btn-outline btn-block mt-3">
            Call {site.phone.display}
          </a>
          <p className="mt-6 text-xs leading-relaxed text-muted">
            {isEnquiryMode || !commerce.checkoutEnabled
              ? "Online checkout isn’t available yet. Your enquiry goes to the showroom, who confirm availability, sizes and prices — nothing is reserved or charged."
              : "Prices and stock are confirmed again at checkout."}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-sm">
            <Link href="/appointments" className="link-under">
              Request a visit
            </Link>
            <button
              type="button"
              className="link-under text-muted hover:text-charcoal"
              onClick={() => {
                clear();
                announce("Your bag has been cleared");
              }}
            >
              Clear bag
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
