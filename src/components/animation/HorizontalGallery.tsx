"use client";

import { useId, useRef, type ReactNode } from "react";

import { SwipeProgress } from "@/components/ui/SwipeProgress";
import { DESKTOP, prefersReducedMotion } from "@/hooks/useMotionPreferences";
import { cn } from "@/lib/cn";
import { gsap, useGSAP } from "@/lib/gsap";

import { scrollToTarget } from "./scroll-control";

interface HorizontalGalleryProps {
  children: ReactNode;
  className?: string;
  trackClassName?: string;
  label: string;
  /** Phones and tablets: show a position indicator below the row, counting this many items. */
  progress?: { count: number; className?: string };
}

/**
 * HorizontalCollectionGallery — with motion allowed, the row pins and
 * vertical scroll drives the track sideways: the whole section on desktop,
 * the row centred in the screen on phones and tablets. Without motion (or
 * JS) it is a native scroll-snap row.
 *
 * Keyboard: focusing an off-screen panel scrolls the page to the position
 * that brings it into view, since transformed content can't scroll itself.
 */
export function HorizontalGallery({ children, className, trackClassName, label, progress }: HorizontalGalleryProps) {
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLUListElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ desktop: DESKTOP, motion: "(prefers-reduced-motion: no-preference)" }, (context) => {
        const el = root.current;
        const tr = track.current;
        if (!el || !tr || !context.conditions?.motion) return;
        el.dataset.pinned = "";
        const distance = () => Math.max(0, tr.scrollWidth - el.clientWidth);
        const desktop = context.conditions.desktop;
        // Phones: hold the row mid-screen (or by its foot, if it is taller than
        // the screen), and let it come to rest with a panel at the gutter.
        const start = desktop ? "top top" : () => (el.offsetHeight > window.innerHeight ? "bottom bottom" : "center center");
        const panelStops = (value: number) => {
          const inset = parseFloat(getComputedStyle(tr).paddingLeft);
          const stops = Array.from(tr.children as HTMLCollectionOf<HTMLElement>, (item) => gsap.utils.clamp(0, 1, (item.offsetLeft - inset) / distance()));
          return gsap.utils.snap(stops, value);
        };

        const tween = gsap.to(tr, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start,
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            anticipatePin: 1,
            snap: desktop ? undefined : { snapTo: panelStops, duration: { min: 0.25, max: 0.7 }, delay: 0.1, ease: "power2.inOut" },
            onUpdate: (self) => void (tr.dataset.progress = self.progress.toFixed(4)),
          },
        });

        // Gentle depth: each photograph drifts against the direction of travel.
        for (const img of gsap.utils.toArray<HTMLElement>("[data-drift]", tr)) {
          gsap.fromTo(img, { xPercent: 6 }, { xPercent: -6, ease: "none", scrollTrigger: { trigger: img, containerAnimation: tween, start: "left right", end: "right left", scrub: true } });
        }

        const onFocus = (e: FocusEvent) => {
          const item = (e.target as HTMLElement).closest("li");
          const st = tween.scrollTrigger;
          if (!item || !st || !distance()) return;
          const progress = gsap.utils.clamp(0, 1, (item.offsetLeft - el.clientWidth * 0.1) / distance());
          scrollToTarget(st.start + progress * (st.end - st.start));
        };
        el.addEventListener("focusin", onFocus);

        return () => {
          delete el.dataset.pinned;
          delete tr.dataset.progress;
          el.removeEventListener("focusin", onFocus);
        };
      });

      // Native row: the browser's focus scroll can stop part-way, and mandatory
      // snapping then pulls the row back a panel, leaving the focused one
      // mostly off-screen. Bring it to its own snap point instead.
      const el = root.current;
      const onNativeFocus = (e: FocusEvent) => {
        if (!el || "pinned" in el.dataset) return;
        const item = (e.target as HTMLElement).closest("li");
        item?.scrollIntoView({ inline: "start", block: "nearest", behavior: prefersReducedMotion() ? "auto" : "smooth" });
      };
      el?.addEventListener("focusin", onNativeFocus);
      return () => el?.removeEventListener("focusin", onNativeFocus);
    },
    { scope: root },
  );

  return (
    // Clipped: while pinned, the moving track overflows sideways, and on phones
    // any overflow widens the layout viewport (aborting page transitions).
    <div ref={root} className={cn("group/gallery relative overflow-x-clip", className)}>
      <ul
        ref={track}
        id={id}
        aria-label={label}
        className={cn(
          "flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] group-data-pinned/gallery:snap-none group-data-pinned/gallery:overflow-visible [&::-webkit-scrollbar]:hidden",
          trackClassName,
        )}
      >
        {children}
      </ul>
      {progress && <SwipeProgress target={id} count={progress.count} className={cn("lg:group-data-pinned/gallery:hidden", progress.className)} />}
    </div>
  );
}
