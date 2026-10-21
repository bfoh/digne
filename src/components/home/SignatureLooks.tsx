"use client";

import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { useRef, useState } from "react";

import { Reveal } from "@/components/animation/Reveal";
import { media, type MediaKey } from "@/content/media";
import { DESKTOP, prefersReducedMotion } from "@/hooks/useMotionPreferences";
import { pad2 } from "@/lib/format";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { route } from "@/lib/route";

const LOOKS: { key: MediaKey; title: string; body: string; href: Route; cta: string }[] = [
  {
    key: "burgundy",
    title: "The Formal Edit",
    body: "Tonal burgundy, a double-breasted waistcoat and a flash of gold at the collar — for the meeting that matters and the evening after.",
    href: route("/products/burgundy-waistcoat-ensemble"),
    cta: "View the ensemble",
  },
  {
    key: "embellished",
    title: "The Statement Edit",
    body: "Black, lit at the shoulder by pearl and bead — the jacket that answers the dress code without raising its voice.",
    href: route("/products/pearl-shoulder-evening-blazer"),
    cta: "View the blazer",
  },
  {
    key: "suitSelection",
    title: "The Everyday Refined Edit",
    body: "Royal blue, grey check and cream — jackets that turn a plain shirt and trousers into a considered look.",
    href: route("/collections/blazers"),
    cta: "Explore blazers",
  },
];

const DECK = "(max-width: 63.99rem) and (prefers-reduced-motion: no-preference)";

