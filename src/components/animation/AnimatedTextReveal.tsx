"use client";

import { useRef, type ElementType, type ReactNode } from "react";

import { prefersReducedMotion } from "@/hooks/useMotionPreferences";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";

interface AnimatedTextRevealProps {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  id?: string;
  /**
   * Opacity of words before they are "inked". Keep it at or above 0.58 so
   * un-inked display text still meets WCAG's 3:1 for large text — charcoal
   * needs 0.48 on ivory, heritage red 0.56.
   */
  from?: number;
}

/**
 * AnimatedTextReveal — words ink in one by one as the passage scrolls through
 * the viewport, pacing a manifesto line to the reader's own scroll.
 * Reserved for one or two statements per page; never for body copy.
 */
export function AnimatedTextReveal({ as: Tag = "p", children, className, id, from = 0.58 }: AnimatedTextRevealProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;
      SplitText.create(el, {
        type: "words",
        aria: "auto",
        autoSplit: true,
        onSplit: (self) =>
          gsap.fromTo(
            self.words,
            { opacity: from },
            {
              opacity: 1,
              stagger: 0.08,
              ease: "none",
              scrollTrigger: { trigger: el, start: "top 78%", end: "bottom 42%", scrub: 0.6 },
            },
          ),
      });
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} id={id} className={className}>
      {children}
    </Tag>
  );
}
