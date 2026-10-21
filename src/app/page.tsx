import { PageTransition } from "@/components/animation/PageTransition";
import { Closing } from "@/components/home/Closing";
import { Collections } from "@/components/home/Collections";
import { Experience } from "@/components/home/Experience";
import { FeaturedPieces } from "@/components/home/FeaturedPieces";
import { Hero } from "@/components/home/Hero";
import { SignatureLooks } from "@/components/home/SignatureLooks";
import { Statement } from "@/components/home/Statement";
import { Visit } from "@/components/home/Visit";
import { getCategories, getFeaturedPieces, getPiecesInCategory, summarise } from "@/lib/commerce/catalogue";
import { jsonLd, pageMetadata, storeJsonLd } from "@/lib/seo";

export const metadata = pageMetadata({
  description:
    "Suits, blazers, shirts, trousers and occasionwear at Digne Suits & More in Agbogba, Accra. Explore the collections and plan a visit to the showroom.",
  path: "/",
});

export default function HomePage() {
  const categories = getCategories().map((c) => ({ ...c, count: getPiecesInCategory(c.slug).length }));
  const featured = getFeaturedPieces().map(summarise);

  return (
    <PageTransition>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(storeJsonLd())} />
      {/* The hero is sticky inside this wrapper; the statement slides over it. */}
      <div className="relative">
        <Hero />
        <Statement />
      </div>
      <Collections categories={categories} />
      <FeaturedPieces pieces={featured} />
      <Experience />
      <SignatureLooks />
      <Visit />
      <Closing />
    </PageTransition>
  );
}
