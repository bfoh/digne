"use client";

import { useEffect, useState } from "react";

import { useUI } from "@/stores/ui";

/** A polite live region that also shows a brief visual confirmation (e.g. "Saved"). */
export function Announcer() {
  const notice = useUI((s) => s.notice);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!notice) return;
    const show = requestAnimationFrame(() => setVisible(true));
    const hide = window.setTimeout(() => setVisible(false), 2800);
    return () => {
      cancelAnimationFrame(show);
      window.clearTimeout(hide);
    };
  }, [notice]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={`pointer-events-none fixed bottom-6 left-1/2 z-[95] -translate-x-1/2 bg-ink px-5 py-3 text-sm text-ivory transition-[opacity,transform] duration-500 ease-editorial ${visible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}
    >
      {notice?.text}
    </div>
  );
}
