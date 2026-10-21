import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";

import { AnimatedTextReveal } from "@/components/animation/AnimatedTextReveal";
import { ImageReveal } from "@/components/animation/ImageReveal";
import { PageTransition } from "@/components/animation/PageTransition";
import { Reveal } from "@/components/animation/Reveal";
import { SplitHeading } from "@/components/animation/SplitHeading";
import { TouchPeek } from "@/components/animation/TouchPeek";
import { DigneBadge } from "@/components/brand/DigneBadge";
import { PageHero } from "@/components/page/PageHero";
import { SectionEyebrow } from "@/components/page/SectionEyebrow";
import { site } from "@/config/site";
import { media, type MediaKey } from "@/content/media";
import { getCategories, getPiecesInCategory } from "@/lib/commerce/catalogue";
import { pad2 } from "@/lib/format";
import { breadcrumbJsonLd, jsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Our Story",
  description: "Digne Suits & More is a formalwear showroom in Agbogba, Accra — suits, blazers, shirts, trousers and occasionwear under one roof.",
  path: "/our-story",
});

/*
 * TODO(business): the founder's story, when the showroom opened and why it's
 * called Digne. Until Digne shares those, this page describes only what can be
 * seen and done in the showroom — no dates, biographies or claims.
 */

const PRINCIPLES = [
  { title: "Dress for the occasion", body: "A wedding, a new role, a celebration — the right look starts with where you’re going and who you’ll be standing beside." },
  { title: "Take your time", body: "Good dressing isn’t rushed. Browse, try it on, sit with it in the lounge, and come back to it if you need to." },
  { title: "Ask, don’t guess", body: "Fit, colour and availability are best settled in person, so every enquiry is answered by the showroom itself." },
];

const SPREAD: { key: MediaKey; caption: string }[] = [
  { key: "boutique", caption: "The floor — shirts, trousers and suits, laid out to browse." },
  { key: "suitSelection", caption: "Suits on the rail, ready to be tried on." },
];

