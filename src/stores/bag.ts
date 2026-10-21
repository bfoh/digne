"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface BagLine {
  id: string;
  slug: string;
  colour: string | null;
  size: string | null;
  quantity: number;
}

export const MAX_QUANTITY = 10;

interface BagState {
  lines: BagLine[];
  add: (line: Omit<BagLine, "id" | "quantity">, quantity?: number) => void;
  setQuantity: (id: string, quantity: number) => void;
  remove: (id: string) => void;
  clear: () => void;
}

const lineId = (slug: string, colour: string | null, size: string | null) => [slug, colour ?? "", size ?? ""].join("|");
const clamp = (n: number) => Math.max(1, Math.min(MAX_QUANTITY, Math.round(n)));

/**
 * The bag. In enquiry mode it gathers pieces to send to the showroom in one
 * message; in online mode it becomes the cart. Validation against live stock
 * must happen server-side before any payment (docs/COMMERCE.md).
 */
export const useBag = create<BagState>()(
  persist(
    (set, get) => ({
      lines: [],
      add: ({ slug, colour, size }, quantity = 1) => {
        const id = lineId(slug, colour, size);
        const existing = get().lines.find((l) => l.id === id);
        set({
          lines: existing
            ? get().lines.map((l) => (l.id === id ? { ...l, quantity: clamp(l.quantity + quantity) } : l))
            : [...get().lines, { id, slug, colour, size, quantity: clamp(quantity) }],
        });
      },
      setQuantity: (id, quantity) => set({ lines: get().lines.map((l) => (l.id === id ? { ...l, quantity: clamp(quantity) } : l)) }),
      remove: (id) => set({ lines: get().lines.filter((l) => l.id !== id) }),
      clear: () => set({ lines: [] }),
    }),
    {
      name: "digne:bag",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ lines: s.lines }),
    },
  ),
);

export const bagCount = (lines: BagLine[]) => lines.reduce((n, l) => n + l.quantity, 0);
