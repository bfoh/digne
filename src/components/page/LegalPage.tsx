import type { ReactNode } from "react";

export interface LegalSection {
  id: string;
  title: string;
  body: ReactNode;
}

interface LegalPageProps {
  eyebrow: string;
  title: string;
  /** Shown as "Last updated". Use a long-form date, e.g. "20 October 2026". */
  updated: string;
  intro: ReactNode;
  sections: LegalSection[];
}

/** Plain, readable long-form pages: a contents list beside numbered sections. */
export function LegalPage({ eyebrow, title, updated, intro, sections }: LegalPageProps) {
  return (
    <article data-theme="light" aria-labelledby="legal-title" className="bg-ivory pt-[calc(var(--header-h)+3rem)] pb-28 lg:pt-[calc(var(--header-h)+5rem)]">
      <header className="gutter grid grid-cols-12 gap-x-6 border-b hairline pb-12 lg:pb-16">
        <div className="col-span-12 lg:col-span-8 lg:col-start-5">
          <p className="eyebrow text-muted">{eyebrow}</p>
          <h1 id="legal-title" className="display-lg mt-5 uppercase">
            {title}
          </h1>
          <p className="mt-6 text-sm text-muted">Last updated {updated}</p>
          <div className="lede mt-8 max-w-2xl text-charcoal/85">{intro}</div>
        </div>
      </header>

      <div className="gutter grid grid-cols-12 gap-x-6 gap-y-12 pt-12 lg:pt-16">
        <nav aria-labelledby="legal-contents" className="col-span-12 lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:col-span-3 lg:self-start">
          <h2 id="legal-contents" className="eyebrow text-muted">
            On this page
          </h2>
          <ol className="mt-5 grid gap-2.5 text-[0.95rem]">
            {sections.map((s, i) => (
              <li key={s.id} className="flex gap-3">
                <span className="numeral w-6 text-heritage">{i + 1}.</span>
                <a href={`#${s.id}`} className="text-charcoal/75 transition-colors hover:text-charcoal">
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="col-span-12 grid gap-14 lg:col-span-7 lg:col-start-5">
          {sections.map((s, i) => (
            <section key={s.id} id={s.id} aria-labelledby={`${s.id}-title`} className="scroll-mt-[calc(var(--header-h)+2rem)]">
              <h2 id={`${s.id}-title`} className="display-sm flex gap-4">
                <span className="numeral text-heritage">{i + 1}.</span>
                {s.title}
              </h2>
              <div className="prose-digne mt-5">{s.body}</div>
            </section>
          ))}
        </div>
      </div>
    </article>
  );
}
