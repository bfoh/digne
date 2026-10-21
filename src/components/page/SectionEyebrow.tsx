import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

interface SectionEyebrowProps {
  index: string;
  children: ReactNode;
  tone?: "light" | "dark";
  /** Render as a heading when the label is the section's title. */
  as?: "p" | "h2" | "h3";
  id?: string;
  className?: string;
}

/** The numbered section label used across editorial pages: "01  The name". */
export function SectionEyebrow({ index, children, tone = "light", as: Tag = "p", id, className }: SectionEyebrowProps) {
  return (
    <Tag id={id} className={cn("eyebrow", tone === "dark" ? "text-gold-soft" : "text-muted", className)}>
      <span className={cn("numeral mr-2 text-base tracking-normal normal-case", tone === "dark" ? "text-gold" : "text-heritage")}>{index}</span>
      {children}
    </Tag>
  );
}
