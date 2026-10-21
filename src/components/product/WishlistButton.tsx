"use client";

import { Heart } from "lucide-react";

import { useHydrated } from "@/hooks/useHydrated";
import { cn } from "@/lib/cn";
import { useUI } from "@/stores/ui";
import { useWishlist } from "@/stores/wishlist";

interface WishlistButtonProps {
  slug: string;
  name: string;
  className?: string;
  variant?: "overlay" | "inline";
}

export function WishlistButton({ slug, name, className, variant = "overlay" }: WishlistButtonProps) {
  const hydrated = useHydrated();
  const saved = useWishlist((s) => s.slugs.includes(slug)) && hydrated;
  const toggle = useWishlist((s) => s.toggle);
  const announce = useUI((s) => s.announce);

  const onClick = () => {
    const nowSaved = toggle(slug);
    announce(nowSaved ? `${name} saved to your pieces` : `${name} removed from saved pieces`);
  };

  if (variant === "inline") {
    return (
      <button type="button" onClick={onClick} aria-pressed={saved} className={cn("btn btn-outline", className)}>
        <Heart aria-hidden className={cn("size-4 transition-colors", saved && "fill-current")} strokeWidth={1.4} />
        {saved ? "Saved" : "Save piece"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${name} from saved pieces` : `Save ${name}`}
      className={cn(
        "grid size-11 place-items-center bg-ivory/90 text-charcoal backdrop-blur-sm transition-colors duration-500 hover:bg-ivory",
        saved && "text-heritage",
        className,
      )}
    >
      <Heart aria-hidden className={cn("size-[1.05rem] transition-transform duration-500 ease-editorial", saved && "scale-110 fill-current")} strokeWidth={1.4} />
    </button>
  );
}
