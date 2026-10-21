"use client";

import { useRef, useState } from "react";

import { useFinePointer, useReducedMotion } from "@/hooks/useMotionPreferences";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * EditorialCursor — a small label disc that follows the pointer over media
 * links marked `data-cursor="Explore"`. The native cursor is never hidden,
 * and nothing renders on touch devices or with reduced motion.
 */
export function EditorialCursor() {
  const fine = useFinePointer();
  const reduce = useReducedMotion();
  if (!fine || reduce) return null;
  return <CursorDisc />;
}

function CursorDisc() {
  const ref = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");

  useGSAP(() => {
    const el = ref.current;
    if (!el) return;
    gsap.set(el, { xPercent: -50, yPercent: -50, scale: 0, autoAlpha: 0 });
    const x = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3.out" });
    const y = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3.out" });
    let current = "";

    const onMove = (e: PointerEvent) => {
      x(e.clientX);
      y(e.clientY);
      const host = (e.target as Element | null)?.closest?.<HTMLElement>("[data-cursor]");
      const next = host?.dataset.cursor ?? "";
      if (next === current) return;
      current = next;
      if (next) setLabel(next);
      gsap.to(el, { scale: next ? 1 : 0, autoAlpha: next ? 1 : 0, duration: 0.5, ease: next ? "expo.out" : "power2.out" });
    };
    const onLeave = () => {
      current = "";
      gsap.to(el, { scale: 0, autoAlpha: 0, duration: 0.3 });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  });

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[90] grid size-22 place-items-center rounded-full bg-burgundy text-ivory"
    >
      <span className="eyebrow text-[0.625rem]">{label}</span>
    </div>
  );
}
