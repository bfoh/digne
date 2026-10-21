import Link from "next/link";

import { PageTransition } from "@/components/animation/PageTransition";
import { LegalPage, type LegalSection } from "@/components/page/LegalPage";
import { formattedAddress, site, telHref } from "@/config/site";
import { breadcrumbJsonLd, jsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Terms of use",
  description: `The terms for using the ${site.name} website — an online catalogue for the showroom in Agbogba, Accra.`,
  path: "/terms-and-conditions",
});

/*
 * Website terms for the enquiry-only catalogue. They make no ownership claims
 * over the photography (its permissions are still to be confirmed) and form no
 * contract of sale. TODO(business): legal review before launch, and new sales
 * terms before online checkout opens (docs/BUSINESS-INPUTS.md).
 */
const UPDATED = "20 October 2026";

const sections: LegalSection[] = [
  {
    id: "about",
    title: "About this website",
    body: (
      <p>
        This website is an online catalogue for {site.name}, a formalwear showroom in {formattedAddress}. By using it, you agree to these terms. If you don’t agree,
        please don’t use the site.
      </p>
    ),
  },
  {
    id: "catalogue",
    title: "Pieces, photographs and prices",
    body: (
      <>
        <p>The pieces shown were photographed on the showroom floor. Please bear in mind:</p>
        <ul>
          <li>The photographs have been digitally enhanced, so colour and fine detail may differ from the garment itself.</li>
          <li>Descriptions cover what can be seen in the photographs. They don’t confirm fabric, construction or care.</li>
          <li>A piece shown here may no longer be on the rail. Availability, sizes and prices are confirmed only by the showroom.</li>
        </ul>
      </>
    ),
  },
  {
    id: "enquiries",
    title: "Enquiries and visit requests",
    body: (
      <p>
        Sending an enquiry or a visit request doesn’t place an order, reserve a piece or book an appointment. A visit is confirmed only when the showroom replies
        to confirm it.
      </p>
    ),
  },
  {
    id: "buying",
    title: "Buying",
    body: (
      <p>
        No sale takes place through this website. Purchases are made at the showroom, on the showroom’s own terms — see{" "}
        <Link href="/shipping-returns">delivery &amp; returns</Link>.
      </p>
    ),
  },
  {
    id: "use",
    title: "Using the website",
    body: (
      <>
        <p>Please use the site for its intended purpose: browsing, saving pieces and contacting the showroom. Please don’t:</p>
        <ul>
          <li>attempt to disrupt the site, or gain access to parts of it that aren’t public;</li>
          <li>reuse the Digne name, emblem or the site’s content for commercial purposes without the showroom’s permission.</li>
        </ul>
      </>
    ),
  },
  {
    id: "other-services",
    title: "Other services",
    body: (
      <p>
        Some links open other services, such as WhatsApp and Google Maps. They have their own terms and privacy policies, and the showroom isn’t responsible for
        them.
      </p>
    ),
  },
  {
    id: "accuracy",
    title: "Accuracy",
    body: (
      <p>
        Every effort is made to keep this website accurate, but it may contain mistakes or be out of date. Please confirm anything important — availability, sizes,
        prices or opening hours — with the showroom before you rely on it.
      </p>
    ),
  },
  {
    id: "law",
    title: "Governing law",
    body: <p>These terms are governed by the laws of the Republic of Ghana.</p>,
  },
  {
    id: "changes",
    title: "Changes and contact",
    body: (
      <p>
        These terms may change as the website does — for example, if online ordering is introduced — and the date at the top will change with them. Questions?
        Call <a href={telHref}>{site.phone.display}</a>. See also the <Link href="/privacy-policy">privacy notice</Link>.
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <PageTransition>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(breadcrumbJsonLd([{ name: "Terms of use", path: "/terms-and-conditions" }]))} />
      <LegalPage
        eyebrow="Client care"
        title="Terms of use"
        updated={UPDATED}
        intro={<p>The terms for using this website. In short: it’s a catalogue, nothing is sold or booked online, and the showroom confirms every detail.</p>}
        sections={sections}
      />
    </PageTransition>
  );
}
