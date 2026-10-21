import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageTransition } from "@/components/animation/PageTransition";
import { CollectionView } from "@/components/collection/CollectionView";
import { getCategories, getCategory, getFacets, getPiecesInCategory, summarise } from "@/lib/commerce/catalogue";
import { breadcrumbJsonLd, jsonLd, pageMetadata } from "@/lib/seo";

// Each category is prerendered; navigations wait for it rather than flash a skeleton.
export const instant = false;

export function generateStaticParams() {
  return getCategories().map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/collections/[category]">): Promise<Metadata> {
  const category = getCategory((await params).category);
  if (!category) return {};
  return pageMetadata({ title: category.title, description: `${category.summary} At Digne Suits & More, Agbogba, Accra.`, path: `/collections/${category.slug}` });
}

export default async function CategoryPage({ params }: PageProps<"/collections/[category]">) {
  const category = getCategory((await params).category);
  if (!category) notFound();
  const categories = getCategories().map((c) => ({ slug: c.slug, title: c.title, count: getPiecesInCategory(c.slug).length }));
  const trail = [
    { name: "Collections", path: "/collections" },
    { name: category.title, path: `/collections/${category.slug}` },
  ];
  return (
    <PageTransition>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(breadcrumbJsonLd(trail))} />
      <CollectionView
        eyebrow="The collections"
        title={category.title}
        summary={category.summary}
        image={category.media}
        pieces={getPiecesInCategory(category.slug).map(summarise)}
        categories={categories}
        current={category.slug}
        hasPrices={getFacets().price !== null}
      />
    </PageTransition>
  );
}
