"use client";

import Link from "next/link";
import { useRef } from "react";

import { Magnetic } from "@/components/animation/Magnetic";
import { DESKTOP, prefersReducedMotion } from "@/hooks/useMotionPreferences";
import { gsap, useGSAP } from "@/lib/gsap";

/** Section 09 — the closing line, drawn across the page by the reader's scroll. */
export function Closing() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      // Phones have less spare width: a slightly shorter drift keeps both lines
      // in frame by the time the section is centred.
      const drift = window.matchMedia(DESKTOP).matches ? 1 : 0.8;
      const scrollTrigger = { trigger: root.current, start: "top bottom", end: "bottom top", scrub: 0.8 };
      gsap
        .timeline({ defaults: { ease: "none" }, scrollTrigger })
        .fromTo("[data-line='1']", { xPercent: -14 * drift }, { xPercent: 6 * drift }, 0)
        .fromTo("[data-line='2']", { xPercent: 16 * drift }, { xPercent: -4 * drift }, 0)
        .fromTo("[data-rule]", { scaleX: 0 }, { scaleX: 1 }, 0);
    },
    { scope: root },
  );

  return (
    <section ref={root} data-theme="light" aria-labelledby="closing-title" className="relative z-10 overflow-hidden bg-ivory pt-24 pb-20 lg:pt-36 lg:pb-28">
      <h2 id="closing-title" className="font-display leading-[0.84] font-light text-burgundy">
        <span data-line="1" className="gutter block text-[clamp(4.6rem,26vw,19rem)] whitespace-nowrap uppercase lg:text-[clamp(4.6rem,17vw,19rem)]">
          Dress
        </span>
        <span data-line="2" className="gutter block text-right text-[clamp(2.6rem,12vw,16rem)] whitespace-nowrap italic lg:text-[clamp(3.4rem,14vw,16rem)]">
          with intention.
        </span>
      </h2>

      <div className="gutter mt-14 lg:mt-20">
        <span data-rule aria-hidden className="block h-px origin-left bg-charcoal/20" />
        <div className="mt-10 flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <p className="lede max-w-md text-charcoal/80">Suits, blazers, shirts, trousers and occasionwear — browse online, then see them in person in Agbogba.</p>
          <Magnetic>
            <Link href="/collections" className="btn">
              Explore the collections <span className="arrow" aria-hidden>→</span>
            </Link>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
