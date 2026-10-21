"use client";

import { useRef, type ReactNode } from "react";

import { FINE_POINTER, prefersReducedMotion } from "@/hooks/useMotionPreferences";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * MagneticButton — the control leans gently toward the pointer. Reserved for
 * a handful of primary calls to action; inert on touch and reduced motion.
 */
export function Magnetic({ children, strength = 0.28 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const el = ref.current;
      if (!el || !contextSafe || prefersReducedMotion() || !window.matchMedia(FINE_POINTER).matches) return;
      const x = gsap.quickTo(el, "x", { duration: 0.8, ease: "power3.out" });
      const y = gsap.quickTo(el, "y", { duration: 0.8, ease: "power3.out" });
      const move = contextSafe((e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        x((e.clientX - (r.left + r.width / 2)) * strength);
        y((e.clientY - (r.top + r.height / 2)) * strength);
      });
      const leave = contextSafe(() => {
        x(0);
        y(0);
      });
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
      return () => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerleave", leave);
      };
    },
    { scope: ref },
  );

  return (
    <span ref={ref} className="inline-flex will-change-transform">
      {children}
    </span>
  );
}
