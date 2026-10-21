"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";

import { media } from "@/content/media";
import { prefersReducedMotion } from "@/hooks/useMotionPreferences";
import type { MediaRef } from "@/lib/commerce/schema";
import { cn } from "@/lib/cn";

/**
 * A horizontal scroll-snap track: swipe, trackpad and keyboard all work
 * natively; `index` follows the scroll position.
 */
export function useSnapTrack(count: number) {
  const ref = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const track = ref.current;
    if (!track) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const w = track.clientWidth;
        if (w) setIndex(Math.min(count - 1, Math.max(0, Math.round(track.scrollLeft / w))));
      });
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      track.removeEventListener("scroll", onScroll);
    };
  }, [count]);

  const goTo = useCallback(
    (i: number, instant = false) => {
      const track = ref.current;
      if (!track || count < 1) return;
      const next = (i + count) % count;
      track.scrollTo({ left: next * track.clientWidth, behavior: instant || prefersReducedMotion() ? "instant" : "smooth" });
    },
    [count],
  );

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      goTo(index + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      goTo(index - 1);
    }
  };

  return { ref, index, goTo, onKeyDown };
}

export function TrackDots({ count, index, onSelect, className }: { count: number; index: number; onSelect: (i: number) => void; className?: string }) {
  if (count < 2) return null;
  return (
    <div className={cn("flex items-center justify-center gap-1", className)}>
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          type="button"
          aria-label={`Show image ${i + 1} of ${count}`}
          aria-current={i === index ? "true" : undefined}
          onClick={() => onSelect(i)}
          className="grid size-7 place-items-center"
        >
          <span aria-hidden className={cn("size-1.5 rounded-full bg-current transition-opacity duration-300", i === index ? "opacity-100" : "opacity-30")} />
        </button>
      ))}
    </div>
  );
}

export function ArrowButton({ direction, onClick, label, className }: { direction: "prev" | "next"; onClick: () => void; label: string; className?: string }) {
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn("grid size-11 place-items-center rounded-full bg-ivory/90 text-charcoal backdrop-blur-sm transition-colors duration-300 hover:bg-ivory", className)}
    >
      <Icon aria-hidden className="size-4" strokeWidth={1.3} />
    </button>
  );
}

/** The quick-view gallery: one view per slide, dots below, arrows on phones. */
export function PieceGallery({ name, views, sizes, className }: { name: string; views: MediaRef[]; sizes: string; className?: string }) {
  const { ref, index, goTo, onKeyDown } = useSnapTrack(views.length);
  return (
    <div className={cn("relative", className)}>
      <div
        ref={ref}
        role="region"
        aria-roledescription="carousel"
        aria-label={`Images of ${name}`}
        tabIndex={0}
        onKeyDown={onKeyDown}
        className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain"
      >
        {views.map((view, i) => {
          const asset = media[view.key];
          return (
            <div key={`${view.key}-${i}`} className="relative aspect-[4/5] w-full shrink-0 snap-center bg-cream">
              <Image
                src={asset.src}
                alt={asset.alt}
                fill
                sizes={sizes}
                placeholder="blur"
                className="object-cover"
                style={{ objectPosition: view.focus ?? asset.focus.narrow }}
              />
            </div>
          );
        })}
      </div>
      {views.length > 1 && (
        <>
          <ArrowButton direction="prev" label="Previous image" onClick={() => goTo(index - 1)} className="absolute top-1/2 left-3 -translate-y-1/2 md:hidden" />
          <ArrowButton direction="next" label="Next image" onClick={() => goTo(index + 1)} className="absolute top-1/2 right-3 -translate-y-1/2 md:hidden" />
        </>
      )}
      <TrackDots count={views.length} index={index} onSelect={goTo} className="mt-3" />
    </div>
  );
}
