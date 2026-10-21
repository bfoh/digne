import Link from "next/link";

import { PageTransition } from "@/components/animation/PageTransition";
import { Reveal } from "@/components/animation/Reveal";
import { SectionEyebrow } from "@/components/page/SectionEyebrow";
import { site } from "@/config/site";
import { getCategories } from "@/lib/commerce/catalogue";
import { pad2 } from "@/lib/format";
import { breadcrumbJsonLd, jsonLd, pageMetadata } from "@/lib/seo";
import { whatsappHref } from "@/lib/whatsapp";

export const metadata = pageMetadata({
  title: "Size guide",
  description: `How to measure for suits, blazers, shirts and trousers, and the sizes you can name when enquiring at ${site.name}.`,
  path: "/size-guide",
});

/** Standard measuring technique — general guidance, not a Digne size chart. */
const MEASURES = [
  { name: "Chest", how: "Around the fullest part of the chest, under the arms and across the shoulder blades. Keep the tape level and breathe normally." },
  { name: "Waist", how: "Around your natural waist, just above the hip bones — or where you usually wear your trousers." },
  { name: "Seat", how: "Around the fullest part of the hips and seat, feet together." },
  { name: "Inside leg", how: "From the top of the inner thigh to the floor, standing straight without shoes." },
  { name: "Collar", how: "Around the base of the neck where a shirt collar sits, with one finger’s room beneath the tape." },
  { name: "Sleeve", how: "From the centre of the back of the neck, over the shoulder and down to the wrist bone, arm relaxed." },
];

/** Notes on reading each scale. Keep in step with the scales in src/content/catalogue.ts. */
const SCALE_NOTES: Record<string, string> = {
  "46": "European jacket sizes. As a rough guide, the size is about half your chest measurement in centimetres — a 100 cm chest is often a 50.",
  S: "Letter sizes. Fit varies between shirt styles, so try on or ask about collar and sleeve.",
  "30": "Waist measurement in inches.",
};

export default function SizeGuidePage() {
  // Group collections that share a scale, e.g. suits, blazers and occasionwear jackets.
  const scales = new Map<string, { sizes: string[]; titles: string[] }>();
  for (const c of getCategories()) {
    const key = c.enquirySizes.join("|");
    const entry = scales.get(key) ?? { sizes: c.enquirySizes, titles: [] };
    entry.titles.push(c.title);
    scales.set(key, entry);
  }

  return (
    <PageTransition>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(breadcrumbJsonLd([{ name: "Size guide", path: "/size-guide" }]))} />
      <section data-theme="light" aria-labelledby="size-title" className="bg-ivory pt-[calc(var(--header-h)+3rem)] pb-28 lg:pt-[calc(var(--header-h)+5rem)]">
        <header className="gutter grid grid-cols-12 gap-x-6 border-b hairline pb-12 lg:pb-16">
          <div className="col-span-12 lg:col-span-8 lg:col-start-5">
            <p className="eyebrow text-muted">Client care</p>
            <h1 id="size-title" className="display-lg mt-5 uppercase">
              Size guide
            </h1>
            <p className="lede mt-8 max-w-2xl text-charcoal/85">
              How to measure yourself, and the sizes you can name when you enquire. Fit varies from piece to piece, so the showroom will always help you try
              on and confirm.
            </p>
          </div>
        </header>

        <div className="gutter grid grid-cols-12 gap-x-6 gap-y-12 pt-14 lg:pt-20">
          <div className="col-span-12 lg:col-span-3">
            <SectionEyebrow as="h2" index="01">
              How to measure
            </SectionEyebrow>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">Use a soft tape over a light shirt. It’s easier with someone to help.</p>
          </div>
          <Reveal as="ol" stagger={0.06} className="col-span-12 grid border-t hairline sm:grid-cols-2 lg:col-span-8 lg:col-start-5">
            {MEASURES.map((m, i) => (
              <li key={m.name} data-reveal-item className="grid grid-cols-[2.5rem_1fr] border-b hairline py-7 sm:odd:pr-8 sm:even:border-l sm:even:pl-8">
                <span aria-hidden className="numeral text-xl text-heritage">
                  {pad2(i + 1)}
                </span>
                <div>
                  <h3 className="label">{m.name}</h3>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">{m.how}</p>
                </div>
              </li>
            ))}
          </Reveal>
        </div>

        <div className="gutter grid grid-cols-12 gap-x-6 gap-y-12 pt-20 lg:pt-28">
          <div className="col-span-12 lg:col-span-3">
            <SectionEyebrow as="h2" index="02">
              Sizes to choose from
            </SectionEyebrow>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              These are the sizes you can name when you enquire about a piece. They aren’t stock — the showroom confirms what’s available.
            </p>
          </div>
          <div className="col-span-12 grid gap-10 lg:col-span-8 lg:col-start-5">
            {[...scales.values()].map((scale) => (
              <div key={scale.titles.join()} className="border-t hairline pt-7">
                <h3 className="display-sm">{scale.titles.join(", ").replace(/, ([^,]*)$/, " & $1")}</h3>
                <ul aria-label={`${scale.titles.join(", ")} sizes`} className="mt-5 flex flex-wrap gap-2">
                  {scale.sizes.map((size) => (
                    <li key={size} className="grid min-h-11 min-w-12 place-items-center border hairline px-3 text-sm tabular-nums">
                      {size}
                    </li>
                  ))}
                </ul>
                {SCALE_NOTES[scale.sizes[0]] && <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">{SCALE_NOTES[scale.sizes[0]]}</p>}
              </div>
            ))}
          </div>
        </div>

        <div className="gutter grid grid-cols-12 gap-x-6 pt-20 lg:pt-28">
          <div className="col-span-12 border hairline p-8 lg:col-span-8 lg:col-start-5 lg:p-12">
            <SectionEyebrow as="h2" index="03">
              Still unsure?
            </SectionEyebrow>
            <p className="display-sm mt-5 max-w-xl">Choose “Not sure” when you enquire, and bring a jacket that fits you well when you visit.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/appointments" className="btn">
                Request a visit
              </Link>
              <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                Ask on WhatsApp <span className="arrow" aria-hidden>↗</span>
                <span className="sr-only">(opens WhatsApp)</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
