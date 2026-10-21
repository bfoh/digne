import { PageTransition } from "@/components/animation/PageTransition";
import { Reveal } from "@/components/animation/Reveal";
import { VisitRequestForm } from "@/components/forms/VisitRequestForm";
import { PageHero } from "@/components/page/PageHero";
import { SectionEyebrow } from "@/components/page/SectionEyebrow";
import { formattedAddress, site, telHref } from "@/config/site";
import { getPieces, summarise } from "@/lib/commerce/catalogue";
import { pad2 } from "@/lib/format";
import { breadcrumbJsonLd, jsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Request a visit",
  description: `Request a visit to the ${site.name} showroom in Agbogba, Accra. Tell us when you’d like to come and what you’re dressing for.`,
  path: "/appointments",
});

const STEPS = [
  { title: "Send your request", body: "Fill in the form and it opens in WhatsApp, ready to send." },
  { title: "The showroom replies", body: "They confirm the time — or suggest another that works better." },
  { title: "Come in and try on", body: `Visit us in ${site.address.locality}, ${site.address.city}, and take your time.` },
];

export default function AppointmentsPage() {
  return (
    <PageTransition>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(breadcrumbJsonLd([{ name: "Request a visit", path: "/appointments" }]))} />
      <PageHero
        size="md"
        eyebrow="Appointments"
        title="Request a visit"
        summary="Tell us when you’d like to come in and what you’re dressing for. The showroom will reply to confirm."
        image={{ key: "suitSelection" }}
      />

      <section data-theme="light" aria-label="Request a visit" className="bg-ivory">
        <div className="gutter grid grid-cols-12 gap-x-6 gap-y-16 py-20 lg:py-28">
          <aside aria-labelledby="steps-title" className="col-span-12 lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:col-span-4 lg:self-start">
            <SectionEyebrow index="01">How it works</SectionEyebrow>
            <h2 id="steps-title" className="sr-only">
              How a visit request works
            </h2>
            <Reveal as="ol" stagger={0.1} className="mt-8 grid border-t hairline">
              {STEPS.map((step, i) => (
                <li key={step.title} data-reveal-item className="grid grid-cols-[2.75rem_1fr] border-b hairline py-6">
                  <span className="numeral text-2xl text-heritage">{pad2(i + 1)}</span>
                  <div>
                    <h3 className="label">{step.title}</h3>
                    <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">{step.body}</p>
                  </div>
                </li>
              ))}
            </Reveal>
            <p className="mt-8 text-sm leading-relaxed text-muted">
              A request isn’t a booking — your visit is confirmed once the showroom replies. Rather talk it through?{" "}
              <a href={telHref} className="link-under text-charcoal">
                Call {site.phone.display}
              </a>
              .
            </p>
            <p className="mt-4 text-sm text-muted">{formattedAddress}</p>
          </aside>

          <div className="col-span-12 lg:col-span-7 lg:col-start-6">
            <VisitRequestForm pieces={getPieces().map(summarise)} />
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
