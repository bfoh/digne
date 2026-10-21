import { PageTransition } from "@/components/animation/PageTransition";
import { SavedView } from "@/components/product/SavedView";
import { getPieces, summarise } from "@/lib/commerce/catalogue";
import { pageMetadata } from "@/lib/seo";

export const metadata = {
  ...pageMetadata({ title: "Saved pieces", description: "Pieces you’ve saved at Digne Suits & More.", path: "/wishlist" }),
  robots: { index: false },
};

export default function WishlistPage() {
  return (
    <PageTransition>
      <section data-theme="light" aria-labelledby="saved-title" className="gutter min-h-[80svh] bg-ivory pt-[calc(var(--header-h)+3rem)] pb-28 lg:pt-[calc(var(--header-h)+4.5rem)]">
        <p className="eyebrow text-muted">Your shortlist</p>
        <h1 id="saved-title" className="display-lg mt-4 mb-12 uppercase lg:mb-16">
          Saved pieces
        </h1>
        <SavedView pieces={getPieces().map(summarise)} />
      </section>
    </PageTransition>
  );
}
