"use client";

import { ArrowDown, Pause, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type TouchEvent } from "react";

import { onIntro } from "@/components/animation/intro-state";
import { Magnetic } from "@/components/animation/Magnetic";
import { Reveal } from "@/components/animation/Reveal";
import { SplitHeading } from "@/components/animation/SplitHeading";
import { site } from "@/config/site";
import { media, type MediaKey } from "@/content/media";
import { prefersReducedMotion } from "@/hooks/useMotionPreferences";
import { cn } from "@/lib/cn";
import { pad2 } from "@/lib/format";
import { gsap, useGSAP } from "@/lib/gsap";

const SLIDES: { key: MediaKey; label: string }[] = [
  { key: "burgundy", label: "The Formal Edit" },
  { key: "embellished", label: "The Statement Edit" },
  { key: "charcoal", label: "The Occasion Edit" },
];

const INTERVAL_S = 7;

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  /** Slideshow is in automatic mode (off under reduced motion until the visitor presses play). */
  const [autoplay, setAutoplay] = useState(false);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(true);
  const previous = useRef(0);
  const transition = useRef<gsap.core.Timeline | null>(null);

  // Autoplay starts after the brand intro, never under reduced motion.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    return onIntro(() => setAutoplay(true));
  }, []);

  // Pause while off-screen or in a background tab.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    const onVisibility = () => setInView(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  // Intro: the photograph settles from a slow zoom as the curtain lifts.
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const first = root.current?.querySelector("[data-slide='0'] img");
      if (!first) return;
      const tween = gsap.fromTo(first, { scale: 1.12 }, { scale: 1, duration: 2.6, ease: "expo.out", paused: true });
      return onIntro(() => tween.play());
    },
    { scope: root },
  );

  // Scroll-out: the hero recedes while the next section slides over it. The hero
  // is sticky, so measure from its static wrapper rather than the hero itself.
  useGSAP(
    () => {
      const wrapper = root.current?.parentElement;
      if (!wrapper || prefersReducedMotion()) return;
      const scrollTrigger = { trigger: wrapper, start: "top top", end: () => `+=${window.innerHeight}`, scrub: true };
      gsap
        .timeline({ defaults: { ease: "none" }, scrollTrigger })
        .to("[data-hero-content]", { yPercent: -18, autoAlpha: 0.15 }, 0)
        .to("[data-hero-media]", { scale: 1.06 }, 0)
        .to("[data-hero-dim]", { opacity: 0.65 }, 0);
    },
    { scope: root },
  );

  // Slide change: the new photograph wipes in over the old one.
  useGSAP(
    () => {
      const from = previous.current;
      if (from === active) return;
      previous.current = active;
      const slides = gsap.utils.toArray<HTMLElement>("[data-slide]", root.current);
      const next = slides[active];
      const prev = slides[from];
      if (prefersReducedMotion()) {
        gsap.set(slides, { autoAlpha: 0, zIndex: 0 });
        gsap.set(next, { autoAlpha: 1, zIndex: 2, clipPath: "none" });
        return;
      }
      transition.current?.progress(1);
      gsap.set(slides, { zIndex: 0 });
      gsap.set(prev, { zIndex: 1 });
      gsap.set(next, { zIndex: 2, autoAlpha: 1 });
      transition.current = gsap
        .timeline({ onComplete: () => void gsap.set(prev, { autoAlpha: 0 }) })
        .fromTo(next, { clipPath: "inset(0% 0% 0% 100%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: "power4.inOut" })
        .fromTo(next.querySelector("img"), { scale: 1.16, xPercent: 4 }, { scale: 1, xPercent: 0, duration: 2.2, ease: "expo.out" }, 0)
        .to(prev.querySelector("img"), { xPercent: -6, duration: 1.5, ease: "power4.inOut" }, 0)
        .set(prev.querySelector("img"), { xPercent: 0 })
        .fromTo("[data-slide-label]", { yPercent: 110 }, { yPercent: 0, duration: 1.1, ease: "expo.out" }, 0.45);
    },
    { scope: root, dependencies: [active] },
  );

  const advance = () => setActive((i) => (i + 1) % SLIDES.length);

  // Phones: a horizontal swipe anywhere on the hero changes the look; vertical drags still scroll.
  const swipe = useRef<{ x: number; y: number } | null>(null);
  const onTouchStart = (e: TouchEvent) => {
    const t = e.touches[0];
    swipe.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e: TouchEvent) => {
    const start = swipe.current;
    swipe.current = null;
    const t = e.changedTouches[0];
    if (!start || !t) return;
    const dx = t.clientX - start.x;
    if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(t.clientY - start.y) * 1.5) return;
    setActive((i) => (i + (dx < 0 ? 1 : SLIDES.length - 1)) % SLIDES.length);
  };
  const running = autoplay && !paused && inView;
  const togglePlayback = () => {
    if (!autoplay) {
      setAutoplay(true);
      setPaused(false);
    } else setPaused((p) => !p);
  };

  return (
    <section
      ref={root}
      data-theme="dark"
      aria-label="Introduction"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      className="sticky top-0 h-svh min-h-[36rem] overflow-hidden bg-noir text-ivory"
    >
      {/* Media: full-bleed on small screens, the right-hand panel from lg. */}
      <div data-hero-media className="absolute inset-0 origin-center lg:left-[44%]">
        {SLIDES.map((slide, i) => (
          <div
            key={slide.key}
            data-slide={i}
            className="absolute inset-0 overflow-hidden"
            style={{ visibility: i === 0 ? "visible" : "hidden", zIndex: i === 0 ? 2 : 0 }}
            aria-hidden={i !== active}
          >
            <Image
              src={media[slide.key].src}
              alt={media[slide.key].alt}
              fill
              loading={i === 0 ? "eager" : "lazy"}
              fetchPriority={i === 0 ? "high" : "auto"}
              sizes="(min-width: 64rem) 56vw, 100vw"
              quality={80}
              placeholder="blur"
              className="object-cover"
              style={{ objectPosition: media[slide.key].focus.narrow }}
            />
          </div>
        ))}
        {/* Legibility: a low fade on phones; a soft seam into the dark panel on desktop. */}
        <div aria-hidden className="absolute inset-0 z-[3] bg-[linear-gradient(to_top,rgb(18_10_11/0.94)_0%,rgb(18_10_11/0.55)_42%,rgb(18_10_11/0.12)_70%,rgb(18_10_11/0.35)_100%)] lg:bg-[linear-gradient(to_right,rgb(18_10_11/0.92)_0%,rgb(18_10_11/0.35)_30%,transparent_58%)]" />
        {/* Keep the header and the slide controls legible over bright photographs. */}
        <div aria-hidden className="absolute inset-x-0 top-0 z-[3] h-44 bg-gradient-to-b from-noir/60 to-transparent" />
        <div aria-hidden className="absolute inset-x-0 bottom-0 z-[3] hidden h-48 bg-gradient-to-t from-noir/75 to-transparent lg:block" />
        <div data-hero-dim aria-hidden className="absolute inset-0 z-[4] bg-noir opacity-0" />
      </div>

      <div data-hero-content className="gutter relative z-10 flex h-full flex-col justify-end pt-[var(--header-h)] pb-24 lg:justify-center lg:pb-12">
        <Reveal play="intro" delay={0.1} className="eyebrow mb-6 flex items-center gap-4 text-gold-soft lg:mb-9">
          <span aria-hidden className="h-px w-8 bg-gold" />
          <span>
            {/* The header carries the name on phones; one line keeps the eyebrow clear of it. */}
            <span className="max-sm:hidden">{site.name} — </span>
            {site.address.city}, {site.address.country}
          </span>
        </Reveal>

        <SplitHeading
          as="h1"
          play="intro"
          delay={0.15}
          stagger={0.11}
          className="font-display text-[clamp(2.9rem,12.4vw,4.6rem)] leading-[0.92] font-light tracking-[-0.01em] uppercase lg:text-[clamp(4rem,7.1vw,8.9rem)] lg:leading-[0.88]"
        >
          <span className="block">The Art of</span>
          <span className="block">
            Dressing <br className="lg:hidden" />
            <em className="font-normal not-italic lg:italic lg:normal-case">Well.</em>
          </span>
        </SplitHeading>

        <Reveal play="intro" delay={0.4} stagger={0.1} className="mt-6 flex flex-col gap-6 sm:mt-7 sm:gap-8 lg:mt-10 lg:max-w-[34rem]">
          <p data-reveal-item className="lede max-w-[34ch] text-ivory/82">
            Discover confident formalwear, refined silhouettes, and statement pieces for the moments that matter.
          </p>
          <div data-reveal-item className="flex flex-col gap-3 sm:flex-row">
            <Magnetic>
              <Link href="/collections" className="btn btn-light w-full sm:w-auto">
                Explore collections <span className="arrow" aria-hidden>→</span>
              </Link>
            </Magnetic>
            <Link href="/the-showroom" className="btn btn-outline-light">
              Visit our showroom
            </Link>
          </div>
        </Reveal>
      </div>

      {/* Slide index, label, pause control and scroll cue. */}
      <Reveal play="intro" delay={0.75} className="gutter absolute inset-x-0 bottom-0 z-20 flex items-center justify-between gap-3 pb-6 sm:gap-6 lg:pb-8">
        <div className="flex items-center gap-4 sm:gap-6">
          <span className="numeral text-lg whitespace-nowrap tabular-nums" aria-hidden>
            {pad2(active + 1)} <span className="text-ivory/65">/ {pad2(SLIDES.length)}</span>
          </span>
          <span className="relative block h-px w-10 overflow-hidden bg-ivory/20 sm:w-24" aria-hidden>
            <span
              key={active}
              className="timed-progress absolute inset-0 origin-left scale-x-0 bg-gold"
              style={{
                animationName: autoplay ? "progress-grow" : "none",
                animationDuration: `${INTERVAL_S}s`,
                animationTimingFunction: "linear",
                animationFillMode: "forwards",
                animationPlayState: running ? "running" : "paused",
                ["--timed-duration" as string]: `${INTERVAL_S}s`,
              }}
              onAnimationEnd={advance}
            />
          </span>
          {/* Phones have no room for the label; the look buttons name each slide. */}
          <span className="hidden overflow-hidden sm:block">
            <span data-slide-label className="eyebrow block whitespace-nowrap">
              {SLIDES[active].label}
            </span>
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-6">
          <div className="flex" role="group" aria-label="Choose a look">
            {SLIDES.map((slide, i) => (
              <button
                key={slide.key}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Show look ${i + 1}: ${slide.label}`}
                aria-pressed={i === active}
                className="grid min-h-11 min-w-8 place-items-center sm:min-w-9"
              >
                <span className={cn("block h-px transition-all duration-700 ease-editorial", i === active ? "w-6 bg-gold" : "w-3 bg-ivory/45")} />
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={togglePlayback}
            aria-label={autoplay && !paused ? "Pause slideshow" : "Play slideshow"}
            className="grid size-11 place-items-center border border-ivory/25 transition-colors duration-500 hover:border-ivory"
          >
            {autoplay && !paused ? <Pause aria-hidden className="size-3.5" strokeWidth={1.5} /> : <Play aria-hidden className="size-3.5" strokeWidth={1.5} />}
          </button>
          <span className="eyebrow flex items-center gap-3 max-[22rem]:hidden" aria-hidden>
            <span className="hidden lg:inline">Scroll to explore</span> <ArrowDown className="scroll-cue size-3.5" strokeWidth={1.25} />
          </span>
        </div>
      </Reveal>
    </section>
  );
}
