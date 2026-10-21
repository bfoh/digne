"use client";

import { useEffect, useRef } from "react";

import { prefersReducedMotion } from "@/hooks/useMotionPreferences";

const TOUCH = "(hover: none), (pointer: coarse)";

let observer: IntersectionObserver | null = null;

/**
 * One observer for every group: a thin band across the middle of the screen,
 * so — as with a pointer — one row at a time is "hovered".
 */
function centreBand() {
  observer ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) (entry.target as HTMLElement).toggleAttribute("data-peek", entry.isIntersecting);
    },
    { rootMargin: "-48% -30% -48% -30%" },
  );
  return observer;
}

/**
 * The touch-screen stand-in for hover: while the nearest `.group` passes
 * through the middle of the screen it takes its hover state — a product card
 * shows its second view (on-model when that photography exists), a title
 * rolls, an arrow leans forward. Renders nothing visible; the styles are the
 * `group-peek` variant and the Touch section of globals.css.
 */
export function TouchPeek() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const group = ref.current?.closest<HTMLElement>(".group");
    if (!group || !window.matchMedia(TOUCH).matches || prefersReducedMotion()) return;
    const band = centreBand();
    band.observe(group);
    return () => {
      band.unobserve(group);
      group.removeAttribute("data-peek");
    };
  }, []);

  return <span ref={ref} hidden />;
}
