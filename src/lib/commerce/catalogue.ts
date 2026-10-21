import "server-only";

import { catalogueData } from "@/content/catalogue";
import { media, mediaKind } from "@/content/media";

import { catalogueSchema, type Category, type CategorySlug, type MediaRef, type Piece, type SizeOption } from "./schema";

const catalogue = catalogueSchema.parse(catalogueData);

for (const ref of [...catalogue.categories.map((c) => c.media), ...catalogue.pieces.flatMap((p) => p.media)]) {
  if (!(ref.key in media)) throw new Error(`Catalogue references unknown media key "${ref.key}"`);
}

const categoryBySlug = new Map(catalogue.categories.map((c) => [c.slug, c]));
const pieceBySlug = new Map(catalogue.pieces.map((p) => [p.slug, p]));

for (const piece of catalogue.pieces) {
  for (const slug of piece.pairsWith) {
    if (!pieceBySlug.has(slug) || slug === piece.slug) throw new Error(`"${piece.slug}" pairs with unknown piece "${slug}"`);
  }
}

/** The shape client components receive — no server-only data. */
export interface PieceSummary {
  slug: string;
  name: string;
  category: CategorySlug;
  categoryTitle: string;
  summary: string;
  priceMinor: number | null;
  colours: Piece["colours"];
  /** Verified sizes with availability, or the category's preference scale. */
  sizes: SizeOption[];
  /** True when `sizes` is stock data; false when it is a preference scale. */
  sizesVerified: boolean;
  availability: Piece["availability"];
  source: Piece["source"];
  addedAt: string | null;
  /** Every view of the piece, primary first. */
  media: MediaRef[];
  /** The view revealed on hover: an on-model photograph if one exists, else the second view. */
  hover: MediaRef | null;
}

export function getCategories(): Category[] {
  return catalogue.categories;
}

export function getCategory(slug: string): Category | undefined {
  return categoryBySlug.get(slug as CategorySlug);
}

export function getPieces(): Piece[] {
  return catalogue.pieces;
}

export function getPiece(slug: string): Piece | undefined {
  return pieceBySlug.get(slug);
}

export function getPiecesInCategory(slug: CategorySlug): Piece[] {
  return catalogue.pieces.filter((p) => p.category === slug);
}

export function getFeaturedPieces(): Piece[] {
  return catalogue.pieces.filter((p) => p.featured);
}

export function getRelatedPieces(piece: Piece, count = 3): Piece[] {
  const same = catalogue.pieces.filter((p) => p.slug !== piece.slug && p.category === piece.category);
  const rest = catalogue.pieces.filter((p) => p.slug !== piece.slug && p.category !== piece.category);
  return [...same, ...rest].slice(0, count);
}

export function getPairings(piece: Piece): Piece[] {
  return piece.pairsWith.map((slug) => pieceBySlug.get(slug)).filter((p): p is Piece => Boolean(p));
}

function hoverView(piece: Piece): MediaRef | null {
  return piece.media.find((m) => mediaKind(m.key) === "on-model") ?? piece.media[1] ?? null;
}

export function summarise(piece: Piece): PieceSummary {
  const verified = piece.sizes.length > 0;
  const scale = categoryBySlug.get(piece.category)?.enquirySizes ?? [];
  return {
    slug: piece.slug,
    name: piece.name,
    category: piece.category,
    categoryTitle: categoryBySlug.get(piece.category)?.title ?? piece.category,
    summary: piece.summary,
    priceMinor: piece.priceMinor,
    colours: piece.colours,
    sizes: verified ? piece.sizes : scale.map((label) => ({ label, available: true })),
    sizesVerified: verified,
    availability: piece.availability,
    source: piece.source,
    addedAt: piece.addedAt,
    media: piece.media,
    hover: hoverView(piece),
  };
}

/** Which filters the current data can actually support. Unsupported filters are hidden, not faked. */
export function getFacets() {
  const pieces = catalogue.pieces;
  const prices = pieces.map((p) => p.priceMinor).filter((v): v is number => v !== null);
  const colours = new Map<string, string>();
  for (const p of pieces) for (const c of p.colours) colours.set(c.name, c.hex);
  return {
    categories: catalogue.categories.map((c) => ({ slug: c.slug, title: c.title })),
    colours: [...colours].map(([name, hex]) => ({ name, hex })),
    sizes: [...new Set(pieces.flatMap((p) => p.sizes.map((size) => size.label)))],
    price: prices.length ? { min: Math.min(...prices), max: Math.max(...prices) } : null,
    hasAvailability: pieces.some((p) => p.availability !== "enquire"),
    hasDates: pieces.some((p) => p.addedAt !== null),
  };
}

export type Facets = ReturnType<typeof getFacets>;
