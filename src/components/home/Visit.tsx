import Image from "next/image";
import Link from "next/link";

import { Parallax } from "@/components/animation/Parallax";
import { Reveal } from "@/components/animation/Reveal";
import { SplitHeading } from "@/components/animation/SplitHeading";
import { DigneBadge } from "@/components/brand/DigneBadge";
import { formattedAddress, site, telHref } from "@/config/site";
import { media } from "@/content/media";

const coordinates = `${site.geo.latitude.toFixed(4)}° N, ${Math.abs(site.geo.longitude).toFixed(4)}° W`;

/** Section 08 — an invitation to the showroom. */
export function Visit() {
  return (
    <section data-theme="dark" aria-labelledby="visit-title" className="relative z-10 grid bg-burgundy text-ivory lg:grid-cols-2">
      <div className="gutter flex flex-col justify-between gap-16 py-24 lg:min-h-svh lg:py-32 lg:pr-[6vw]">
        <div>
          <p className="eyebrow text-gold-soft">
            <span className="numeral mr-2 text-base tracking-normal normal-case text-gold">06</span>Visit the showroom
          </p>
          <SplitHeading id="visit-title" className="display-xl mt-8 uppercase">
            Your next great look
            <br />
            <em className="font-normal text-gold-soft">starts in Accra.</em>
          </SplitHeading>
        </div>

        <Reveal stagger={0.08}>
          <dl className="grid gap-x-8 gap-y-7 border-t border-ivory/15 pt-8 sm:grid-cols-2">
            <div data-reveal-item>
              <dt className="eyebrow text-gold-soft">Showroom</dt>
              <dd className="mt-2">
                {site.name}
                <br />
                {formattedAddress}
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
              <dd className="mt-2 text-ivory/80">Please call or message ahead to confirm today’s hours.</dd>
            </div>
            <div data-reveal-item>
              <dt className="eyebrow text-gold-soft">Find us</dt>
              <dd className="mt-2 text-ivory/80">
                <span className="numeral">{coordinates}</span>
              </dd>
            </div>
          </dl>
          <div data-reveal-item className="mt-12 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-light">
              Get directions <span className="arrow" aria-hidden>↗</span>
              <span className="sr-only">(opens Google Maps)</span>
            </a>
            <Link href="/contact" className="btn btn-outline-light">
              Contact the showroom
            </Link>
            <Link href="/appointments" className="btn btn-outline-light">
              Request a visit
            </Link>
          </div>
        </Reveal>
      </div>

      <div className="relative min-h-[72svh] lg:min-h-full">
        <div className="absolute inset-0">
          <Parallax className="h-full" amount={7}>
            <Image
              src={media.showroom.src}
              alt={media.showroom.alt}
              fill
              sizes="(min-width: 64rem) 50vw, 100vw"
              placeholder="blur"
              className="object-cover"
              style={{ objectPosition: media.showroom.focus.wide }}
            />
          </Parallax>
        </div>
        <div className="absolute bottom-6 left-6 lg:bottom-10 lg:left-10">
          <DigneBadge size={112} decorative className="size-20 lg:size-28" />
        </div>
      </div>
    </section>
  );
}
