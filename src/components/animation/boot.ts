"use client";

/**
 * If the page took longer than this to hydrate, the CSS failsafes (6s) may
 * already be showing content — so the motion system stays out of the way.
 */
const FAILSAFE_MARGIN_MS = 5500;

/**
 * Hydration later than this plays a shortened brand intro. Mid-range phones
 * hydrate the homepage in about 1.5s; the full intro on top of that would put
 * the hero copy past the 2.5s LCP target.
 */
export const LATE_HYDRATION_MS = 1200;

export function hydratedTooLate(): boolean {
  return performance.now() > FAILSAFE_MARGIN_MS;
}
