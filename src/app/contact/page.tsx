import { MapPin, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";

import { PageTransition } from "@/components/animation/PageTransition";
import { Reveal } from "@/components/animation/Reveal";
import { SplitHeading } from "@/components/animation/SplitHeading";
import { ContactForm } from "@/components/forms/ContactForm";
import { PageHero } from "@/components/page/PageHero";
import { SectionEyebrow } from "@/components/page/SectionEyebrow";
import { formattedAddress, site, telHref } from "@/config/site";
import { pad2 } from "@/lib/format";
import { breadcrumbJsonLd, jsonLd, pageMetadata } from "@/lib/seo";
import { whatsappHref } from "@/lib/whatsapp";

export const metadata = pageMetadata({
  title: "Contact",
  description: `Call, message on WhatsApp or visit ${site.name} in Agbogba, Accra. Telephone ${site.phone.display}.`,
  path: "/contact",
});

const CHANNELS = [
  {
    icon: Phone,
    title: "Call",
    detail: site.phone.display,
    body: "Speak to the showroom directly about a piece, a size or a visit.",
    href: telHref,
    action: "Call now",
    external: false,
  },
  {
    icon: MessageCircle,
    title: "WhatsApp",
    detail: site.phone.display,
    body: "Send a message — and photos of the occasion or the look you’re after.",
    href: whatsappHref(),
    action: "Open WhatsApp",
    external: true,
  },
  {
    icon: MapPin,
    title: "Visit",
    detail: formattedAddress,
    body: "See, touch and try on every piece in the showroom.",
    href: site.mapsUrl,
    action: "Get directions",
    external: true,
  },
] as const;

export default function ContactPage() {
  return (
    <PageTransition>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(breadcrumbJsonLd([{ name: "Contact", path: "/contact" }]))} />
      <PageHero
        size="md"
        eyebrow="Contact"
        title="Get in touch"
        summary="Call, message or visit — the showroom answers questions about pieces, sizes and occasions."
        image={{ key: "boutique" }}
      />

      <section data-theme="light" aria-label="Ways to reach the showroom" className="bg-ivory">
        <Reveal as="ul" stagger={0.1} className="gutter grid border-b hairline md:grid-cols-3">
          {CHANNELS.map((c, i) => (
            <li key={c.title} data-reveal-item className="border-b hairline md:border-b-0 md:first:[&>a]:pl-0 md:last:[&>a]:pr-0 md:[&:not(:first-child)]:border-l">
              <a
                href={c.href}
                {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="group flex h-full flex-col gap-8 py-12 md:px-8 md:py-16 lg:px-12"
              >
                <span className="flex items-center justify-between">
                  <span className="numeral text-xl text-heritage">{pad2(i + 1)}</span>
                  <c.icon aria-hidden className="size-5 text-muted transition-colors duration-500 group-hover:text-heritage" strokeWidth={1.3} />
                </span>
                <span>
                  <span className="label block">{c.title}</span>
                  <span className="display-sm mt-3 block">{c.detail}</span>
                  <span className="mt-3 block max-w-xs text-[0.95rem] text-muted">{c.body}</span>
                </span>
                <span className="link-line mt-auto self-start text-charcoal">
                  {c.action} <span className="arrow" aria-hidden>{c.external ? "↗" : "→"}</span>
                  {c.external && <span className="sr-only">(opens in a new tab)</span>}
                </span>
              </a>
            </li>
          ))}
        </Reveal>
      </section>

      <section data-theme="light" aria-labelledby="write-title" className="bg-ivory">
        <div className="gutter grid grid-cols-12 gap-x-6 gap-y-14 py-24 lg:py-32">
          <div className="col-span-12 lg:col-span-5">
            <SectionEyebrow index="04">Write to us</SectionEyebrow>
            <SplitHeading id="write-title" className="display-lg mt-7 uppercase">
              Send a
              <br />
              <em className="font-normal text-heritage">message.</em>
            </SplitHeading>
            <Reveal>
              <p className="lede mt-8 max-w-md text-charcoal/80">
                Write your question here and it opens in WhatsApp, ready to send — the quickest way to reach the showroom.
              </p>
              <dl className="mt-12 grid gap-6 border-t hairline pt-8 text-[0.95rem]">
                <div>
                  <dt className="eyebrow text-muted">Opening hours</dt>
                  <dd className="mt-2">
                    {site.hours
                      ? site.hours.map((h) => (
                          <span key={h.days} className="block">
                            {h.days} · {h.opens}–{h.closes}
                          </span>
                        ))
                      : "Please call or message ahead to confirm today’s hours."}
                  </dd>
                </div>
                {site.email && (
                  <div>
                    <dt className="eyebrow text-muted">Email</dt>
                    <dd className="mt-2">
                      <a href={`mailto:${site.email}`} className="link-under">
                        {site.email}
                      </a>
                    </dd>
                  </div>
                )}
                {site.social.length > 0 && (
                  <div>
                    <dt className="eyebrow text-muted">Follow</dt>
                    <dd className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
                      {site.social.map((s) => (
                        <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer" className="link-under">
                          {s.label}
                        </a>
                      ))}
                    </dd>
                  </div>
                )}
                <div>
                  <dt className="eyebrow text-muted">Planning to come in?</dt>
                  <dd className="mt-2">
                    <Link href="/appointments" className="link-under">
                      Request a visit
                    </Link>
                  </dd>
                </div>
              </dl>
            </Reveal>
          </div>
          <div className="col-span-12 lg:col-span-6 lg:col-start-7">
            <ContactForm />
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
