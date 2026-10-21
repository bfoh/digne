"use client";

import { X, ZoomIn } from "lucide-react";
import Image from "next/image";
import { useEffect, useState, ViewTransition, type KeyboardEvent } from "react";

import { Sheet } from "@/components/ui/Sheet";
import { media } from "@/content/media";
import type { MediaRef } from "@/lib/commerce/schema";
import { pad2 } from "@/lib/format";

import { ArrowButton, TrackDots, useSnapTrack } from "./MediaTrack";

interface ProductGalleryProps {
  slug: string;
  name: string;
  views: MediaRef[];
}

/**
 * The product page gallery. One track serves both layouts: a swipeable
 * carousel on phones and tablets, a column of large images on desktop that
 * scrolls beside the sticky details. Any image opens the lightbox.
 */
export function ProductGallery({ slug, name, views }: ProductGalleryProps) {
  const { ref, index, goTo } = useSnapTrack(views.length);
  const [zoomAt, setZoomAt] = useState<number | null>(null);

  return (
    <div className="relative">
      <div
        ref={ref}
        role="region"
        aria-label={`Images of ${name}`}
        className="no-scrollbar -mx-[var(--gutter)] flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain lg:mx-0 lg:grid lg:snap-none lg:gap-3 lg:overflow-visible"
      >
        {views.map((view, i) => {
          const asset = media[view.key];
          const frame = (
            <button
              type="button"
              onClick={() => setZoomAt(i)}
              aria-label={`Enlarge image ${i + 1} of ${views.length}`}
              className="relative block aspect-[4/5] w-full cursor-zoom-in overflow-hidden bg-cream"
            >
              <Image
                src={asset.src}
                alt={asset.alt}
                fill
                loading={i === 0 ? "eager" : "lazy"}
                fetchPriority={i === 0 ? "high" : "auto"}
                sizes="(min-width: 64rem) 56vw, 100vw"
                placeholder="blur"
                className="object-cover"
                style={{ objectPosition: view.focus ?? asset.focus.narrow }}
              />
            </button>
          );
          return (
            <div key={`${view.key}-${i}`} className="w-full shrink-0 snap-center lg:w-auto">
              {i === 0 ? (
                <ViewTransition name={`piece-${slug}`} share="morph" default="none">
                  {frame}
                </ViewTransition>
              ) : (
                frame
              )}
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => setZoomAt(index)}
        aria-label="Zoom image"
        className="absolute top-4 right-0 grid size-11 place-items-center rounded-full bg-ivory/90 text-charcoal backdrop-blur-sm transition-colors hover:bg-ivory lg:right-4"
      >
        <ZoomIn aria-hidden className="size-4" strokeWidth={1.3} />
      </button>
      <TrackDots count={views.length} index={index} onSelect={goTo} className="mt-3 lg:hidden" />

      <Lightbox name={name} views={views} start={zoomAt} onClose={() => setZoomAt(null)} />
    </div>
  );
}

function Lightbox({ name, views, start, onClose }: { name: string; views: MediaRef[]; start: number | null; onClose: () => void }) {
  const { ref, index, goTo } = useSnapTrack(views.length);
  const open = start !== null;

  // Runs after the sheet has opened (child effects first), so the track has width.
  useEffect(() => {
    if (start !== null) goTo(start, true);
  }, [start, goTo]);

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") goTo(index + 1);
    if (e.key === "ArrowLeft") goTo(index - 1);
  };

  return (
    <Sheet open={open} onClose={onClose} variant="lightbox" labelledBy="lightbox-title">
      <div className="relative h-full" onKeyDown={onKeyDown}>
        <h2 id="lightbox-title" className="sr-only">
          {name} — enlarged images
        </h2>
        <p aria-live="polite" className="numeral absolute top-5 left-[var(--gutter)] z-10 text-lg text-muted">
          {pad2(index + 1)} / {pad2(views.length)}
        </p>
        <div ref={ref} className="no-scrollbar flex h-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain">
          {views.map((view, i) => {
            const asset = media[view.key];
            return (
              <div key={`${view.key}-${i}`} className="relative h-full w-full shrink-0 snap-center">
                <Image src={asset.src} alt={asset.alt} fill sizes="100vw" quality={80} className="object-contain p-[max(1rem,5vh)] pb-24" />
              </div>
            );
          })}
        </div>
        <div className="absolute inset-x-0 bottom-6 flex items-center justify-center gap-3">
          {views.length > 1 && <ArrowButton direction="prev" label="Previous image" onClick={() => goTo(index - 1)} className="bg-charcoal/5 hover:bg-charcoal/10" />}
          <button
            type="button"
            onClick={onClose}
            data-autofocus=""
            aria-label="Close enlarged images"
            className="grid size-14 place-items-center rounded-full bg-charcoal text-ivory transition-colors hover:bg-burgundy"
          >
            <X aria-hidden className="size-5" strokeWidth={1.2} />
          </button>
          {views.length > 1 && <ArrowButton direction="next" label="Next image" onClick={() => goTo(index + 1)} className="bg-charcoal/5 hover:bg-charcoal/10" />}
        </div>
      </div>
    </Sheet>
  );
}
