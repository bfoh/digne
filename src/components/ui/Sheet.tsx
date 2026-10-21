"use client";

import { useEffect, useRef, type ReactNode } from "react";

import { lockScroll, unlockScroll } from "@/components/animation/scroll-control";
import { cn } from "@/lib/cn";

export type SheetVariant = "modal" | "drawer" | "lightbox";

interface SheetProps {
  open: boolean;
  onClose: () => void;
  /** modal: centred card (a bottom sheet on phones) · drawer: slides in from the right · lightbox: full screen. */
  variant: SheetVariant;
  labelledBy: string;
  id?: string;
  className?: string;
  children: ReactNode;
}

/**
 * A native modal <dialog> (inert background, Escape, focus return) with CSS
 * enter/exit animations. Closing plays the exit animation first, then closes
 * the dialog, so the page underneath stays inert until the panel has gone.
 * Mark the control that should receive focus on open with `data-autofocus`.
 */
export function Sheet({ open, onClose, variant, labelledBy, id, className, children }: SheetProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const locked = useRef(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    const panel = panelRef.current;
    if (!dialog || !panel) return;

    if (open) {
      if (!dialog.open) {
        dialog.showModal();
        // The scrollable panel would otherwise take focus first; start on the marked control.
        panel.querySelector<HTMLElement>("[data-autofocus]")?.focus();
      }
      dialog.dataset.state = "open";
      if (!locked.current) {
        lockScroll();
        locked.current = true;
      }
      return;
    }
    if (!dialog.open) return;

    dialog.dataset.state = "closed";
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      panel.removeEventListener("animationend", onEnd);
      window.clearTimeout(fallback);
      dialog.close();
      if (locked.current) {
        unlockScroll();
        locked.current = false;
      }
    };
    const onEnd = (e: AnimationEvent) => {
      if (e.target === panel) finish();
    };
    panel.addEventListener("animationend", onEnd);
    const fallback = window.setTimeout(finish, 700);
    return () => {
      panel.removeEventListener("animationend", onEnd);
      window.clearTimeout(fallback);
    };
  }, [open]);

  // Never leave the page locked if the sheet unmounts while open.
  useEffect(
    () => () => {
      if (locked.current) unlockScroll();
    },
    [],
  );

  return (
    <dialog
      ref={dialogRef}
      id={id}
      aria-labelledby={labelledBy}
      data-variant={variant}
      data-lenis-prevent
      className="sheet"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        // A click on the dialog itself (not the panel) is a click on the backdrop.
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div ref={panelRef} className={cn("sheet-panel", className)}>
        {children}
      </div>
    </dialog>
  );
}
