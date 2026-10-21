"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, type CSSProperties } from "react";

import { SplitHeading } from "@/components/animation/SplitHeading";
import { Reveal } from "@/components/animation/Reveal";
import { SwipeProgress } from "@/components/ui/SwipeProgress";
import { media } from "@/content/media";
import { showroomScenes } from "@/content/showroom";
import { pad2 } from "@/lib/format";
import { gsap, useGSAP } from "@/lib/gsap";

const SCENES = showroomScenes;

const STAGED = "(min-width: 64rem) and (prefers-reduced-motion: no-preference)";
const STACKED = "(max-width: 63.99rem) and (prefers-reduced-motion: no-preference)";
const ROW = "(max-width: 63.99rem) and (prefers-reduced-motion: reduce)";

/** Where the walk has got to: the scene's number, name and caption, and a segment per scene. */
function StageCaption({ active, className }: { active: number; className?: string }) {
  const current = SCENES[active];
  return (
    <div aria-hidden className={className}>
      <p className="flex items-baseline gap-4">
        <span className="numeral text-2xl text-gold tabular-nums">{pad2(active + 1)}</span>
        <span className="text-sm text-ivory/65">/ {pad2(SCENES.length)}</span>
        <span className="label ml-2">{current.title}</span>
      </p>
      <p className="mt-3 line-clamp-2 min-h-[3.1em] max-w-sm text-[0.95rem] text-ivory/70">{current.caption}</p>
      <div className="mt-6 flex gap-2">
        {SCENES.map((scene, i) => (
          <span key={scene.key} className={`h-px flex-1 transition-colors duration-700 ${i <= active ? "bg-gold" : "bg-ivory/20"}`} />
        ))}
      </div>
    </div>
  );
}

