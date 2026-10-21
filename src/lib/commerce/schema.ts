import { z } from "zod";

import type { MediaKey } from "@/content/media";

export const CATEGORY_SLUGS = ["suits", "blazers", "shirts", "trousers", "occasionwear"] as const;
export const categorySlugSchema = z.enum(CATEGORY_SLUGS);

const mediaRef = z.object({
  key: z.custom<MediaKey>((v) => typeof v === "string"),
  /** Optional crop override (CSS object-position) when one photo shows several pieces. */
  focus: z.string().optional(),
});

export const categorySchema = z.object({
  slug: categorySlugSchema,
  title: z.string().min(1),
  summary: z.string().min(1),
  media: mediaRef,
  /**
   * Sizes a customer can name as a preference when enquiring. Not stock: the
   * showroom confirms what is available. Shown only when a piece has no
   * verified `sizes`.
   */
  enquirySizes: z.array(z.string().min(1)).min(1),
});

export const availabilitySchema = z.enum([
  /** No live stock data — the showroom confirms. */
  "enquire",
  "in_stock",
  "low_stock",
  "sold_out",
]);

export const pieceSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  category: categorySlugSchema,
  summary: z.string().min(1),
  /** Visible details only. Never infer fabric or construction from a photo. */
  details: z.array(z.string()).min(1),
  colours: z.array(z.object({ name: z.string(), hex: z.string().regex(/^#[0-9a-f]{6}$/i) })).min(1),
  media: z.array(mediaRef).min(1),
  /** Price in pesewas (GH₵ 1 = 100). `null` = price on request. */
  priceMinor: z.number().int().positive().nullable(),
  /** Verified sizes with live availability. Empty = sizes confirmed by the showroom. */
  sizes: z.array(z.object({ label: z.string().min(1), available: z.boolean() })),
  availability: availabilitySchema,
  /** Verified fabric composition, if supplied by Digne. */
  fabric: z.string().nullable(),
  /** Verified care instructions, if supplied by Digne. */
  care: z.string().nullable(),
  /**
   * "showroom-photo": an editorial entry built from store photography — not a
   * verified SKU. "product": a verified product with supplied data.
   */
  source: z.enum(["showroom-photo", "product"]),
  addedAt: z.iso.date().nullable(),
  featured: z.boolean(),
  /** Editorial styling suggestions ("Pairs well with") — slugs of other pieces. */
  pairsWith: z.array(z.string()),
});

export const catalogueSchema = z.object({
  categories: z.array(categorySchema).length(CATEGORY_SLUGS.length),
  pieces: z.array(pieceSchema),
});

export type CategorySlug = z.infer<typeof categorySlugSchema>;
export type Category = z.infer<typeof categorySchema>;
export type Piece = z.infer<typeof pieceSchema>;
export type Availability = z.infer<typeof availabilitySchema>;
export type MediaRef = z.infer<typeof mediaRef>;
export type SizeOption = Piece["sizes"][number];
export type Catalogue = z.infer<typeof catalogueSchema>;
