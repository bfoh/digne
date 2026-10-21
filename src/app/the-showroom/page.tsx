import Image from "next/image";
import Link from "next/link";

import { ImageReveal } from "@/components/animation/ImageReveal";
import { PageTransition } from "@/components/animation/PageTransition";
import { Reveal } from "@/components/animation/Reveal";
import { SplitHeading } from "@/components/animation/SplitHeading";
import { MapEmbed } from "@/components/page/MapEmbed";
import { PageHero } from "@/components/page/PageHero";
import { SectionEyebrow } from "@/components/page/SectionEyebrow";
import { formattedAddress, site, telHref } from "@/config/site";
import { media } from "@/content/media";
import { showroomScenes, visitSteps } from "@/content/showroom";
import { pad2 } from "@/lib/format";
import { breadcrumbJsonLd, jsonLd, pageMetadata, storeJsonLd } from "@/lib/seo";
import { cn } from "@/lib/cn";
import { whatsappHref } from "@/lib/whatsapp";

export const metadata = pageMetadata({
  title: "The Showroom",
  description: `Visit the ${site.name} showroom in Agbogba, Accra — rails of suits, blazers, shirts, trousers and occasionwear, and a lounge to take your time.`,
  path: "/the-showroom",
});

/** Layout of the four photographs: wide, tall, tall, wide — offset like a contact sheet. */
const FRAMES = [
  { figure: "col-span-12 lg:col-span-8", frame: "aspect-[16/11]", sizes: "(min-width: 64rem) 66vw, 100vw", focus: "wide" },
  { figure: "col-span-10 col-start-3 sm:col-span-6 sm:col-start-7 lg:col-span-4 lg:col-start-9 lg:mt-40", frame: "aspect-[4/5]", sizes: "(min-width: 64rem) 33vw, (min-width: 40rem) 50vw, 84vw", focus: "narrow" },
  { figure: "col-span-10 sm:col-span-6 lg:col-span-4 lg:col-start-2 lg:-mt-24", frame: "aspect-[4/5]", sizes: "(min-width: 64rem) 33vw, (min-width: 40rem) 50vw, 84vw", focus: "narrow" },
  { figure: "col-span-12 lg:col-span-6 lg:col-start-7 lg:mt-24", frame: "aspect-[4/3]", sizes: "(min-width: 64rem) 50vw, 100vw", focus: "wide" },
] as const;

