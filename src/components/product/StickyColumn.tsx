"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import { cn } from "@/lib/cn";

const GAP = 24;

/**
 * A "safe" sticky column for desktop. When the column is shorter than the
 * viewport it sticks below the header; when it is taller, it scrolls with the
 * page until its end is in view and sticks there — so nothing is unreachable.
 */
export function StickyColumn({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [top, setTop] = useState<number>();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const header = document.querySelector<HTMLElement>("body > header");
      const offset = (header?.offsetHeight ?? 72) + GAP;
      const height = el.offsetHeight;
      setTop(height + offset > window.innerHeight ? window.innerHeight - height - GAP : offset);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    window.addEventListener("resize", update);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div ref={ref} className={cn("lg:sticky", className)} style={{ top }}>
      {children}
    </div>
  );
}
