"use client";

import { Plus } from "lucide-react";

import type { PieceSummary } from "@/lib/commerce/catalogue";
import { cn } from "@/lib/cn";
import { useUI } from "@/stores/ui";

/** The "+" on a product card: opens the quick view. Revealed on hover/focus with a fine pointer, always shown on touch. */
export function QuickAddButton({ piece, className }: { piece: PieceSummary; className?: string }) {
  const open = useUI((s) => s.openQuickView);
  return (
    <button
      type="button"
      aria-haspopup="dialog"
      aria-controls="quick-view"
      aria-label={`Quick view: ${piece.name}`}
      onClick={() => open(piece)}
      className={cn("piece-card__quick grid size-10 place-items-center bg-ivory text-charcoal hover:bg-charcoal hover:text-ivory", className)}
    >
      <Plus aria-hidden className="size-4" strokeWidth={1.2} />
    </button>
  );
}
