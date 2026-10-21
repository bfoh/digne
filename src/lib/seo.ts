import type { Metadata } from "next";

import { formattedAddress, site } from "@/config/site";

/** ClothingStore structured data — verified facts only (no hours, ratings or reviews until supplied). */
export function storeJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ClothingStore",
    "@id": `${site.url}/#store`,
    name: site.name,
    description: site.description,
    url: site.url,
    telephone: site.phone.e164,
    image: `${site.url}/opengraph-image.jpg`,
    logo: `${site.url}/icon.png`,
    address: {
      "@type": "PostalAddress",
      addressLocality: `${site.address.locality}, ${site.address.city}`,
      addressRegion: site.address.region,
      addressCountry: site.address.countryCode,
    },
    geo: { "@type": "GeoCoordinates", latitude: site.geo.latitude, longitude: site.geo.longitude },
    hasMap: site.mapsUrl,
    currenciesAccepted: "GHS",
    areaServed: formattedAddress,
    ...(site.social.length ? { sameAs: site.social.map((s) => s.href) } : {}),
  };
}

export function breadcrumbJsonLd(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, i) => ({ "@type": "ListItem", position: i + 1, name: item.name, item: `${site.url}${item.path}` })),
  };
}

/** Per-page metadata with a canonical URL. */
export function pageMetadata({ title, description, path }: { title?: string; description: string; path: string }): Metadata {
  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: path },
    openGraph: { url: path, description, ...(title ? { title } : {}) },
  };
}

/** Serialises JSON-LD safely for an inline <script> (escapes "<" to avoid breaking out of the tag). */
export function jsonLd(data: unknown) {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}
