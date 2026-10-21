"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface WishlistState {
  slugs: string[];
  toggle: (slug: string) => boolean;
  remove: (slug: string) => void;
  clear: () => void;
}

/** Saved pieces, kept in this browser only (localStorage). */
export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      slugs: [],
      toggle: (slug) => {
        const saved = get().slugs.includes(slug);
        set({ slugs: saved ? get().slugs.filter((s) => s !== slug) : [...get().slugs, slug] });
        return !saved;
      },
      remove: (slug) => set({ slugs: get().slugs.filter((s) => s !== slug) }),
      clear: () => set({ slugs: [] }),
    }),
    {
      name: "digne:wishlist",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ slugs: s.slugs }),
    },
  ),
);
