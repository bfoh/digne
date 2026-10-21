import type { Metadata, Route } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageTransition } from "@/components/animation/PageTransition";
import { InfoAccordion } from "@/components/product/InfoAccordion";
import { PairsWith } from "@/components/product/PairsWith";
import { PieceOptions } from "@/components/product/PieceOptions";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ShowroomAvailability } from "@/components/product/ShowroomAvailability";
import { StickyColumn } from "@/components/product/StickyColumn";
import { site } from "@/config/site";
import { media } from "@/content/media";
import { productInfo } from "@/content/product-info";
import { getCategory, getPairings, getPiece, getPieces, getRelatedPieces, summarise } from "@/lib/commerce/catalogue";
import type { Piece } from "@/lib/commerce/schema";
import { formatPrice } from "@/lib/format";
import { breadcrumbJsonLd, jsonLd, pageMetadata } from "@/lib/seo";

// Every catalogue piece is prerendered; any other slug falls through to notFound().
// Navigations wait for the (static) page rather than flash a skeleton, so the
// card photograph can morph straight into the gallery.
export const instant = false;

export function generateStaticParams() {
  return getPieces().map((piece) => ({ slug: piece.slug }));
}

export async function generateMetadata({ params }: PageProps<"/products/[slug]">): Promise<Metadata> {
  const piece = getPiece((await params).slug);
  if (!piece) return {};
  const asset = media[piece.media[0].key];
  const base = pageMetadata({ title: piece.name, description: piece.summary, path: `/products/${piece.slug}` });
  return {
    ...base,
    openGraph: { ...base.openGraph, images: [{ url: asset.src.src, width: asset.src.width, height: asset.src.height, alt: asset.alt }] },
  };
}

/**
 * Product structured data only for verified products: a showroom-photo entry
 * has no price or stock, and presenting it as a Product would overstate it.
 */
function productJsonLd(piece: Piece, categoryTitle: string) {
  if (piece.source !== "product" || piece.priceMinor === null) return null;
  const availability = { enquire: "InStoreOnly", in_stock: "InStock", low_stock: "LimitedAvailability", sold_out: "OutOfStock" }[piece.availability];
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: piece.name,
    description: piece.summary,
    category: categoryTitle,
    color: piece.colours.map((c) => c.name).join(", "),
    image: piece.media.map((m) => `${site.url}${media[m.key].src.src}`),
    brand: { "@type": "Brand", name: site.name },
    offers: {
      "@type": "Offer",
      priceCurrency: "GHS",
      price: (piece.priceMinor / 100).toFixed(2),
      availability: `https://schema.org/${availability}`,
      url: `${site.url}/products/${piece.slug}`,
      seller: { "@id": `${site.url}/#store` },
    },
  };
}

export default async function ProductPage({ params }: PageProps<"/products/[slug]">) {
  const piece = getPiece((await params).slug);
  if (!piece) notFound();

  const category = getCategory(piece.category);
  const categoryTitle = category?.title ?? piece.category;
  const summary = summarise(piece);
  const pairings = getPairings(piece).map(summarise);
  const related = getRelatedPieces(piece, 4).map(summarise);
  const categoryHref = `/collections/${piece.category}` as Route;
  const product = productJsonLd(piece, categoryTitle);
  const trail = [
    { name: "Collections", path: "/collections" },
    { name: categoryTitle, path: `/collections/${piece.category}` },
    { name: piece.name, path: `/products/${piece.slug}` },
  ];

  return (
    <PageTransition>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(breadcrumbJsonLd(trail))} />
      {product && <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(product)} />}

      <article data-theme="light" aria-labelledby="piece-title" className="bg-ivory pt-[calc(var(--header-h)+1.25rem)] pb-24 lg:pt-[calc(var(--header-h)+2rem)]">
        <div className="gutter">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-muted">
              <li>
                <Link href="/collections" className="hover:text-charcoal">
                  Collections
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link href={categoryHref} className="hover:text-charcoal">
                  {categoryTitle}
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li aria-current="page" className="text-charcoal">
                {piece.name}
              </li>
            </ol>
          </nav>

          <div className="mt-5 grid gap-9 lg:mt-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-start lg:gap-16 xl:gap-24">
            <ProductGallery slug={piece.slug} name={piece.name} views={piece.media} />

            <StickyColumn className="lg:max-w-[33rem]">
              <p className="eyebrow text-muted">
                <Link href={categoryHref} className="hover:text-charcoal">
                  Digne · {categoryTitle}
                </Link>
              </p>
              <h1 id="piece-title" className="display-md mt-3">
                {piece.name}
              </h1>
              <p className="mt-3 text-[0.95rem] tracking-[0.08em] text-charcoal/75">{formatPrice(piece.priceMinor)}</p>
              <hr className="my-7 hairline" />

              <p className="text-[1.02rem] leading-relaxed">{piece.summary}</p>
              <ul className="mt-5 grid list-disc gap-1.5 pl-5 text-[0.95rem] text-charcoal/85 marker:text-heritage">
                {piece.details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
              {piece.source === "showroom-photo" && (
                <p className="mt-4 text-xs leading-relaxed text-muted">Described from showroom photography — the showroom confirms exact details, fabric and fit.</p>
              )}

              <div className="mt-9">
                <PieceOptions piece={summary} variant="page" />
              </div>

              <div className="mt-9">
                <ShowroomAvailability name={piece.name} view={piece.media[0]} />
              </div>

              {pairings.length > 0 && (
                <div className="mt-12">
                  <PairsWith pieces={pairings} />
                </div>
              )}

              <div className="mt-12">
                <InfoAccordion sections={productInfo(piece)} />
              </div>
            </StickyColumn>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section data-theme="light" aria-labelledby="related-title" className="border-t hairline bg-ivory py-20 lg:py-28">
          <h2 id="related-title" className="eyebrow text-center">
            You may also like
          </h2>
          <ul className="gutter mt-12 grid grid-cols-2 gap-x-4 gap-y-12 lg:grid-cols-4 lg:gap-x-6">
            {related.map((p) => (
              <li key={p.slug}>
                <ProductCard piece={p} variant="grid" sizes="(min-width: 64rem) 23vw, 48vw" />
              </li>
            ))}
          </ul>
        </section>
      )}
    </PageTransition>
  );
}
