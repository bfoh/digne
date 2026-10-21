"use client";

import { MapPin } from "lucide-react";
import { useState } from "react";

import { site } from "@/config/site";
import { cn } from "@/lib/cn";

const { latitude, longitude } = site.geo;
const embedSrc = `https://maps.google.com/maps?q=${latitude},${longitude}&z=16&output=embed`;

/**
 * Google Maps loads only when the visitor asks for it, so no request reaches
 * Google (and no Google cookies are set) just by opening the page.
 */
export function MapEmbed({ className }: { className?: string }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={cn("relative overflow-hidden bg-burgundy-deep", className)}>
      {loaded ? (
        <iframe
          src={embedSrc}
          title={`Map showing ${site.name} in ${site.address.locality}, ${site.address.city}`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 size-full border-0 grayscale-[0.35]"
          data-lenis-prevent=""
        />
      ) : (
        <div className="absolute inset-0 grid place-items-center p-8 text-center">
          {/* A drawn locator in place of map tiles: rings around the pin. */}
          <div aria-hidden className="absolute inset-0 grid place-items-center">
            {[22, 40, 58, 76].map((size) => (
              <span key={size} className="absolute rounded-full border border-gold/15" style={{ width: `${size}%`, aspectRatio: "1" }} />
            ))}
            <span className="absolute inset-x-0 top-1/2 h-px bg-gold/10" />
            <span className="absolute inset-y-0 left-1/2 w-px bg-gold/10" />
          </div>
          <div className="relative grid justify-items-center gap-5">
            <span className="grid size-14 place-items-center rounded-full bg-gold text-burgundy-deep">
              <MapPin aria-hidden className="size-6" strokeWidth={1.5} />
            </span>
            <p className="numeral text-lg text-gold-soft tabular-nums">
              {latitude.toFixed(4)}° N, {Math.abs(longitude).toFixed(4)}° W
            </p>
            <button type="button" onClick={() => setLoaded(true)} className="btn btn-outline-light">
              Show the map
            </button>
            <p className="max-w-xs text-xs leading-relaxed text-ivory/60">Loads Google Maps, which may set its own cookies.</p>
          </div>
        </div>
      )}
    </div>
  );
}
