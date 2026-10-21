"use client";

import { Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { site, telHref } from "@/config/site";

interface HandoffNoticeProps {
  href: string;
  message: string;
  title: string;
  children: React.ReactNode;
  onReset: () => void;
}

/**
 * Shown once a form has handed its message to WhatsApp. It says plainly that
 * nothing has been sent yet, and offers ways through if WhatsApp didn't open.
 */
export function HandoffNotice({ href, message, title, children, onReset }: HandoffNoticeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => ref.current?.focus(), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div ref={ref} tabIndex={-1} role="status" className="border hairline p-7 outline-none lg:p-10">
      <p className="eyebrow flex items-center gap-2.5 text-heritage">
        <Check aria-hidden className="size-4" strokeWidth={1.6} />
        Ready in WhatsApp
      </p>
      <h2 className="display-sm mt-4">{title}</h2>
      <div className="mt-4 grid gap-3 text-[0.95rem] leading-relaxed text-charcoal/80">{children}</div>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <a href={href} target="_blank" rel="noopener noreferrer" className="btn">
          Open WhatsApp <span className="arrow" aria-hidden>↗</span>
          <span className="sr-only">(opens WhatsApp)</span>
        </a>
        <a href={telHref} className="btn btn-outline">
          Call {site.phone.display}
        </a>
      </div>
      <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
        <button type="button" onClick={copy} className="link-under">
          {copied ? "Message copied" : "Copy the message"}
        </button>
        <button type="button" onClick={onReset} className="link-under text-muted hover:text-charcoal">
          Edit your details
        </button>
      </div>
    </div>
  );
}

/** Opens WhatsApp in a new tab from a submit handler. Returns false if the browser blocked it. */
export function openWhatsApp(href: string): boolean {
  const win = window.open(href, "_blank");
  if (win) win.opener = null;
  return Boolean(win);
}
