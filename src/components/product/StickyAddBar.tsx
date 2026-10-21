"use client";

import { useEffect, useState, type RefObject } from "react";
import { createPortal } from "react-dom";

import { useHydrated } from "@/hooks/useHydrated";
import { cn } from "@/lib/cn";

interface StickyAddBarProps {
  /** The page's own add-to-bag button: the bar shows once it has scrolled away above. */
  anchor: RefObject<HTMLElement | null>;
  title: string;
  detail: string;
  action: string;
  onAction: () => void;
}

/**
 * Phones and tablets: once the visitor has scrolled past the product's
 * add-to-bag button, a slim bar keeps it within thumb's reach. It steps aside
 * over the footer, and is inert while hidden so it never takes focus.
 */
export function StickyAddBar({ anchor, title, detail, action, onAction }: StickyAddBarProps) {
  const hydrated = useHydrated();
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const button = anchor.current;
    const footer = document.querySelector("footer");
    if (!button) return;
    const state = { passed: false, footer: false };
    const sync = () => setShown(state.passed && !state.footer);

    // The viewport stretched far downwards: the button leaves it only by
    // passing the top edge, so even a jump straight past it registers.
    const passed = new IntersectionObserver(
      ([entry]) => {
        state.passed = !entry.isIntersecting;
        sync();
      },
      { rootMargin: "0px 0px 100000px 0px" },
    );
    const atFooter = new IntersectionObserver(([entry]) => {
      state.footer = entry.isIntersecting;
      sync();
    });
    passed.observe(button);
    if (footer) atFooter.observe(footer);
    return () => {
      passed.disconnect();
      atFooter.disconnect();
    };
  }, [anchor]);

  if (!hydrated) return null;

  return createPortal(
    <div
      inert={!shown}
      data-theme="light"
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t hairline bg-ivory/95 text-charcoal backdrop-blur-md transition-transform duration-500 ease-editorial lg:hidden",
        shown ? "translate-y-0" : "translate-y-full",
      )}
    >
      <div className="gutter flex items-center gap-4 py-3">
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-[1.15rem] leading-tight">{title}</p>
          <p className="mt-0.5 truncate text-xs text-muted">{detail}</p>
        </div>
        <button type="button" onClick={onAction} className="btn shrink-0 px-5">
          {action}
        </button>
      </div>
    </div>,
    document.body,
  );
}
