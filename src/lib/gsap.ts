"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

// Registered once for the whole client bundle — importing this module is the
// only way components reach GSAP, so plugins are never registered twice.
gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

gsap.defaults({ ease: "expo.out", duration: 1.1 });
ScrollTrigger.config({ ignoreMobileResize: true });

/** Motion vocabulary shared by every component. */
export const ease = {
  editorial: "expo.out",
  mask: "power4.inOut",
  soft: "power2.out",
} as const;

export { gsap, ScrollTrigger, SplitText, useGSAP };
