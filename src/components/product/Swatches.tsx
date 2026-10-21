import type { Piece } from "@/lib/commerce/schema";
import { cn } from "@/lib/cn";

/** Colours as quiet swatches, with the names available to assistive tech. */
export function Swatches({ colours, className, max = 6 }: { colours: Piece["colours"]; className?: string; max?: number }) {
  const shown = colours.slice(0, max);
  const label = colours.map((c) => c.name).join(", ");
  return (
    <p className={cn("flex items-center gap-1.5", className)}>
      <span className="sr-only">Colours: {label}</span>
      {shown.map((c) => (
        <span key={c.name} aria-hidden title={c.name} className="size-2.5 rounded-full ring-1 ring-charcoal/15" style={{ background: c.hex }} />
      ))}
      {colours.length > max && (
        <span aria-hidden className="text-xs text-muted">
          +{colours.length - max}
        </span>
      )}
    </p>
  );
}
