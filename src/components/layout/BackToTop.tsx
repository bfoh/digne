"use client";

import { ArrowUp } from "lucide-react";

import { scrollToTarget } from "@/components/animation/scroll-control";

export function BackToTop() {
  return (
    <button
      type="button"
      onClick={() => {
        scrollToTarget(0);
        document.getElementById("main")?.focus({ preventScroll: true });
      }}
      className="group flex min-h-11 items-center gap-3"
    >
      <span className="eyebrow">Back to top</span>
      <span className="grid size-9 place-items-center border border-ivory/25 transition-colors duration-500 group-hover:border-gold group-hover:text-gold">
        <ArrowUp aria-hidden className="size-4 transition-transform duration-500 ease-editorial group-hover:-translate-y-0.5" strokeWidth={1.25} />
      </span>
    </button>
  );
}
