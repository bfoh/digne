"use client";

import Link from "next/link";

import { CollectionGrid } from "@/components/collection/CollectionGrid";
import { useHydrated } from "@/hooks/useHydrated";
import type { PieceSummary } from "@/lib/commerce/catalogue";
import { useWishlist } from "@/stores/wishlist";

/** Saved pieces, kept in this browser only. */
export function SavedView({ pieces }: { pieces: PieceSummary[] }) {
  const hydrated = useHydrated();
  const slugs = useWishlist((s) => s.slugs);
  const saved = hydrated ? pieces.filter((p) => slugs.includes(p.slug)) : [];

  if (!hydrated) return <div className="min-h-[40svh]" aria-busy="true" />;

  if (!saved.length) {
    return (
      <div className="grid justify-items-center gap-6 py-24 text-center">
        <p className="display-sm">Nothing saved yet.</p>
        <p className="max-w-sm text-sm leading-relaxed text-muted">Tap the heart on any piece to keep it here — handy for showing the showroom what caught your eye.</p>
        <Link href="/collections" className="btn mt-2">
          Explore the collections
        </Link>
      </div>
    );
  }

  return (
    <>
      <p className="eyebrow mb-10 text-muted" aria-live="polite">
        {saved.length} {saved.length === 1 ? "piece" : "pieces"} saved · kept on this device only
      </p>
      <CollectionGrid pieces={saved} />
    </>
  );
}
