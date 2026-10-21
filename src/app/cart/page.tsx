import { PageTransition } from "@/components/animation/PageTransition";
import { BagView } from "@/components/product/BagView";
import { isEnquiryMode } from "@/config/commerce";
import { getPieces, summarise } from "@/lib/commerce/catalogue";
import { pageMetadata } from "@/lib/seo";

export const metadata = {
  ...pageMetadata({ title: isEnquiryMode ? "Enquiry bag" : "Bag", description: "The pieces you’ve gathered to enquire about at Digne Suits & More.", path: "/cart" }),
  robots: { index: false },
};

export default function CartPage() {
  return (
    <PageTransition>
      <section data-theme="light" aria-labelledby="cart-title" className="gutter min-h-[80svh] bg-ivory pt-[calc(var(--header-h)+3rem)] pb-28 lg:pt-[calc(var(--header-h)+4.5rem)]">
        <p className="eyebrow text-muted">Your selection</p>
        <h1 id="cart-title" className="display-lg mt-4 mb-12 uppercase lg:mb-16">
          {isEnquiryMode ? "Enquiry bag" : "Bag"}
        </h1>
        <BagView pieces={getPieces().map(summarise)} />
      </section>
    </PageTransition>
  );
}
