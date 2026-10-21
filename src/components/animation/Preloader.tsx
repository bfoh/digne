"use client";

import { useRef } from "react";

import { markPaths, markViewBox } from "@/components/brand/DigneMark";
import { gsap, useGSAP } from "@/lib/gsap";

import { hydratedTooLate, LATE_HYDRATION_MS } from "./boot";
import { releaseIntro } from "./intro-state";

const LAYERS = ["emblem", "script", "tagline"] as const;

/**
 * Brand reveal on the first full page load of a session. Visibility is
 * decided in CSS before first paint (see the head script in the root layout),
 * so returning visitors and reduced-motion users never see it, and a CSS
 * failsafe lifts it if scripts fail. Click or press any key to skip.
 */
export function Preloader() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      const html = document.documentElement;
      if (!root || html.dataset.motion !== "full" || "introSeen" in html.dataset) return;

      const q = gsap.utils.selector(root);
      const finish = () => {
        html.dataset.introSeen = "";
        try {
          sessionStorage.setItem("digne:intro", "1");
        } catch {
          /* storage unavailable — the intro may simply play again */
        }
      };

      if (hydratedTooLate()) {
        gsap.set(root, { display: "none" });
        finish();
        releaseIntro();
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: "expo.out" }, onComplete: finish });
      tl.fromTo(q('[data-layer="emblem"]'), { clipPath: "inset(100% 0% 0% 0%)", y: 28 }, { clipPath: "inset(0% 0% 0% 0%)", y: 0, duration: 1.4 }, 0.15)
        .fromTo(q('[data-layer="script"]'), { clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, ease: "power3.inOut" }, 0.65)
        .fromTo(q('[data-layer="tagline"]'), { autoAlpha: 0, x: -14 }, { autoAlpha: 1, x: 0, duration: 1 }, 1.3)
        .fromTo(q("[data-rule]"), { scaleX: 0 }, { scaleX: 1, duration: 1.7, ease: "power3.inOut" }, 0.3)
        .fromTo(q("[data-place]"), { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.9 }, 1.45)
        .addLabel("exit", 2.2)
        .add(releaseIntro, "exit")
        .to(q("[data-mark]"), { yPercent: -22, autoAlpha: 0, duration: 0.9, ease: "power3.in" }, "exit")
        .to(root, { clipPath: "inset(0% 0% 100% 0%)", duration: 1.15, ease: "power4.inOut" }, "exit+=0.12")
        .set(root, { display: "none" });

      // Composed at a measured pace, played a little brisker: the brand moment
      // should introduce the homepage, not hold it back.
      tl.timeScale(1.35);
      // A slow device has already shown a dark screen while hydrating — don't make it wait twice.
      if (performance.now() > LATE_HYDRATION_MS) tl.seek(tl.labels.exit - 0.6);

      const skip = () => {
        if (tl.time() < tl.labels.exit) tl.seek("exit");
      };
      root.addEventListener("pointerdown", skip);
      window.addEventListener("keydown", skip);
      return () => {
        root.removeEventListener("pointerdown", skip);
        window.removeEventListener("keydown", skip);
      };
    },
    { scope: ref },
  );

  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-theme="dark"
      className="preloader fixed inset-0 z-[100] place-items-center bg-noir text-ivory"
      style={{ background: "radial-gradient(70% 60% at 50% 46%, #3a0710 0%, #120a0b 72%)" }}
    >
      <div data-mark className="flex flex-col items-center">
        <div className="relative aspect-[635/615] w-[clamp(9.5rem,17vw,14.5rem)]">
          {LAYERS.map((layer) => (
            <svg key={layer} data-layer={layer} viewBox={markViewBox} className="absolute inset-0 size-full" fill="currentColor" fillRule="evenodd">
              <path d={markPaths[layer]} />
            </svg>
          ))}
        </div>
        <span data-rule className="mt-9 block h-px w-36 origin-center bg-gold" />
        <span data-place className="eyebrow mt-5 text-gold-soft">
          Agbogba · Accra
        </span>
      </div>
    </div>
  );
}