/** Section 06 — a walk through the showroom. */
export function Experience() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const scenes = gsap.utils.toArray<HTMLElement>("[data-scene]", root.current);

      // A sticky stage; each photograph wipes up over the last. Desktop pins
      // the whole section, phones and tablets the stage below the words.
      const stage = (trigger: string) => {
        const tl = gsap.timeline({
          defaults: { ease: "none", duration: 1 },
          scrollTrigger: {
            trigger,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
            onUpdate: (self) => setActive(Math.round(self.progress * (SCENES.length - 1))),
          },
        });
        scenes.slice(1).forEach((scene, i) => {
          tl.fromTo(scene, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)" }, i)
            .fromTo(scene.querySelector("img"), { scale: 1.22, yPercent: 6 }, { scale: 1, yPercent: 0 }, i)
            .to(scenes[i].querySelector("img"), { scale: 1.08, yPercent: -5 }, i);
        });
        return () => setActive(0);
      };
      mm.add(STAGED, () => stage("[data-scenes]"));
      mm.add(STACKED, () => stage("[data-scene-row]"));

      // Without motion, phones get a swipe row of photographs, which keyboards need to reach.
      mm.add(ROW, () => {
        const row = root.current?.querySelector<HTMLElement>("[data-scene-row]");
        if (!row) return;
        row.tabIndex = 0;
        row.setAttribute("role", "group");
        row.setAttribute("aria-label", "Showroom scenes");
        return () => {
          row.removeAttribute("tabindex");
          row.removeAttribute("role");
          row.removeAttribute("aria-label");
        };
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} data-theme="dark" aria-labelledby="experience-title" className="relative z-10 bg-burgundy text-ivory">
      <div data-scenes className="relative lg:motion-safe:h-[400svh]">
        <div className="gutter grid grid-cols-12 gap-x-6 gap-y-14 py-24 lg:items-center lg:motion-safe:sticky lg:motion-safe:top-0 lg:motion-safe:h-svh lg:motion-safe:py-0 lg:motion-safe:pt-[var(--header-h)]">
          <div className="col-span-12 lg:col-span-4 lg:motion-reduce:sticky lg:motion-reduce:top-28 lg:motion-reduce:self-start">
            <p className="eyebrow text-gold-soft">
              <span className="numeral mr-2 text-base tracking-normal normal-case text-gold">04</span>The Digne experience
            </p>
            <SplitHeading id="experience-title" className="display-lg mt-7 uppercase">
              More than a store.
              <br />
              <em className="font-normal text-gold-soft">A destination for style.</em>
            </SplitHeading>
            <Reveal>
              <p className="lede mt-8 max-w-md text-ivory/80">
                Step inside Digne and the pace slows. Warm light on gold, rails arranged by colour, a lounge to sit and consider — and the time to try things on
                until the look is right.
              </p>
              <Link href="/the-showroom" className="link-line mt-8 text-ivory">
                Visit the showroom <span className="arrow" aria-hidden>→</span>
              </Link>
            </Reveal>

            <StageCaption active={active} className="mt-14 hidden border-t border-ivory/15 pt-6 lg:motion-safe:block" />
          </div>

          {/* With motion: a sticky stage — beside the words on desktop, below them (a
              tall track holding a screen-high stage) on phones and tablets. Without
              motion: a column on desktop, a swipe row on phones and tablets. */}
          <div
            id="scene-row"
            data-scene-row
            className="col-span-12 motion-safe:relative motion-safe:h-[300svh] motion-reduce:swipe-row motion-reduce:-mx-[var(--gutter)] motion-reduce:gap-4 motion-reduce:px-[var(--gutter)] sm:motion-reduce:gap-5 lg:col-span-7 lg:col-start-6 lg:motion-safe:h-[78svh] lg:motion-reduce:mx-0 lg:motion-reduce:grid lg:motion-reduce:grid-cols-1 lg:motion-reduce:gap-14 lg:motion-reduce:overflow-visible lg:motion-reduce:px-0"
          >
            <div className="motion-safe:sticky motion-safe:top-0 motion-safe:flex motion-safe:h-svh motion-safe:flex-col motion-safe:pt-[calc(var(--header-h)+0.5rem)] motion-safe:pb-8 motion-reduce:contents lg:motion-safe:static lg:motion-safe:block lg:motion-safe:h-full lg:motion-safe:p-0">
              <div className="motion-safe:relative motion-safe:min-h-0 motion-safe:flex-1 motion-reduce:contents lg:motion-safe:h-full">
                {SCENES.map((scene, i) => {
                  const asset = media[scene.key];
                  const crop = { "--crop": asset.focus.narrow, "--crop-wide": asset.focus.wide } as CSSProperties;
                  return (
                    <figure
                      key={scene.key}
                      data-scene
                      className="relative shrink-0 snap-start motion-safe:absolute motion-safe:inset-0 motion-safe:overflow-hidden motion-reduce:w-[80vw] sm:motion-reduce:w-[46vw] lg:motion-reduce:w-auto"
                      style={{ zIndex: i + 1 }}
                    >
                      <div data-frame className="relative overflow-hidden bg-burgundy-deep motion-safe:h-full motion-reduce:aspect-[4/5]">
                        <Image
                          src={asset.src}
                          alt={asset.alt}
                          fill
                          sizes="(min-width: 64rem) 58vw, (min-width: 40rem) 46vw, 90vw"
                          placeholder="blur"
                          className="object-cover [object-position:var(--crop)] lg:[object-position:var(--crop-wide)]"
                          style={crop}
                        />
                      </div>
                      <figcaption className="mt-4 motion-safe:sr-only">
                        <span className="numeral mr-3 text-gold">{pad2(i + 1)}</span>
                        <span className="label">{scene.title}</span>
                        <span className="mt-1.5 block text-[0.95rem] text-ivory/70">{scene.caption}</span>
                      </figcaption>
                    </figure>
                  );
                })}
              </div>
              <StageCaption active={active} className="mt-6 motion-reduce:hidden lg:hidden" />
            </div>
          </div>
          <SwipeProgress target="scene-row" className="col-span-12 -mt-6 text-ivory/80 motion-safe:hidden lg:hidden" />
        </div>
      </div>
    </section>
  );
}
