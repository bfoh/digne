"use client";

import { create } from "zustand";

import type { PieceSummary } from "@/lib/commerce/catalogue";

interface UIState {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  /** The piece shown in the quick-view dialog, if any. */
  quickView: PieceSummary | null;
  openQuickView: (piece: PieceSummary) => void;
  closeQuickView: () => void;
  bagOpen: boolean;
  setBagOpen: (open: boolean) => void;
  /** Short status messages announced to assistive tech (and shown as a toast). */
  notice: { id: number; text: string } | null;
  announce: (text: string) => void;
}

export const useUI = create<UIState>()((set) => ({
  menuOpen: false,
  setMenuOpen: (menuOpen) => set({ menuOpen }),
  quickView: null,
  openQuickView: (quickView) => set({ quickView, bagOpen: false }),
  closeQuickView: () => set({ quickView: null }),
  bagOpen: false,
  setBagOpen: (bagOpen) => set({ bagOpen, quickView: null }),
  notice: null,
  announce: (text) => set({ notice: { id: Date.now(), text } }),
}));
