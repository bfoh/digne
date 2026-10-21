"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { FINE_POINTER, prefersReducedMotion } from "@/hooks/useMotionPreferences";
import { gsap, ScrollTrigger } from "@/lib/gsap";

import { hydratedTooLate } from "./boot";
import { setLenis } from "./scroll-control";

/**
 * Boots the motion system:
 * - flags html[data-motion-ready] so CSS failsafes stand down;
 * - runs Lenis only for fine-pointer devices without reduced motion
 *   (touch devices keep native momentum scrolling);
 * - drives Lenis from GSAP's ticker so ScrollTrigger stays in lockstep.
 */
export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (!hydratedTooLate()) document.documentElement.dataset.motionReady = "";
    if (prefersReducedMotion() || !window.matchMedia(FINE_POINTER).matches) return;

    const lenis = new Lenis({
      lerp: 0.095,
      anchors: { offset: -80 },
      stopInertiaOnNavigate: true,
      autoRaf: false,
    });
    const tick = (time: number) => lenis.raf(time * 1000);
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    setLenis(lenis);

    return () => {
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  // New route content mounts after navigation — re-measure every trigger once it has laid out.
  useEffect(() => {
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return null;
}