/** Section 07 — three styling moods. Editorial groupings, not inventory categories. */
export function SignatureLooks() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const shown = useRef(0);

  useGSAP(
    () => {
      const blocks = gsap.utils.toArray<HTMLElement>("[data-look]", root.current);
      const mm = gsap.matchMedia();

      // Desktop: each look takes the stage when its text block crosses the middle of the viewport.
      mm.add(DESKTOP, () => {
        blocks.forEach((block, i) =>
          ScrollTrigger.create({
            trigger: block,
            start: "top 55%",
            end: "bottom 55%",
            onToggle: (self) => self.isActive && setActive(i),
          }),
        );
      });

      // Phones and tablets: the looks are a deck of sticky cards. Each card's
      // photograph settles from a zoom as it slides up over the last, as on
      // the desktop stage, and the card beneath settles back. Positions are
      // measured from the list, because a stuck card no longer sits where it
      // was laid out.
      mm.add(DECK, () => {
        const list = root.current?.querySelector<HTMLElement>("[data-look-list]");
        if (!list) return;
        const laidOutTop = (i: number) => list.getBoundingClientRect().top + window.scrollY + blocks.slice(0, i).reduce((y, el) => y + el.offsetHeight, 0);
        const stuckAt = (block: HTMLElement) => parseFloat(getComputedStyle(block).top);
        blocks.forEach((block, i) =>
          gsap.fromTo(
            block.querySelector("[data-look-photo] img"),
            { scale: 1.18 },
            {
              scale: 1,
              ease: "none",
              scrollTrigger: { start: () => laidOutTop(i) - window.innerHeight, end: () => laidOutTop(i) - stuckAt(block), scrub: true, invalidateOnRefresh: true },
            },
          ),
        );
        blocks.slice(0, -1).forEach((block, i) => {
          const next = blocks[i + 1];
          gsap
            .timeline({
              defaults: { ease: "none" },
              scrollTrigger: {
                start: () => laidOutTop(i + 1) - window.innerHeight,
                end: () => laidOutTop(i + 1) - stuckAt(next),
                scrub: true,
                invalidateOnRefresh: true,
              },
            })
            .to(block.querySelector("[data-look-card]"), { scale: 0.93 }, 0)
            .to(block.querySelector("[data-look-dim]"), { opacity: 0.6 }, 0);
        });
      });
    },
    { scope: root },
  );

  // The incoming photograph wipes up over the outgoing one.
  useGSAP(
    () => {
      const from = shown.current;
      if (from === active) return;
      shown.current = active;
      const layers = gsap.utils.toArray<HTMLElement>("[data-look-media]", root.current);
      const next = layers[active];
      const prev = layers[from];
      gsap.set(layers, { zIndex: 0 });
      gsap.set(prev, { zIndex: 1 });
      gsap.set(next, { zIndex: 2, autoAlpha: 1 });
      if (prefersReducedMotion()) {
        gsap.set(layers.filter((l) => l !== next), { autoAlpha: 0 });
        return;
      }
      gsap
        .timeline({ onComplete: () => void gsap.set(prev, { autoAlpha: 0 }) })
        .fromTo(next, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.25, ease: "power4.inOut" })
        .fromTo(next.querySelector("img"), { scale: 1.18 }, { scale: 1, duration: 1.8, ease: "expo.out" }, 0);
    },
    { scope: root, dependencies: [active] },
  );

  return (
    <section ref={root} data-theme="light" aria-labelledby="looks-title" className="relative z-10 bg-cream">
      <div className="lg:grid lg:grid-cols-2">
        {/* Desktop: the sticky photograph. */}
        <div className="relative hidden lg:block">
          <div className="sticky top-0 h-svh overflow-hidden bg-charcoal">
            {LOOKS.map((look, i) => (
              <div key={look.key} data-look-media className="absolute inset-0 overflow-hidden" style={{ visibility: i === 0 ? "visible" : "hidden", zIndex: i === 0 ? 2 : 0 }}>
                <Image
                  src={media[look.key].src}
                  alt={media[look.key].alt}
                  fill
                  sizes="50vw"
                  placeholder="blur"
                  className="object-cover"
                  style={{ objectPosition: media[look.key].focus.wide }}
                />
              </div>
            ))}
            <p aria-hidden className="absolute bottom-6 left-[var(--gutter)] z-10 flex items-baseline gap-3 text-ivory">
              <span className="numeral text-2xl tabular-nums">{pad2(active + 1)}</span>
              <span className="text-sm text-ivory/60">/ {pad2(LOOKS.length)}</span>
            </p>
          </div>
        </div>

        <div className="gutter py-24 lg:py-0 lg:pr-[calc(var(--gutter)*2)] lg:pl-[7vw]">
          <div className="lg:flex lg:min-h-[60svh] lg:flex-col lg:justify-end lg:pt-40">
            <p className="eyebrow text-muted">
              <span className="numeral mr-2 text-base tracking-normal normal-case text-heritage">05</span>Signature looks
            </p>
            <h2 id="looks-title" className="display-md mt-6 max-w-md">
              Three moods, styled from the showroom rails.
            </h2>
          </div>

          <ol data-look-list className="mt-12 lg:mt-0">
            {LOOKS.map((look, i) => {
              const asset = media[look.key];
              return (
                <li
                  key={look.key}
                  data-look
                  className="sticky pb-4 lg:static lg:flex lg:min-h-svh lg:items-center lg:pb-0"
                  style={{ top: `calc(0.75rem + ${i * 0.625}rem)` }}
                >
                  {/* Phones and tablets: a card, the photograph behind the words. Desktop: the words, beside the sticky photograph. */}
                  <div
                    data-look-card
                    className="relative flex h-[min(80svh,46rem)] origin-top flex-col justify-end overflow-hidden bg-charcoal text-ivory [--focus:var(--color-gold)] lg:block lg:[--focus:var(--color-heritage)] lg:h-auto lg:w-full lg:overflow-visible lg:bg-transparent lg:text-charcoal"
                  >
                    <div data-look-photo className="absolute inset-0 overflow-hidden lg:hidden">
                      <Image src={asset.src} alt={asset.alt} fill sizes="(min-width: 40rem) 90vw, 100vw" placeholder="blur" className="object-cover" style={{ objectPosition: asset.focus.narrow }} />
                      <span aria-hidden className="absolute inset-0 bg-[linear-gradient(to_top,rgb(18_10_11/0.94)_0%,rgb(18_10_11/0.6)_36%,rgb(18_10_11/0)_62%)]" />
                      <span aria-hidden data-look-dim className="absolute inset-0 bg-noir opacity-0" />
                    </div>
                    <Reveal className="relative p-6 sm:p-9 lg:p-0">
                      <p className="flex items-baseline gap-4 border-b border-ivory/25 pb-4 lg:border-[var(--line)] lg:pb-5">
                        <span className="numeral text-3xl text-gold-soft lg:text-4xl lg:text-heritage">{pad2(i + 1)}</span>
                        <span className="label text-ivory/75 lg:text-muted">/ Edit</span>
                      </p>
                      <h3 className="mt-5 font-display text-[clamp(2.2rem,4.2vw,4.6rem)] leading-[0.98] font-light uppercase lg:mt-7">{look.title}</h3>
                      <p className="mt-4 max-w-md text-[0.98rem] leading-relaxed text-ivory/85 lg:lede lg:mt-6 lg:text-charcoal/80">{look.body}</p>
                      <Link href={look.href} className="link-line mt-6 text-ivory lg:mt-8 lg:text-charcoal">
                        {look.cta} <span className="arrow" aria-hidden>→</span>
                      </Link>
                    </Reveal>
                  </div>
                </li>
              );
            })}
          </ol>
          <p className="pt-4 pb-16 text-xs text-muted lg:pt-0 lg:pb-24">Edits are editorial groupings styled from pieces photographed in the showroom.</p>
        </div>
      </div>
    </section>
  );
}
