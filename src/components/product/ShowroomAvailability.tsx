"use client";

import { MapPin, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Sheet } from "@/components/ui/Sheet";
import { formattedAddress, site, telHref } from "@/config/site";
import { media } from "@/content/media";
import type { MediaRef } from "@/lib/commerce/schema";
import { DEFAULT_ENQUIRY, whatsappHref } from "@/lib/whatsapp";

/**
 * Where to see the piece, and the showroom's details in a drawer. Deliberately
 * makes no stock or lead-time promise — the showroom confirms availability.
 */
export function ShowroomAvailability({ name, view }: { name: string; view: MediaRef }) {
  const [open, setOpen] = useState(false);
  const asset = media[view.key];

  return (
    <div className="flex gap-3.5">
      <MapPin aria-hidden className="mt-1 size-4 flex-none text-heritage" strokeWidth={1.4} />
      <div className="text-[0.95rem] leading-relaxed">
        <p>See it in person at the showroom in Agbogba, Accra.</p>
        <p className="text-muted">Call or message ahead to confirm it’s on the rail today.</p>
        <button type="button" onClick={() => setOpen(true)} aria-haspopup="dialog" className="link-under mt-2 text-sm">
          View showroom information
        </button>
      </div>

      <Sheet open={open} onClose={() => setOpen(false)} variant="drawer" labelledBy="showroom-info-title">
        <header className="flex flex-none items-center gap-4 border-b hairline py-4 pr-3 pl-6">
          <span className="relative aspect-[4/5] w-12 flex-none overflow-hidden bg-cream">
            <Image src={asset.src} alt="" fill sizes="3rem" className="object-cover" style={{ objectPosition: view.focus ?? asset.focus.narrow }} />
          </span>
          <p className="eyebrow flex-1 leading-relaxed">{name}</p>
          <button type="button" onClick={() => setOpen(false)} data-autofocus="" aria-label="Close showroom information" className="grid size-11 place-items-center opacity-70 transition-opacity hover:opacity-100">
            <X aria-hidden className="size-5" strokeWidth={1.2} />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto px-6 py-8">
          <h2 id="showroom-info-title" className="display-sm">
            {site.name}
          </h2>
          <dl className="mt-6 grid gap-5 text-[0.95rem]">
            <div>
              <dt className="eyebrow text-muted">Showroom</dt>
              <dd className="mt-1.5">{formattedAddress}</dd>
            </div>
            <div>
              <dt className="eyebrow text-muted">Telephone</dt>
              <dd className="mt-1.5">
                <a href={telHref} className="link-under">
                  {site.phone.display}
                </a>
              </dd>
            </div>
            <div>
              <dt className="eyebrow text-muted">Opening hours</dt>
              <dd className="mt-1.5 text-charcoal/80">Please call or message ahead to confirm today’s hours.</dd>
            </div>
          </dl>
          <div className="mt-9 grid gap-3">
            <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-block">
              Get directions <span className="arrow" aria-hidden>↗</span>
              <span className="sr-only">(opens Google Maps)</span>
            </a>
            <a href={whatsappHref(DEFAULT_ENQUIRY)} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-block">
              Message on WhatsApp
              <span className="sr-only">(opens WhatsApp)</span>
            </a>
            <Link href="/appointments" className="link-under mt-2 justify-self-start text-sm">
              Request a visit
            </Link>
          </div>
        </div>
      </Sheet>
    </div>
  );
}