export default function ShowroomPage() {
  return (
    <PageTransition>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(storeJsonLd())} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(breadcrumbJsonLd([{ name: "The Showroom", path: "/the-showroom" }]))} />
      <PageHero
        eyebrow={`${site.address.locality}, ${site.address.city}`}
        title="The showroom"
        summary="Warm light, rails arranged by colour and a lounge to sit and consider — the place to see, touch and try on every piece."
        image={{ key: "showroom" }}
      />

      {/* 01 — inside */}
      <section data-theme="light" aria-labelledby="inside-title" className="bg-ivory">
        <div className="gutter pt-24 pb-24 lg:pt-36 lg:pb-40">
          <div className="grid grid-cols-12 gap-x-6 gap-y-8">
            <div className="col-span-12 lg:col-span-4">
              <SectionEyebrow index="01">Inside</SectionEyebrow>
            </div>
            <div className="col-span-12 lg:col-span-8">
              <SplitHeading id="inside-title" className="display-lg uppercase">
                A room made for
                <br />
                <em className="font-normal text-heritage">taking your time.</em>
              </SplitHeading>
              <Reveal>
                <p className="lede mt-8 max-w-xl text-charcoal/80">
                  Everything is out on the floor to be looked at properly — suits on the wall by colour, shirts folded within reach, and somewhere comfortable
                  to sit while you decide.
                </p>
              </Reveal>
            </div>
          </div>

          <div className="mt-16 grid grid-cols-12 gap-x-6 gap-y-14 lg:mt-24">
            {showroomScenes.map((scene, i) => {
              const asset = media[scene.key];
              const layout = FRAMES[i % FRAMES.length];
              return (
                <figure key={scene.key} className={layout.figure}>
                  <ImageReveal className={cn("relative bg-cream", layout.frame)} direction={i % 2 ? "down" : "up"}>
                    <div className="absolute inset-0">
                      <Image src={asset.src} alt={asset.alt} fill sizes={layout.sizes} placeholder="blur" className="object-cover" style={{ objectPosition: asset.focus[layout.focus] }} />
                    </div>
                  </ImageReveal>
                  <figcaption className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
                    <span className="numeral row-span-2 text-xl text-heritage">{pad2(i + 1)}</span>
                    <span className="label">{scene.title}</span>
                    <span className="text-[0.95rem] text-muted">{scene.caption}</span>
                  </figcaption>
                </figure>
              );
            })}
          </div>
        </div>
      </section>

      {/* 02 — a visit, step by step */}
      <section data-theme="light" aria-labelledby="expect-title" className="border-t hairline bg-cream/50">
        <div className="gutter grid grid-cols-12 gap-x-6 gap-y-14 py-24 lg:py-32">
          <div className="col-span-12 lg:col-span-4">
            <SectionEyebrow index="02">What to expect</SectionEyebrow>
            <SplitHeading id="expect-title" className="display-md mt-7 uppercase">
              How a visit
              <br />
              usually goes.
            </SplitHeading>
            <Reveal>
              <Link href="/appointments" className="link-line mt-8 text-charcoal">
                Request a visit <span className="arrow" aria-hidden>→</span>
              </Link>
            </Reveal>
          </div>
          <Reveal as="ol" stagger={0.1} className="col-span-12 grid border-t hairline lg:col-span-7 lg:col-start-6">
            {visitSteps.map((step, i) => (
              <li key={step.title} data-reveal-item className="grid grid-cols-[3rem_1fr] gap-x-4 border-b hairline py-8 lg:grid-cols-[4.5rem_1fr]">
                <span className="numeral text-3xl text-heritage">{pad2(i + 1)}</span>
                <div>
                  <h3 className="display-sm">{step.title}</h3>
                  <p className="mt-2.5 max-w-lg text-[0.95rem] leading-relaxed text-muted">{step.body}</p>
                </div>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      {/* 03 — plan your visit */}
      <section id="plan" data-theme="dark" aria-labelledby="plan-title" className="grid scroll-mt-[var(--header-h)] bg-burgundy text-ivory lg:grid-cols-2">
        <div className="gutter flex flex-col justify-between gap-14 py-24 lg:py-32 lg:pr-[6vw]">
          <div>
            <SectionEyebrow index="03" tone="dark">
              Plan your visit
            </SectionEyebrow>
            <SplitHeading id="plan-title" className="display-xl mt-8 uppercase">
              Finding
              <br />
              <em className="font-normal text-gold-soft">Digne.</em>
            </SplitHeading>
          </div>
          <Reveal stagger={0.08}>
            <dl className="grid gap-x-8 gap-y-7 border-t border-ivory/15 pt-8 sm:grid-cols-2">
              <div data-reveal-item>
                <dt className="eyebrow text-gold-soft">Address</dt>
                <dd className="mt-2">
                  <address className="not-italic">
                    {site.name}
                    <br />
                    {formattedAddress}
                  </address>
                </dd>
              </div>
              <div data-reveal-item>
                <dt className="eyebrow text-gold-soft">Telephone</dt>
                <dd className="mt-2">
                  <a href={telHref} className="display-sm hover:text-gold-soft">
                    {site.phone.display}
                  </a>
                </dd>
              </div>
              <div data-reveal-item>
                <dt className="eyebrow text-gold-soft">Opening hours</dt>
                <dd className="mt-2 text-ivory/80">
                  {site.hours
                    ? site.hours.map((h) => (
                        <span key={h.days} className="block">
                          {h.days} · {h.opens}–{h.closes}
                        </span>
                      ))
                    : "Please call or message ahead to confirm today’s hours."}
                </dd>
              </div>
              <div data-reveal-item>
                <dt className="eyebrow text-gold-soft">Before you come</dt>
                <dd className="mt-2 text-ivory/80">If you’re after a particular piece, message first — the showroom can tell you whether it’s on the rail.</dd>
              </div>
            </dl>
            <div data-reveal-item className="mt-12 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-light">
                Get directions <span className="arrow" aria-hidden>↗</span>
                <span className="sr-only">(opens Google Maps)</span>
              </a>
              <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className="btn btn-outline-light">
                Message on WhatsApp <span className="sr-only">(opens WhatsApp)</span>
              </a>
            </div>
          </Reveal>
        </div>
        <MapEmbed className="min-h-[70svh] lg:min-h-full" />
      </section>
    </PageTransition>
  );
}
