import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";

import { HorizontalGallery } from "@/components/animation/HorizontalGallery";
import { SplitHeading } from "@/components/animation/SplitHeading";
import { TouchPeek } from "@/components/animation/TouchPeek";
import { media } from "@/content/media";
import { pad2 } from "@/lib/format";
import type { Category } from "@/lib/commerce/schema";

interface CollectionsProps {
  categories: (Category & { count: number })[];
}

const INTRO = "From the sharp line of a suit to a jacket that turns heads — each collection is edited in the showroom and ready to be tried on.";

function Eyebrow() {
  return (
    <p className="eyebrow text-gold-soft">
      <span className="numeral mr-2 text-base tracking-normal normal-case text-gold">02</span>The collections
    </p>
  );
}

/**
 * Section 04 — the five collections as full-height editorial panels in a row
 * that the page's scroll drives sideways. On desktop the introduction is the
 * row's first panel; on phones and tablets it sits above the row, so the
 * photographs lead. Without motion the row is a native swipe row.
 */
export function Collections({ categories }: CollectionsProps) {
  return (
    <section data-theme="dark" aria-label="The collections" className="relative z-10 bg-charcoal pb-14 text-ivory sm:pb-20 lg:pb-0">
      <div className="gutter pt-20 sm:pt-24 lg:hidden">
        <Eyebrow />
        <div className="mt-7 flex items-end justify-between gap-6">
          <SplitHeading className="display-lg uppercase">
            Five ways
            <br />
            to arrive.
          </SplitHeading>
          <p className="eyebrow flex shrink-0 items-center gap-3 pb-1.5 text-ivory/70" aria-hidden>
            <span className="motion-reduce:hidden">Scroll</span>
            <span className="motion-safe:hidden">Swipe</span>
            <span className="h-px w-8 bg-current" />
          </p>
        </div>
        <p className="mt-6 max-w-md text-[0.95rem] text-muted-dark">{INTRO}</p>
      </div>

      <HorizontalGallery
        label="Collections"
        className="lg:h-svh"
        trackClassName="gutter gap-3 pt-10 pb-8 sm:gap-4 lg:h-full lg:items-stretch lg:gap-[1.6vw] lg:pt-[calc(var(--header-h)+3vh)] lg:pb-[6vh] scroll-px-[var(--gutter)]"
        progress={{ count: categories.length, className: "gutter text-ivory/80" }}
      >
        <li className="hidden w-[30vw] shrink-0 snap-start flex-col justify-between pr-[3vw] lg:flex">
          <div>
            <Eyebrow />
            <SplitHeading className="display-lg mt-8 uppercase">
              Five ways
              <br />
              to arrive.
            </SplitHeading>
          </div>
          <div className="mt-10 max-w-sm">
            <p className="text-[0.95rem] text-muted-dark">{INTRO}</p>
            <p className="eyebrow mt-8 flex items-center gap-3 text-ivory/70" aria-hidden>
              Scroll <span className="h-px w-10 bg-current" />
            </p>
          </div>
        </li>

        {categories.map((category, i) => {
          const asset = media[category.media.key];
          return (
            <li key={category.slug} className="w-[76vw] shrink-0 snap-start sm:w-[44vw] lg:h-full lg:w-[27vw]">
              <Link href={`/collections/${category.slug}` as Route} data-cursor="Explore" className="group flex h-full flex-col bg-charcoal">
                <div className="media-zoom relative aspect-[3/4] overflow-hidden bg-burgundy-deep lg:aspect-auto lg:min-h-0 lg:flex-1">
                  <div data-drift className="absolute inset-y-0 -inset-x-[8%]">
                    <Image
                      src={asset.src}
                      alt=""
                      fill
                      sizes="(min-width: 64rem) 32vw, (min-width: 40rem) 48vw, 82vw"
                      placeholder="blur"
                      className="object-cover"
                      style={{ objectPosition: category.media.focus ?? asset.focus.narrow }}
                    />
                  </div>
                  <span aria-hidden className="absolute inset-0 bg-[linear-gradient(to_top,rgb(13_13_13/0.78),rgb(13_13_13/0.05)_48%,rgb(13_13_13/0.3))]" />
                  <span className="numeral absolute top-4 left-5 text-xl text-ivory/90">{pad2(i + 1)}</span>
                  <span className="eyebrow absolute top-5 right-5 text-ivory/75">
                    {category.count} {category.count === 1 ? "piece" : "pieces"}
                  </span>
                  <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4">
                    <h3 className="display-lg">
                      <span className="text-roll">
                        <span>{category.title}</span>
                        <span aria-hidden className="italic">
                          {category.title}
                        </span>
                      </span>
                    </h3>
                    <span className="eyebrow flex shrink-0 items-center gap-2 pb-2">
                      Explore <span className="arrow" aria-hidden>→</span>
                    </span>
                  </div>
                </div>
                <p className="mt-4 max-w-[38ch] text-sm text-muted-dark">{category.summary}</p>
                <TouchPeek />
              </Link>
            </li>
          );
        })}

        <li className="flex w-[60vw] shrink-0 snap-start items-center sm:w-[36vw] lg:w-[22vw] lg:pl-[2vw]">
          <Link href="/collections" className="group flex flex-col gap-6">
            <span className="display-md">
              View every
              <br />
              piece
            </span>
            <span className="grid size-16 place-items-center rounded-full border border-ivory/30 transition-colors duration-500 group-hover:border-gold group-hover:bg-gold group-hover:text-ink group-peek:border-gold group-peek:bg-gold group-peek:text-ink">
              <span className="arrow text-xl" aria-hidden>
                →
              </span>
            </span>
            <TouchPeek />
          </Link>
        </li>
      </HorizontalGallery>
    </section>
  );
}
