import type { MetadataRoute } from "next";

import { site } from "@/config/site";
import { getCategories, getPieces } from "@/lib/commerce/catalogue";

/** Public, indexable pages. The bag and saved pieces are personal and left out. */
const STATIC_PATHS = [
  "/",
  "/collections",
  "/our-story",
  "/the-showroom",
  "/appointments",
  "/contact",
  "/faq",
  "/size-guide",
  "/shipping-returns",
  "/privacy-policy",
  "/terms-and-conditions",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => `${site.url}${path === "/" ? "" : path}`;
  return [
    ...STATIC_PATHS.map((path) => ({ url: url(path) })),
    ...getCategories().map((c) => ({ url: url(`/collections/${c.slug}`) })),
    ...getPieces().map((p) => ({ url: url(`/products/${p.slug}`), ...(p.addedAt ? { lastModified: p.addedAt } : {}) })),
  ];
}
