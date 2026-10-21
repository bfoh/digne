import Image from "next/image";

import badge from "@/assets/brand/digne-badge.png";

/** The full-colour circular Digne badge, as supplied (AI-assisted reconstruction — see docs). */
export function DigneBadge({ size = 96, className, decorative = false }: { size?: number; className?: string; decorative?: boolean }) {
  return (
    <Image
      src={badge}
      alt={decorative ? "" : "Digne Suits & More badge"}
      width={size}
      height={size}
      sizes={`${size}px`}
      className={className}
    />
  );
}
