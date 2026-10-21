"use client";

import { useSyncExternalStore } from "react";

function subscribeTo(query: string) {
  return (onChange: () => void) => {
    const mql = window.matchMedia(query);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  };
}

function useMediaQuery(query: string, serverValue: boolean): boolean {
  return useSyncExternalStore(
    subscribeTo(query),
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}

export const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
export const FINE_POINTER = "(hover: hover) and (pointer: fine)";
export const DESKTOP = "(min-width: 64rem)";

export function useReducedMotion(): boolean {
  // Server assumes reduced motion so nothing is animated before we know.
  return useMediaQuery(REDUCED_MOTION, true);
}

export function useFinePointer(): boolean {
  return useMediaQuery(FINE_POINTER, false);
}

/** Read once, outside React — for code inside GSAP callbacks. */
export function prefersReducedMotion(): boolean {
  return typeof window === "undefined" || window.matchMedia(REDUCED_MOTION).matches;
}
