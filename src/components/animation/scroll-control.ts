"use client";

import type Lenis from "lenis";

/**
 * One shared handle on the smooth scroller (if any) so dialogs can pause it
 * and in-page links can scroll through it. Falls back to native scrolling.
 */
let lenis: Lenis | null = null;
let locks = 0;

export function setLenis(instance: Lenis | null) {
  lenis = instance;
}

export function getLenis() {
  return lenis;
}

export function lockScroll() {
  locks += 1;
  if (locks > 1) return;
  lenis?.stop();
  document.documentElement.dataset.scrollLocked = "";
}

export function unlockScroll() {
  locks = Math.max(0, locks - 1);
  if (locks > 0) return;
  lenis?.start();
  delete document.documentElement.dataset.scrollLocked;
}

export function scrollToTarget(target: HTMLElement | number, offset = 0) {
  if (lenis) {
    lenis.scrollTo(target, { offset });
    return;
  }
  const top = typeof target === "number" ? target : target.getBoundingClientRect().top + window.scrollY + offset;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
}
