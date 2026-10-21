"use client";

import { X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { lockScroll, unlockScroll } from "@/components/animation/scroll-control";
import { DigneMark } from "@/components/brand/DigneMark";
import { collectionNav, menuNav, serviceNav } from "@/config/navigation";
import { formattedAddress, site, telHref } from "@/config/site";
import { media } from "@/content/media";
import { prefersReducedMotion } from "@/hooks/useMotionPreferences";
import { cn } from "@/lib/cn";
import { gsap, useGSAP } from "@/lib/gsap";
import { whatsappHref } from "@/lib/whatsapp";
import { useUI } from "@/stores/ui";

/**
 * StaggeredNavigation — the full-screen menu. A native modal <dialog> provides
 * the accessibility contract (inert background, Escape, focus return); GSAP
 * adds the curtain and the staggered type.
 */
export function MenuOverlay() {
  const open = useUI((s) => s.menuOpen);
  const setOpen = useUI((s) => s.setMenuOpen);
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      tl.current = gsap
        .timeline({ paused: true, defaults: { ease: "expo.out" } })
        .fromTo("[data-menu-panel]", { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.95, ease: "power4.inOut" })
        .fromTo("[data-menu-media]", { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.1, ease: "power4.inOut" }, 0.3)
        .fromTo("[data-menu-link]", { yPercent: 105 }, { yPercent: 0, duration: 1.1, stagger: 0.075 }, 0.5)
        .fromTo("[data-menu-fade]", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.05 }, 0.7);
    },
    { scope: dialogRef },
  );

  useEffect(() => {
    const dialog = dialogRef.current;
    const timeline = tl.current;
    if (!dialog || !timeline) return;
    const reduce = prefersReducedMotion();

    if (open && !dialog.open) {
      setActive(Math.max(0, menuNav.findIndex((item) => pathname.startsWith(item.href))));
      dialog.showModal();
      lockScroll();
      timeline.eventCallback("onReverseComplete", null);
      if (reduce) timeline.progress(1);
      else timeline.timeScale(1).play(0);
    } else if (!open && dialog.open) {
      unlockScroll();
      // Closed before the opening timeline's first tick: there is nothing to
      // reverse, and onReverseComplete would never fire.
      if (reduce || timeline.time() === 0) {
        timeline.pause(0);
        dialog.close();
      } else {
        timeline.eventCallback("onReverseComplete", () => dialog.close());
        timeline.timeScale(1.7).reverse();
      }
    }
  }, [open, pathname]);

  // Any navigation closes the menu (covers browser back/forward too).
  useEffect(() => {
    setOpen(false);
  }, [pathname, setOpen]);

  const close = () => setOpen(false);
  const current = menuNav[active];

  return (
    <dialog
      ref={dialogRef}
      id="site-menu"
      aria-label="Site menu"
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
      className="m-0 h-dvh max-h-none w-full max-w-none bg-transparent p-0 text-ivory backdrop:bg-transparent"
    >
      <div data-menu-panel data-theme="dark" className="flex h-full flex-col overflow-y-auto bg-burgundy" data-lenis-prevent>
        <div className="gutter grid h-[var(--header-h)] shrink-0 grid-cols-[1fr_auto_1fr] items-center">
          <span data-menu-fade className="eyebrow text-gold-soft">
            {site.address.locality}, {site.address.city}
          </span>
          <Link href="/" onNavigate={close} aria-label="Digne Suits & More — home" className="block py-2">
            <DigneMark variant="lockup" className="h-10 w-auto lg:h-12" />
          </Link>
          <button type="button" onClick={close} autoFocus className="flex min-h-11 items-center gap-3 justify-self-end">
            <span className="eyebrow">Close</span>
            <X aria-hidden className="size-5" strokeWidth={1.25} />
          </button>
        </div>

        <div className="gutter grid flex-1 grid-cols-1 gap-12 pb-10 pt-8 lg:grid-cols-12 lg:gap-8 lg:pt-4">
          <nav aria-label="Menu" className="lg:col-span-7 lg:self-center">
            <ul className="flex flex-col">
              {menuNav.map((item, i) => (
                <li key={item.href} className="border-b border-ivory/12 first:border-t">
                  <Link
                    href={item.href}
                    onNavigate={close}
                    onPointerEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    aria-current={pathname.startsWith(item.href) ? "page" : undefined}
                    className="group flex items-baseline gap-5 overflow-hidden py-3 lg:gap-8 lg:py-4"
                  >
                    <span data-menu-link className="numeral w-8 shrink-0 text-base text-gold lg:text-lg">
                      {item.index}
                    </span>
                    <span data-menu-link className="display-xl block transition-[transform,color] duration-700 ease-editorial group-hover:translate-x-3 group-hover:text-gold-soft">
                      {item.label}
                    </span>
                    <span data-menu-fade className="ml-auto hidden text-sm text-muted-dark xl:block">
                      {item.note}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            {/* Phones: the collections as a swipeable strip of covers. */}
            <ul data-menu-fade className="swipe-row -mx-[var(--gutter)] mt-8 gap-2.5 px-[var(--gutter)] lg:hidden" aria-label="Collections">
              {collectionNav.map((item) => {
                const asset = media[item.thumb.key];
                return (
                  <li key={item.href} className="w-[30vw] max-w-36 shrink-0 snap-start">
                    <Link href={item.href} onNavigate={close} className="press group block">
                      <span className="relative block aspect-[3/4] overflow-hidden bg-burgundy-deep">
                        <Image src={asset.src} alt="" fill sizes="30vw" className="object-cover" style={{ objectPosition: item.thumb.focus ?? asset.focus.narrow }} />
                        <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-noir/60 to-transparent to-60%" />
                      </span>
                      <span className="eyebrow mt-2.5 block text-ivory/85">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
            <ul data-menu-fade className="mt-7 hidden flex-wrap gap-x-6 gap-y-2 lg:flex" aria-label="Collections">
              {collectionNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} onNavigate={close} className="link-line text-ivory/80 hover:text-ivory">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="hidden lg:col-span-4 lg:col-start-9 lg:flex lg:flex-col lg:justify-center">
            <div data-menu-media className="relative aspect-[4/5] w-full overflow-hidden bg-burgundy-deep">
              {menuNav.map((item, i) => (
                <Image
                  key={item.href}
                  src={media[item.media].src}
                  alt=""
                  fill
                  sizes="30vw"
                  className={cn("object-cover transition-[opacity,transform] duration-1000 ease-editorial", i === active ? "scale-100 opacity-100" : "scale-105 opacity-0")}
                  style={{ objectPosition: media[item.media].focus.narrow }}
                />
              ))}
            </div>
            <p data-menu-fade className="mt-4 flex justify-between text-sm text-muted-dark">
              <span className="numeral text-gold">{current.index}</span>
              <span>{current.note}</span>
            </p>
          </div>
        </div>

        <div className="gutter grid shrink-0 grid-cols-2 gap-6 border-t border-ivory/12 py-6 text-sm sm:grid-cols-4">
          <div data-menu-fade>
            <p className="eyebrow mb-2 text-gold-soft">Visit</p>
            <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer" className="hover:text-gold-soft">
              {formattedAddress}
            </a>
          </div>
          <div data-menu-fade>
            <p className="eyebrow mb-2 text-gold-soft">Call</p>
            <a href={telHref} className="hover:text-gold-soft">
              {site.phone.display}
            </a>
          </div>
          <div data-menu-fade>
            <p className="eyebrow mb-2 text-gold-soft">Message</p>
            <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className="hover:text-gold-soft">
              WhatsApp
            </a>
          </div>
          <ul data-menu-fade className="flex flex-col gap-1">
            {serviceNav.filter((item) => item.href !== "/contact").map((item) => (
              <li key={item.href}>
                <Link href={item.href} onNavigate={close} className="hover:text-gold-soft">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </dialog>
  );
}
