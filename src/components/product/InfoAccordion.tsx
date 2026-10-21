import { Info, Layers, PackageOpen, RefreshCcw, Ruler, type LucideIcon } from "lucide-react";

import type { InfoIcon, InfoSection } from "@/content/product-info";

const ICONS: Record<InfoIcon, LucideIcon> = {
  materials: Layers,
  care: Info,
  fit: Ruler,
  collection: PackageOpen,
  exchanges: RefreshCcw,
};

/** Native <details> rows: keyboard and screen-reader support for free; height animates where supported. */
export function InfoAccordion({ sections }: { sections: InfoSection[] }) {
  return (
    <div className="border-t hairline">
      {sections.map((section) => {
        const Icon = ICONS[section.id];
        return (
          <details key={section.id} className="accordion border-b hairline">
            <summary className="flex min-h-16 cursor-pointer items-center gap-4 py-4 transition-colors hover:text-heritage">
              <Icon aria-hidden className="size-4 flex-none text-muted" strokeWidth={1.3} />
              <span className="eyebrow flex-1">{section.title}</span>
              <span aria-hidden className="plus" />
            </summary>
            <p className="pr-8 pb-6 pl-8 text-[0.95rem] leading-relaxed text-charcoal/80">{section.body}</p>
          </details>
        );
      })}
    </div>
  );
}
