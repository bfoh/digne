import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

import { DigneBadge } from "@/components/brand/DigneBadge";
import { site, telHref } from "@/config/site";
import { media } from "@/content/media";

export const metadata: Metadata = {
  title: "Page not found",
  description: `This page couldn’t be found on the ${site.name} website.`,
};

/** The branded 404, for unmatched URLs and notFound() alike. */
export default function NotFound() {
  return (
    <section data-theme="dark" aria-labelledby="not-found-title" className="relative isolate grid min-h-svh overflow-hidden bg-noir text-ivory">
      <Image src={media.suitWall.src} alt="" fill sizes="100vw" placeholder="blur" className="-z-10 object-cover opacity-30" style={{ objectPosition: media.suitWall.focus.wide }} />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-noir via-noir/80 to-noir/40" />

      <div className="gutter grid content-center justify-items-center gap-8 pt-[calc(var(--header-h)+2rem)] pb-20 text-center">
        <DigneBadge size={72} decorative className="size-16" />
        <p aria-hidden className="numeral text-[clamp(6rem,22vw,16rem)] leading-[0.8] text-gold">
          404
        </p>
        <h1 id="not-found-title" className="display-lg max-w-3xl uppercase">
          This page has
          <br />
          <em className="font-normal text-gold-soft">stepped out.</em>
        </h1>
        <p className="lede max-w-md text-ivory/75">The link may be mistyped, or the page may have moved. Everything else is right where you left it.</p>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <Link href="/" className="btn btn-light">
            Back to the home page
          </Link>
          <Link href="/collections" className="btn btn-outline-light">
            Explore the collections
          </Link>
        </div>
        <p className="text-sm text-ivory/60">
          Looking for something specific?{" "}
          <a href={telHref} className="link-under text-ivory">
            Call {site.phone.display}
          </a>
        </p>
      </div>
    </section>
  );
}
