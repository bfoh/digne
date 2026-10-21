import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";

import { SplitHeading } from "@/components/animation/SplitHeading";
import { media, type MediaKey } from "@/content/media";
import { cn } from "@/lib/cn";

interface PageHeroProps {
  eyebrow: ReactNode;
  title: ReactNode;
  summary?: ReactNode;
  image: { key: MediaKey; focus?: string };
  /** Shorter band for utility pages. */
  size?: "md" | "lg";
  children?: ReactNode;
}

/**
 * The dark editorial title band that opens a page: photograph, eyebrow, split
 * heading, lede. Taller on phones, where the photograph has to carry the page
 * on its own, with the narrow crop.
 */
export function PageHero({ eyebrow, title, summary, image, size = "lg", children }: PageHeroProps) {
  const asset = media[image.key];
  const crop = { "--crop": image.focus ?? asset.focus.narrow, "--crop-wide": image.focus ?? asset.focus.wide } as CSSProperties;
  return (
    <header data-theme="dark" className="relative isolate overflow-hidden bg-noir text-ivory">
      <Image
        src={asset.src}
        alt=""
        fill
        loading="eager"
        fetchPriority="high"
        sizes="100vw"
        placeholder="blur"
        className="page-hero__media -z-10 object-cover opacity-55 [object-position:var(--crop)] lg:[object-position:var(--crop-wide)]"
        style={crop}
      />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-noir via-noir/55 to-noir/30" />
      <div
        className={cn(
          "gutter flex flex-col items-center justify-end pt-[calc(var(--header-h)+3rem)] pb-14 text-center lg:pb-20",
          size === "lg" ? "min-h-[68svh] sm:min-h-[54svh] lg:min-h-[62svh]" : "min-h-[52svh] sm:min-h-[44svh] lg:min-h-[48svh]",
        )}
      >
        <p className="eyebrow text-gold-soft">{eyebrow}</p>
        <SplitHeading as="h1" play="intro" className="display-xxl mt-6 uppercase">
          {title}
        </SplitHeading>
        {summary && <p className="lede mt-7 max-w-xl text-ivory/80">{summary}</p>}
        {children}
      </div>
    </header>
  );
}
