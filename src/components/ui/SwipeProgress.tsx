"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/cn";
import { pad2 } from "@/lib/format";

interface SwipeProgressProps {
  /** id of the swipe row to follow. */
  target: string;
  /** Items to count, if the row holds more than its cards (e.g. a closing link). */
  count?: number;
  className?: string;
}

/**
 * Where you are in a swipe row: a hairline whose gold thumb follows the
 * scroll, between the current and total counts. Decorative — the row itself
 * is the control. A row that the page's scroll moves instead publishes its
 * progress in `data-progress`.
 */
export function SwipeProgress({ target, count, className }: SwipeProgressProps) {
  const thumb = useRef<HTMLSpanElement>(null);
  const [state, setState] = useState({ index: 0, total: count ?? 0 });

  useEffect(() => {
    const row = document.getElementById(target);
    if (!row) return;
    let frame = 0;

    const update = () => {
      frame = 0;
      const max = row.scrollWidth - row.clientWidth;
      const visible = row.scrollWidth > 0 ? Math.min(1, row.clientWidth / row.scrollWidth) : 1;
      const driven = row.dataset.progress;
      const progress = driven !== undefined ? Number(driven) : max > 0 ? row.scrollLeft / max : 0;
      if (thumb.current) {
        thumb.current.style.width = `${visible * 100}%`;
        thumb.current.style.transform = `translateX(${((progress * (1 - visible)) / visible) * 100}%)`;
      }
      const total = count ?? row.children.length;
      const index = Math.round(progress * (total - 1));
      setState((s) => (s.index === index && s.total === total ? s : { index, total }));
    };
    const queue = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    row.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    return () => {
      cancelAnimationFrame(frame);
      row.removeEventListener("scroll", queue);
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
    };
  }, [target, count]);

  return (
    <div aria-hidden className={cn("flex items-center gap-4", className)}>
      <span className="numeral w-6 text-sm tabular-nums">{pad2(state.index + 1)}</span>
      <span className="relative h-px flex-1 overflow-hidden bg-current/20">
        <span ref={thumb} className="absolute inset-y-0 left-0 w-1/4 bg-gold" />
      </span>
      <span className="numeral w-6 text-right text-sm tabular-nums">{pad2(state.total)}</span>
    </div>
  );
}
