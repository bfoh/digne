import mark from "@/assets/brand/digne-mark.json";

interface DigneMarkProps {
  className?: string;
  /** "full" includes the "SUITS & MORE.." tagline; "lockup" is emblem + script only, for small sizes. */
  variant?: "full" | "lockup";
  title?: string;
}

/**
 * Vector trace of the supplied Digne badge artwork (emblem, script and
 * tagline), drawn in currentColor so it sits on any ground. Regenerate with
 * `npm run assets`. Replace with the master vector once Digne supplies it.
 */
export function DigneMark({ className, variant = "full", title }: DigneMarkProps) {
  return (
    <svg
      viewBox={mark.viewBox}
      className={className}
      fill="currentColor"
      fillRule="evenodd"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <path d={mark.emblem} />
      <path d={mark.script} />
      {variant === "full" && <path d={mark.tagline} />}
    </svg>
  );
}

/** The "Digne" script alone, for large signature moments (footer, closing). Decorative. */
export function DigneSignature({ className }: { className?: string }) {
  return (
    <svg viewBox={mark.scriptViewBox} className={className} fill="currentColor" fillRule="evenodd" aria-hidden>
      <path d={mark.script} />
    </svg>
  );
}

export const markViewBox = mark.viewBox;
export const markPaths = { emblem: mark.emblem, script: mark.script, tagline: mark.tagline };
