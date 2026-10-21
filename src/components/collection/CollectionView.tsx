import Link from "next/link";
import type { Route } from "next";
import { Suspense } from "react";

import { PageHero } from "@/components/page/PageHero";
import type { MediaKey } from "@/content/media";
import type { PieceSummary } from "@/lib/commerce/catalogue";
import type { CategorySlug } from "@/lib/commerce/schema";
import { cn } from "@/lib/cn";

import { CollectionBrowser } from "./CollectionBrowser";
import { CollectionGrid } from "./CollectionGrid";

interface CollectionViewProps {
  eyebrow: string;
  title: string;
  summary: string;
  image: { key: MediaKey; focus?: string };
  pieces: PieceSummary[];
  categories: { slug: CategorySlug; title: string; count: number }[];
  current: CategorySlug | "all";
  hasPrices: boolean;
}

/** A collection page: an editorial title band, the category tabs, then the filterable grid. */
export function CollectionView({ eyebrow, title, summary, image, pieces, categories, current, hasPrices }: CollectionViewProps) {
  const total = categories.reduce((n, c) => n + c.count, 0);
  const tabs: { href: Route; label: string; count: number; active: boolean }[] = [
    { href: "/collections", label: "All", count: total, active: current === "all" },
    ...categories.map((c) => ({ href: `/collections/${c.slug}` as Route, label: c.title, count: c.count, active: current === c.slug })),
  ];

  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} summary={summary} image={image} />

      <nav aria-label="Collections" className="border-b hairline bg-ivory">
        <ul className="gutter no-scrollbar flex justify-start gap-8 overflow-x-auto sm:justify-center lg:gap-12">
          {tabs.map((tab) => (
            <li key={tab.href} className="flex-none">
              <Link
                href={tab.href}
                aria-current={tab.active ? "page" : undefined}
                className={cn(
                  "eyebrow relative flex min-h-14 items-center gap-2 transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-charcoal after:transition-transform after:duration-700 after:ease-[var(--ease-mask)] hover:after:scale-x-100",
                  tab.active ? "text-charcoal after:scale-x-100" : "text-muted hover:text-charcoal",
                )}
              >
                {tab.label}
                <span className="numeral text-sm tracking-normal normal-case">{tab.count}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <section data-theme="light" aria-label={`${title} — pieces`} className="bg-ivory pb-28">
        <Suspense
          fallback={
            <div className="gutter pt-12">
              <CollectionGrid pieces={pieces} />
            </div>
          }
        >
          <CollectionBrowser pieces={pieces} hasPrices={hasPrices} />
        </Suspense>
      </section>
    </>
  );
}