export default function OurStoryPage() {
  const categories = getCategories().map((c) => ({ ...c, count: getPiecesInCategory(c.slug).length }));
  const [wide, tall] = SPREAD.map((s) => ({ ...s, asset: media[s.key] }));

  return (
    <PageTransition>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(breadcrumbJsonLd([{ name: "Our Story", path: "/our-story" }]))} />
      <PageHero
        eyebrow="The house of Digne"
        title="Our story"
        summary="A showroom in Agbogba, Accra, built around a simple belief: the right clothes change how you arrive."
        image={{ key: "reception" }}
      />

      {/* 01 — what Digne is */}
      <section data-theme="light" aria-labelledby="story-intro" className="bg-ivory">
        <div className="gutter grid grid-cols-12 gap-x-6 gap-y-10 pt-24 pb-20 lg:pt-36 lg:pb-28">
          <Reveal className="col-span-12 flex items-center gap-5 lg:col-span-3 lg:flex-col lg:items-start lg:gap-7 lg:pt-4">
            <DigneBadge size={68} decorative className="size-14 lg:size-[68px]" />
            <SectionEyebrow index="01">The house</SectionEyebrow>
          </Reveal>
          <AnimatedTextReveal
            as="h2"
            id="story-intro"
            className="col-span-12 font-display text-[clamp(2.2rem,5.4vw,6.2rem)] leading-[0.96] font-light tracking-[-0.015em] uppercase lg:col-span-9"
          >
            One showroom. Five collections. <em className="font-normal text-heritage">Every look, under one roof.</em>
          </AnimatedTextReveal>
          <Reveal className="col-span-12 grid gap-6 md:col-span-8 md:col-start-5 lg:col-span-5 lg:col-start-7">
            <p className="lede text-charcoal/85">
              {site.name} is a formalwear showroom in Agbogba, Accra. Suits, blazers, shirts, trousers and occasionwear hang side by side, so a whole look —
              jacket, shirt, trouser — can come together in a single visit.
            </p>
            <p className="text-[0.98rem] leading-relaxed text-muted">
              It’s a place to take your time: browse the rails, sit in the lounge, try things on and ask questions. Sizes, availability and prices are
              confirmed with you in person, so what you choose is what’s actually on the rail.
            </p>
          </Reveal>
        </div>
      </section>

      {/* 02 — a photographic spread */}
      <section data-theme="light" aria-label="Inside the showroom" className="bg-ivory pb-24 lg:pb-36">
        <div className="gutter grid grid-cols-12 items-end gap-x-6 gap-y-12">
          <figure className="col-span-12 md:col-span-7">
            <ImageReveal className="relative aspect-[4/3] bg-cream">
              <div className="absolute inset-0">
                <Image src={wide.asset.src} alt={wide.asset.alt} fill sizes="(min-width: 48rem) 58vw, 100vw" placeholder="blur" className="object-cover" style={{ objectPosition: wide.asset.focus.wide }} />
              </div>
            </ImageReveal>
            <figcaption className="mt-4 text-sm text-muted">
              <span className="numeral mr-3 text-heritage">i.</span>
              {wide.caption}
            </figcaption>
          </figure>
          <figure className="col-span-10 col-start-3 md:col-span-4 md:col-start-9 md:-mb-24">
            <ImageReveal className="relative aspect-[3/4] bg-cream" direction="down">
              <div className="absolute inset-0">
                <Image src={tall.asset.src} alt={tall.asset.alt} fill sizes="(min-width: 48rem) 33vw, 84vw" placeholder="blur" className="object-cover" style={{ objectPosition: tall.asset.focus.narrow }} />
              </div>
            </ImageReveal>
            <figcaption className="mt-4 text-sm text-muted">
              <span className="numeral mr-3 text-heritage">ii.</span>
              {tall.caption}
            </figcaption>
          </figure>
        </div>
      </section>

      {/* 03 — principles */}
      <section data-theme="dark" aria-labelledby="principles-title" className="bg-burgundy text-ivory">
        <div className="gutter pt-24 pb-24 md:pt-40 lg:pt-48 lg:pb-32">
          <div className="grid grid-cols-12 gap-x-6 gap-y-8">
            <div className="col-span-12 lg:col-span-4">
              <SectionEyebrow index="02" tone="dark">
                What we believe
              </SectionEyebrow>
            </div>
            <SplitHeading id="principles-title" className="display-xl col-span-12 uppercase lg:col-span-8">
              Three things
              <br />
              <em className="font-normal text-gold-soft">we hold to.</em>
            </SplitHeading>
          </div>
          <Reveal as="ol" stagger={0.12} className="mt-16 grid border-t border-ivory/15 md:grid-cols-3 lg:mt-24">
            {PRINCIPLES.map((p, i) => (
              <li
                key={p.title}
                data-reveal-item
                className="grid gap-5 border-b border-ivory/15 py-9 md:border-b-0 md:py-12 md:pr-10 md:[&:not(:first-child)]:border-l md:[&:not(:first-child)]:pl-10"
              >
                <span className="numeral text-4xl text-gold">{pad2(i + 1)}</span>
                <h3 className="display-sm">{p.title}</h3>
                <p className="text-[0.95rem] leading-relaxed text-ivory/75">{p.body}</p>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      {/* 04 — the collections */}
      <section data-theme="light" aria-labelledby="roof-title" className="bg-ivory">
        <div className="gutter pt-24 pb-24 lg:pt-36 lg:pb-32">
          <div className="grid grid-cols-12 gap-x-6 gap-y-8">
            <div className="col-span-12 lg:col-span-4">
              <SectionEyebrow index="03">Under one roof</SectionEyebrow>
            </div>
            <SplitHeading id="roof-title" className="display-lg col-span-12 uppercase lg:col-span-8">
              What you’ll find
              <br />
              <em className="font-normal text-heritage">on the rails.</em>
            </SplitHeading>
          </div>
          <ul className="mt-14 border-t hairline lg:mt-20">
            {categories.map((c, i) => {
              const asset = media[c.media.key];
              return (
                <li key={c.slug} className="border-b hairline">
                  <Link
                    href={`/collections/${c.slug}` as Route}
                    data-cursor="Explore"
                    className="group relative grid grid-cols-[2.5rem_1fr_auto] items-center gap-x-4 gap-y-2 py-7 sm:grid-cols-[3.5rem_minmax(0,1fr)_minmax(0,1.1fr)_auto] lg:grid-cols-[5rem_minmax(0,1fr)_7rem_minmax(0,1fr)_auto] lg:py-9"
                  >
                    <span className="numeral col-start-1 row-start-1 text-xl text-heritage">{pad2(i + 1)}</span>
                    <span className="display-md col-start-2 row-start-1 transition-transform duration-700 ease-[var(--ease-editorial)] group-hover:translate-x-3 group-peek:translate-x-3">{c.title}</span>
                    {/* Floats over the row on hover, so it never sets the row's height. On
                        phones it takes the index's place while the row is mid-screen. */}
                    <span aria-hidden className="pointer-events-none absolute top-7 left-0 h-11 w-10 sm:hidden lg:pointer-events-auto lg:relative lg:top-auto lg:col-start-3 lg:row-start-1 lg:block lg:h-auto lg:w-auto lg:self-stretch">
                      <span className="absolute top-1/2 left-1/2 z-10 aspect-[4/5] w-10 -translate-x-1/2 -translate-y-1/2 scale-90 overflow-hidden bg-cream opacity-0 transition-[opacity,scale] duration-500 ease-[var(--ease-editorial)] group-hover:scale-100 group-hover:opacity-100 group-peek:scale-100 group-peek:opacity-100 lg:w-28">
                        <Image src={asset.src} alt="" fill sizes="7rem" className="object-cover" style={{ objectPosition: c.media.focus ?? asset.focus.narrow }} />
                      </span>
                    </span>
                    <span className="col-span-2 col-start-2 row-start-2 text-[0.95rem] text-muted sm:col-span-1 sm:col-start-3 sm:row-start-1 lg:col-start-4">{c.summary}</span>
                    <span className="col-start-3 row-start-1 flex items-center gap-4 justify-self-end sm:col-start-4 lg:col-start-5">
                      <span className="hidden text-sm text-muted tabular-nums sm:inline">
                        {c.count} {c.count === 1 ? "piece" : "pieces"}
                      </span>
                      <span aria-hidden className="arrow grid size-11 place-items-center rounded-full border hairline transition-colors duration-500 group-hover:border-charcoal group-hover:bg-charcoal group-hover:text-ivory group-peek:border-charcoal group-peek:bg-charcoal group-peek:text-ivory">
                        →
                      </span>
                    </span>
                    <TouchPeek />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* 05 — onward */}
      <section data-theme="dark" aria-labelledby="story-next" className="relative isolate overflow-hidden bg-noir text-ivory">
        <Image src={media.showroom.src} alt="" fill sizes="100vw" placeholder="blur" className="-z-10 object-cover opacity-40" style={{ objectPosition: media.showroom.focus.wide }} />
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-noir via-noir/70 to-noir/20" />
        <div className="gutter grid min-h-[70svh] content-center gap-10 py-24">
          <SectionEyebrow index="04" tone="dark">
            Come and see
          </SectionEyebrow>
          <SplitHeading id="story-next" className="display-xl max-w-4xl uppercase">
            The story continues
            <br />
            <em className="font-normal text-gold-soft">in Agbogba.</em>
          </SplitHeading>
          <Reveal className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link href="/the-showroom" className="btn btn-light">
              Visit the showroom <span className="arrow" aria-hidden>→</span>
            </Link>
            <Link href="/appointments" className="btn btn-outline-light">
              Request a visit
            </Link>
          </Reveal>
        </div>
      </section>
    </PageTransition>
  );
}
