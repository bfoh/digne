import Link from "next/link";

import { PageTransition } from "@/components/animation/PageTransition";
import { LegalPage, type LegalSection } from "@/components/page/LegalPage";
import { formattedAddress, site, telHref } from "@/config/site";
import { breadcrumbJsonLd, jsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Privacy",
  description: `How the ${site.name} website handles your information: what is kept on your device, what happens when you enquire, and the services involved.`,
  path: "/privacy-policy",
});

/*
 * This notice describes the site as built: no accounts, no payments, no
 * analytics, forms that hand off to WhatsApp. Update it whenever any of that
 * changes. TODO(business): Digne to review before launch — especially how long
 * enquiry conversations are kept (docs/BUSINESS-INPUTS.md).
 */
const UPDATED = "20 October 2026";

const sections: LegalSection[] = [
  {
    id: "who-we-are",
    title: "Who we are",
    body: (
      <>
        <p>
          This website belongs to {site.name}, a formalwear showroom in {formattedAddress}. If you have a question about this notice or your information, call or
          message us on <a href={telHref}>{site.phone.display}</a>
          {site.email && (
            <>
              {" "}
              or email <a href={`mailto:${site.email}`}>{site.email}</a>
            </>
          )}
          .
        </p>
      </>
    ),
  },
  {
    id: "on-your-device",
    title: "What is kept on your device",
    body: (
      <>
        <p>To make the site work, a few small items are saved in your own browser. They stay on your device and are never sent to us:</p>
        <ul>
          <li>
            <strong>Your enquiry bag</strong> — the pieces, colours and sizes you add, saved in local storage as <code>digne:bag</code>.
          </li>
          <li>
            <strong>Saved pieces</strong> — the pieces you mark with a heart, saved as <code>digne:wishlist</code>.
          </li>
          <li>
            <strong>The opening animation</strong> — a note that you’ve already seen it, saved for this tab only as <code>digne:intro</code>.
          </li>
        </ul>
        <p>
          This website doesn’t set cookies of its own. You can empty the bag from the <Link href="/cart">enquiry bag</Link> page, or clear everything through your
          browser’s settings for this site.
        </p>
      </>
    ),
  },
  {
    id: "enquiries",
    title: "When you enquire",
    body: (
      <>
        <p>
          The contact and visit-request forms don’t send or store anything. They write a message for you and open it in WhatsApp; nothing reaches us unless you
          press send there.
        </p>
        <p>
          When you call, message or WhatsApp us, we receive what you choose to share — usually your name, phone number and what you’re looking for. We use it to
          answer you, check availability and arrange visits. We don’t sell it or use it for advertising.
        </p>
      </>
    ),
  },
  {
    id: "other-services",
    title: "Other services involved",
    body: (
      <>
        <p>Some links and features hand you to another service, which then handles your information under its own privacy policy:</p>
        <ul>
          <li>
            <strong>WhatsApp</strong> (run by Meta) — when you choose to send an enquiry, open a chat or follow a WhatsApp link.
          </li>
          <li>
            <strong>Google Maps</strong> — when you follow a “Get directions” link, or choose “Show the map” on the showroom page. The map doesn’t load until you
            ask for it.
          </li>
          <li>
            <strong>Our hosting provider</strong> — like any website, the servers that deliver these pages may keep short-lived technical logs, such as IP addresses
            and the pages requested, to keep the site secure and running.
          </li>
        </ul>
        <p>Fonts and images are served from this website itself, not from third parties.</p>
      </>
    ),
  },
  {
    id: "analytics",
    title: "Analytics and advertising",
    body: (
      <p>
        This website doesn’t use analytics, advertising or tracking tools. If that changes, this notice will be updated first, and any tool that needs your consent
        will ask for it.
      </p>
    ),
  },
  {
    id: "your-rights",
    title: "Your rights",
    body: (
      <>
        <p>
          Under Ghana’s Data Protection Act, 2012 (Act 843), you can ask us what personal information we hold about you, and ask us to correct or delete it. Contact
          us on <a href={telHref}>{site.phone.display}</a> and we’ll help.
        </p>
        <p>If you’re not satisfied with our answer, you can contact the Data Protection Commission of Ghana.</p>
      </>
    ),
  },
  {
    id: "changes",
    title: "Changes to this notice",
    body: <p>When the website changes — for example, if online ordering is introduced — this notice will be updated and the date at the top will change.</p>,
  },
];

export default function PrivacyPolicyPage() {
  return (
    <PageTransition>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(breadcrumbJsonLd([{ name: "Privacy", path: "/privacy-policy" }]))} />
      <LegalPage
        eyebrow="Client care"
        title="Privacy"
        updated={UPDATED}
        intro={
          <p>
            How this website handles your information. It’s an online catalogue for the showroom — there are no accounts, no online payments and no tracking, so
            there isn’t much to tell.
          </p>
        }
        sections={sections}
      />
    </PageTransition>
  );
}
