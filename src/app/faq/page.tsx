import Link from "next/link";

import { PageTransition } from "@/components/animation/PageTransition";
import { Reveal } from "@/components/animation/Reveal";
import { SectionEyebrow } from "@/components/page/SectionEyebrow";
import { site, telHref } from "@/config/site";
import { faqGroups } from "@/content/faq";
import { pad2 } from "@/lib/format";
import { breadcrumbJsonLd, jsonLd, pageMetadata } from "@/lib/seo";
import { whatsappHref } from "@/lib/whatsapp";

export const metadata = pageMetadata({
  title: "Questions",
  description: `Answers about visiting ${site.name} in Agbogba, Accra — opening hours, enquiries, prices, sizes and how the website works.`,
  path: "/faq",
});

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqGroups.flatMap((g) => g.items).map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
};

export default function FaqPage() {
  return (
    <PageTransition>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(faqJsonLd)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(breadcrumbJsonLd([{ name: "Questions", path: "/faq" }]))} />
      <section data-theme="light" aria-labelledby="faq-title" className="bg-ivory pt-[calc(var(--header-h)+3rem)] pb-28 lg:pt-[calc(var(--header-h)+5rem)]">
        <div className="gutter grid grid-cols-12 gap-x-6 gap-y-14">
          <header className="col-span-12 lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:col-span-4 lg:self-start">
            <p className="eyebrow text-muted">Client care</p>
            <h1 id="faq-title" className="display-lg mt-5 uppercase">
              Questions,
              <br />
              <em className="font-normal text-heritage">answered.</em>
            </h1>
            <Reveal>
              <p className="lede mt-8 max-w-sm text-charcoal/80">Can’t see yours? The showroom is a message away.</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className="btn">
                  Ask on WhatsApp <span className="arrow" aria-hidden>↗</span>
                  <span className="sr-only">(opens WhatsApp)</span>
                </a>
                <a href={telHref} className="btn btn-outline">
                  Call {site.phone.display}
                </a>
              </div>
            </Reveal>
          </header>

          <div className="col-span-12 grid gap-16 lg:col-span-7 lg:col-start-6">
            {faqGroups.map((group, g) => (
              <section key={group.title} aria-labelledby={`faq-group-${g}`}>
                <SectionEyebrow as="h2" id={`faq-group-${g}`} index={pad2(g + 1)}>
                  {group.title}
                </SectionEyebrow>
                <div className="mt-6 border-t hairline">
                  {group.items.map((faq) => (
                    <details key={faq.question} className="accordion border-b hairline">
                      <summary className="flex min-h-18 cursor-pointer items-center gap-6 py-5 transition-colors hover:text-heritage">
                        <span className="flex-1 font-display text-[clamp(1.25rem,1.6vw,1.6rem)] leading-snug">{faq.question}</span>
                        <span aria-hidden className="plus" />
                      </summary>
                      <div className="max-w-2xl pr-10 pb-7 text-[0.98rem] leading-relaxed text-charcoal/80">
                        <p>{faq.answer}</p>
                        {faq.link && (
                          <Link href={faq.link.href} className="link-under mt-4 inline-block text-charcoal">
                            {faq.link.label}
                          </Link>
                        )}
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
