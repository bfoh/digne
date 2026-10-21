import Link from "next/link";

import { AnimatedTextReveal } from "@/components/animation/AnimatedTextReveal";
import { Reveal } from "@/components/animation/Reveal";
import { DigneBadge } from "@/components/brand/DigneBadge";
import { site } from "@/config/site";

const FACTS = [
  { index: "01", title: "In Agbogba, Accra", body: "A showroom to browse in person — rails, a lounge and time to try things on." },
  { index: "02", title: "Five collections", body: "Suits, blazers, shirts, trousers and occasionwear under one roof." },
  { index: "03", title: "Enquire your way", body: "Call, message on WhatsApp or request a visit — the showroom confirms availability." },
];

/** Section 03 — the brand statement. Slides over the sticky hero on scroll. */
export function Statement() {
  return (
    <section id="the-house" data-theme="light" aria-labelledby="statement-title" className="relative z-10 bg-ivory">
      <div className="gutter pt-24 pb-20 lg:pt-40 lg:pb-32">
        <div className="grid grid-cols-12 gap-x-6 gap-y-10">
          <Reveal className="col-span-12 flex items-center gap-5 lg:col-span-3 lg:flex-col lg:items-start lg:gap-7 lg:pt-4">
            <DigneBadge size={68} decorative className="size-14 lg:size-[68px]" />
            <p className="eyebrow text-muted">
              <span className="numeral mr-2 text-base tracking-normal normal-case text-heritage">01</span>The house of {site.shortName}
            </p>
          </Reveal>

          <AnimatedTextReveal
            as="h2"
            id="statement-title"
            className="col-span-12 font-display text-[clamp(2.35rem,6vw,6.9rem)] leading-[0.95] font-light tracking-[-0.015em] uppercase lg:col-span-9"
          >
            Style is not only what you wear. <em className="font-normal text-heritage">It is how you arrive.</em>
          </AnimatedTextReveal>
        </div>

        <div className="mt-14 grid grid-cols-12 gap-6 lg:mt-20">
          <Reveal className="col-span-12 md:col-span-8 md:col-start-5 lg:col-span-5 lg:col-start-7">
            <p className="lede text-charcoal/85">
              {site.name} is a destination for confident dressing in Accra — a showroom of suits, blazers, shirts, trousers and occasionwear, brought together
              so you can arrive well for the moments that matter, from the boardroom to the wedding aisle.
            </p>
            <Link href="/our-story" className="link-line mt-8 text-charcoal">
              Discover our story <span className="arrow" aria-hidden>→</span>
            </Link>
          </Reveal>
        </div>

        <Reveal as="ul" stagger={0.12} className="mt-20 grid border-t hairline md:grid-cols-3 lg:mt-28">
          {FACTS.map((fact) => (
            <li key={fact.index} data-reveal-item className="flex gap-6 border-b hairline py-7 md:border-b-0 md:py-9 md:pr-10 md:[&:not(:first-child)]:border-l md:[&:not(:first-child)]:pl-10">
              <span className="numeral text-2xl text-heritage">{fact.index}</span>
              <div>
                <h3 className="label">{fact.title}</h3>
                <p className="mt-2 text-[0.95rem] text-muted">{fact.body}</p>
              </div>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
