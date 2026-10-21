"use client";

import { Heart, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { DigneMark } from "@/components/brand/DigneMark";
import { headerNav } from "@/config/navigation";
import { useHydrated } from "@/hooks/useHydrated";
import { cn } from "@/lib/cn";
import { bagCount, useBag } from "@/stores/bag";
import { useUI } from "@/stores/ui";
import { useWishlist } from "@/stores/wishlist";

type Theme = "light" | "dark";

/** Reads the theme of whichever section currently sits beneath the header. */
function themeBeneath(header: HTMLElement): Theme {
  const y = header.offsetHeight / 2;
  for (const el of document.elementsFromPoint(window.innerWidth / 2, y)) {
    // The preloader covers the page on first load; the header belongs to what lies beneath it.
    if (header.contains(el) || el.closest(".preloader")) continue;
    const host = el.closest<HTMLElement>("[data-theme]");
    if (host) return host.dataset.theme === "dark" ? "dark" : "light";
  }
  return "light";
}

export function SiteHeader() {
  const pathname = usePathname();
  const ref = useRef<HTMLElement>(null);
  const [theme, setTheme] = useState<Theme>("dark");
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const menuOpen = useUI((s) => s.menuOpen);
  const setMenuOpen = useUI((s) => s.setMenuOpen);
  const bagOpen = useUI((s) => s.bagOpen);
  const setBagOpen = useUI((s) => s.setBagOpen);
  const hydrated = useHydrated();
  const saved = useWishlist((s) => s.slugs.length);
  const inBag = useBag((s) => bagCount(s.lines));

  useEffect(() => {
    const header = ref.current;
    if (!header) return;
    let lastY = window.scrollY;
    let frame = 0;

    const sample = () => {
      frame = 0;
      const y = window.scrollY;
      setTheme(themeBeneath(header));
      setSolid(y > 12);
      if (Math.abs(y - lastY) > 8) {
        setHidden(y > lastY && y > header.offsetHeight * 4);
        lastY = y;
      }
    };
    const queue = () => {
      if (!frame) frame = requestAnimationFrame(sample);
    };

    setHidden(false);
    queue();
    // Route content may still be settling (transitions, images) — sample again shortly after.
    const settle = window.setTimeout(queue, 900);
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(settle);
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
    };
  }, [pathname]);

  const dark = theme === "dark";
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      ref={ref}
      style={{ viewTransitionName: "site-header" }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[transform,background-color,color,border-color] duration-700 ease-[var(--ease-editorial)]",
        hidden && !menuOpen ? "-translate-y-full" : "translate-y-0",
        dark ? "text-ivory" : "text-charcoal",
        solid ? (dark ? "border-b border-ivory/10 bg-noir/92 backdrop-blur-md" : "border-b border-charcoal/10 bg-ivory/92 backdrop-blur-md") : "border-b border-transparent",
      )}
    >
      <div className="gutter grid h-[var(--header-h)] grid-cols-[1fr_auto_1fr] items-center gap-4">
        <div className="flex items-center">
          <button
            type="button"
            className="-ml-2 flex min-h-11 items-center gap-3 px-2 lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            onClick={() => setMenuOpen(true)}
          >
            <MenuGlyph />
            <span className="eyebrow">Menu</span>
          </button>
          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-9">
              {headerNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className="eyebrow relative py-3 after:absolute after:inset-x-0 after:bottom-1.5 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-700 after:ease-[var(--ease-mask)] hover:after:scale-x-100 aria-[current=page]:after:scale-x-100"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <Link href="/" aria-label="Digne Suits & More — home" className="block py-2">
          <DigneMark variant="lockup" className={cn("h-10 w-auto transition-colors duration-700 lg:h-12", dark ? "text-ivory" : "text-burgundy")} />
        </Link>

        <div className="flex items-center justify-end gap-1 lg:gap-7">
          <Link href="/wishlist" className="relative flex min-h-11 min-w-11 items-center justify-center gap-2" aria-label={`Saved pieces${hydrated ? `, ${saved} saved` : ""}`}>
            <Heart aria-hidden className="size-[1.15rem] lg:hidden" strokeWidth={1.4} />
            <span className="eyebrow hidden lg:inline">Saved</span>
            <Count value={hydrated ? saved : 0} />
          </Link>
          <button
            type="button"
            onClick={() => setBagOpen(true)}
            aria-haspopup="dialog"
            aria-controls="bag-drawer"
            aria-expanded={bagOpen}
            className="relative flex min-h-11 min-w-11 items-center justify-center gap-2"
            aria-label={`Enquiry bag${hydrated ? `, ${inBag} ${inBag === 1 ? "item" : "items"}` : ""}`}
          >
            <ShoppingBag aria-hidden className="size-[1.15rem] lg:hidden" strokeWidth={1.4} />
            <span className="eyebrow hidden lg:inline">Bag</span>
            <Count value={hydrated ? inBag : 0} />
          </button>
          <button
            type="button"
            className="hidden min-h-11 items-center gap-3 lg:flex"
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            onClick={() => setMenuOpen(true)}
          >
            <span className="eyebrow">Menu</span>
            <MenuGlyph />
          </button>
        </div>
      </div>
    </header>
  );
}

/** "(2)" beside the label on desktop; on phones a small badge that appears only when there is something to count. */
function Count({ value }: { value: number }) {
  return (
    <>
      <span aria-hidden className="eyebrow hidden tabular-nums lg:inline">
        ({value})
      </span>
      {value > 0 && (
        <span
          aria-hidden
          className="absolute top-1.5 right-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-heritage px-1 text-[0.625rem] leading-none font-semibold text-ivory tabular-nums lg:hidden"
        >
          {value}
        </span>
      )}
    </>
  );
}

function MenuGlyph() {
  return (
    <span aria-hidden className="flex w-6 flex-col gap-[5px]">
      <span className="h-px w-full bg-current" />
      <span className="h-px w-2/3 bg-current" />
    </span>
  );
}
