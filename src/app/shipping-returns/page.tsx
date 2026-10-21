import Link from "next/link";

import { PageTransition } from "@/components/animation/PageTransition";
import { LegalPage, type LegalSection } from "@/components/page/LegalPage";
import { site, telHref } from "@/config/site";
import { breadcrumbJsonLd, jsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Delivery & returns",
  description: `How buying from ${site.name} works today: pieces are chosen and bought at the showroom in Agbogba, Accra. Delivery and exchanges are confirmed by the showroom.`,
  path: "/shipping-returns",
});

/*
 * Describes the current enquiry-only setup. TODO(business): when Digne
 * confirms delivery areas, costs, timings and its exchange/returns policy,
 * replace sections 2–3 — and complete section 4 before online checkout opens.
 */
const UPDATED = "20 October 2026";

const sections: LegalSection[] = [
  {
    id: "buying-today",
    title: "How buying works today",
    body: (
      <>
        <p>Every piece is chosen and bought in person at the showroom. The website is there to help you look ahead and plan:</p>
        <ul>
          <li>Browse the collections and save the pieces you like.</li>
          <li>
            Gather them in your <Link href="/cart">enquiry bag</Link> and send the list to the showroom on WhatsApp.
          </li>
          <li>The showroom confirms availability, sizes and prices, then you visit to try on and buy.</li>
        </ul>
        <p>Nothing is reserved, ordered or paid for through the website.</p>
      </>
    ),
  },
  {
    id: "delivery",
    title: "Delivery",
    body: (
      <p>
        Delivery isn’t offered through the website. If you can’t come to the showroom, ask whether delivery can be arranged — and what it would cost — before
        you buy. Call <a href={telHref}>{site.phone.display}</a> or send a message on WhatsApp.
      </p>
    ),
  },
  {
    id: "exchanges",
    title: "Exchanges & returns",
    body: (
      <p>
        The showroom sets its own exchange and returns terms. Please ask about them before you buy, and keep your receipt. Trying pieces on in the showroom is the
        best way to be sure of the fit.
      </p>
    ),
  },
  {
    id: "online-orders",
    title: "When online ordering opens",
    body: (
      <p>
        Before any order can be placed online, this page will set out where the showroom delivers, what it costs, how long it takes and how returns work for
        online orders.
      </p>
    ),
  },
];

export default function ShippingReturnsPage() {
  return (
    <PageTransition>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(breadcrumbJsonLd([{ name: "Delivery & returns", path: "/shipping-returns" }]))} />
      <LegalPage
        eyebrow="Client care"
        title="Delivery & returns"
        updated={UPDATED}
        intro={<p>Online ordering isn’t open yet, so this page is short: for now, every piece is chosen and bought at the showroom in Agbogba.</p>}
        sections={sections}
      />
    </PageTransition>
  );
}
