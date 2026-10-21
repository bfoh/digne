import { PageTransition } from "@/components/animation/PageTransition";
import { CollectionView } from "@/components/collection/CollectionView";
import { getCategories, getFacets, getPieces, getPiecesInCategory, summarise } from "@/lib/commerce/catalogue";
import { breadcrumbJsonLd, jsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Collections",
  description: "Suits, blazers, shirts, trousers and occasionwear from the Digne Suits & More showroom in Agbogba, Accra.",
  path: "/collections",
});

export default function CollectionsPage() {
  const categories = getCategories().map((c) => ({ slug: c.slug, title: c.title, count: getPiecesInCategory(c.slug).length }));
  return (
    <PageTransition>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(breadcrumbJsonLd([{ name: "Collections", path: "/collections" }]))} />
      <CollectionView
        eyebrow="Digne Suits & More"
        title="The collections"
        summary="Five ways to arrive — every piece photographed on the showroom floor, ready to be seen and tried on in Agbogba."
        image={{ key: "suitWall" }}
        pieces={getPieces().map(summarise)}
        categories={categories}
        current="all"
        hasPrices={getFacets().price !== null}
      />
    </PageTransition>
  );
}
