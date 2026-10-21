"use client";

import { ChevronDown, Search, SlidersHorizontal, X } from "lucide-react";
import type { Route } from "next";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useOptimistic, useState, useTransition } from "react";

import { Sheet } from "@/components/ui/Sheet";
import type { PieceSummary } from "@/lib/commerce/catalogue";
import { cn } from "@/lib/cn";

import { CollectionGrid } from "./CollectionGrid";

type Sort = "featured" | "name-asc" | "name-desc" | "price-asc" | "price-desc";

const SORTS: { value: Sort; label: string; needsPrices?: boolean }[] = [
  { value: "featured", label: "Featured" },
  { value: "name-asc", label: "Name, A–Z" },
  { value: "name-desc", label: "Name, Z–A" },
  { value: "price-asc", label: "Price, low to high", needsPrices: true },
  { value: "price-desc", label: "Price, high to low", needsPrices: true },
];

const byName = (a: PieceSummary, b: PieceSummary) => a.name.localeCompare(b.name);

/**
 * Filters live in the URL (?q=&colour=&sort=), so a filtered view can be
 * shared and survives a refresh. Only filters the data supports are offered:
 * colour and search today; price sorts appear once prices exist.
 */
export function CollectionBrowser({ pieces, hasPrices }: { pieces: PieceSummary[]; hasPrices: boolean }) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const query = params.get("q") ?? "";
  const urlColours = useMemo(() => params.get("colour")?.split(",").filter(Boolean) ?? [], [params]);
  // Ticks a colour at once, before the URL update lands.
  const [colours, setOptimisticColours] = useOptimistic(urlColours);
  const sorts = SORTS.filter((s) => hasPrices || !s.needsPrices);
  const sortParam = params.get("sort") as Sort | null;
  const sort: Sort = sorts.some((s) => s.value === sortParam) ? (sortParam as Sort) : "featured";

  // The search box follows the URL when it changes elsewhere (back button, a removed chip).
  const [draft, setDraft] = useState(query);
  const [shownQuery, setShownQuery] = useState(query);
  if (query !== shownQuery) {
    setShownQuery(query);
    setDraft(query);
  }

  const update = (next: { q?: string; colour?: string[]; sort?: Sort }) => {
    const sp = new URLSearchParams(params);
    const set = (key: string, value: string | null) => (value ? sp.set(key, value) : sp.delete(key));
    if (next.q !== undefined) set("q", next.q.trim());
    if (next.colour !== undefined) set("colour", next.colour.join(","));
    if (next.sort !== undefined) set("sort", next.sort === "featured" ? null : next.sort);
    const qs = sp.toString();
    startTransition(() => {
      if (next.colour !== undefined) setOptimisticColours(next.colour);
      router.replace(`${pathname}${qs ? `?${qs}` : ""}` as Route, { scroll: false });
    });
  };

  // Search as you type, settled for a moment so the URL isn't rewritten on every key.
  useEffect(() => {
    if (draft === query) return;
    const t = window.setTimeout(() => update({ q: draft }), 280);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `update` reads the latest params on each call
  }, [draft]);

  const palette = useMemo(() => {
    const seen = new Map<string, string>();
    for (const p of pieces) for (const c of p.colours) seen.set(c.name, c.hex);
    return [...seen].map(([name, hex]) => ({ name, hex }));
  }, [pieces]);

  const results = useMemo(() => {
    const needle = query.toLowerCase();
    const list = pieces.filter(
      (p) =>
        (!needle || `${p.name} ${p.summary} ${p.categoryTitle} ${p.colours.map((c) => c.name).join(" ")}`.toLowerCase().includes(needle)) &&
        (!colours.length || p.colours.some((c) => colours.includes(c.name))),
    );
    const price = (p: PieceSummary) => p.priceMinor ?? Number.POSITIVE_INFINITY;
    switch (sort) {
      case "name-asc":
        return [...list].sort(byName);
      case "name-desc":
        return [...list].sort((a, b) => byName(b, a));
      case "price-asc":
        return [...list].sort((a, b) => price(a) - price(b));
      case "price-desc":
        return [...list].sort((a, b) => price(b) - price(a));
      default:
        return list;
    }
  }, [pieces, query, colours, sort]);

  const toggleColour = (name: string) => update({ colour: colours.includes(name) ? colours.filter((c) => c !== name) : [...colours, name] });
  const clearAll = () => {
    setDraft("");
    update({ q: "", colour: [] });
  };
  const active = colours.length + (query ? 1 : 0);
  const countLabel = `${results.length} ${results.length === 1 ? "piece" : "pieces"}`;

  return (
    <>
      <div className="border-b hairline">
        <div className="gutter grid min-h-14 grid-cols-[1fr_auto_auto] items-center">
          <p className="eyebrow text-muted" aria-live="polite">
            {countLabel}
          </p>
          <label className="relative flex min-h-14 items-center border-l hairline pr-4 pl-5">
            <span className="sr-only">Sort pieces</span>
            <select
              value={sort}
              onChange={(e) => update({ sort: e.currentTarget.value as Sort })}
              className="eyebrow cursor-pointer appearance-none bg-transparent pr-6 outline-none"
            >
              {sorts.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            <ChevronDown aria-hidden className="pointer-events-none absolute right-4 size-3.5" strokeWidth={1.4} />
          </label>
          <button
            type="button"
            onClick={() => setFiltersOpen(true)}
            aria-haspopup="dialog"
            className="eyebrow -mr-[var(--gutter)] flex min-h-14 items-center gap-2.5 border-l hairline pr-[var(--gutter)] pl-5"
          >
            <SlidersHorizontal aria-hidden className="size-3.5" strokeWidth={1.4} />
            Filter{active > 0 && <span className="text-heritage">({active})</span>}
          </button>
        </div>
      </div>

      {active > 0 && (
        <div className="gutter flex flex-wrap items-center gap-2 pt-6">
          {query && <Chip label={`“${query}”`} onRemove={() => update({ q: "" })} />}
          {colours.map((c) => (
            <Chip key={c} label={c} onRemove={() => toggleColour(c)} />
          ))}
          <button type="button" onClick={clearAll} className="link-under ml-2 text-sm text-muted hover:text-charcoal">
            Clear all
          </button>
        </div>
      )}

      <div className="gutter pt-10 lg:pt-12">
        {results.length ? (
          <CollectionGrid pieces={results} />
        ) : (
          <div className="grid justify-items-center gap-5 py-24 text-center">
            <p className="display-sm">No pieces match these filters.</p>
            <p className="max-w-sm text-sm text-muted">Try another colour or search term — or ask the showroom, who can tell you what’s on the rails today.</p>
            <button type="button" onClick={clearAll} className="btn mt-3">
              Clear all filters
            </button>
          </div>
        )}
      </div>

      <Sheet open={filtersOpen} onClose={() => setFiltersOpen(false)} variant="drawer" labelledBy="filter-title">
        <header className="flex h-[var(--header-h)] flex-none items-center justify-between border-b hairline pr-3 pl-6">
          <h2 id="filter-title" className="eyebrow">
            Filter
          </h2>
          <button type="button" onClick={() => setFiltersOpen(false)} data-autofocus="" aria-label="Close filters" className="grid size-11 place-items-center opacity-70 transition-opacity hover:opacity-100">
            <X aria-hidden className="size-5" strokeWidth={1.2} />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto px-6 py-8">
          <label className="block">
            <span className="eyebrow">Search</span>
            <span className="relative mt-3 block">
              <Search aria-hidden className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted" strokeWidth={1.4} />
              <input
                type="search"
                value={draft}
                onChange={(e) => setDraft(e.currentTarget.value)}
                placeholder="Blazer, burgundy, shirt…"
                className="field-input pl-11"
              />
            </span>
          </label>

          <fieldset className="mt-10">
            <legend className="eyebrow">Colour</legend>
            <ul className="mt-4 grid gap-1">
              {palette.map((c) => {
                const checked = colours.includes(c.name);
                return (
                  <li key={c.name}>
                    <label className="flex min-h-11 cursor-pointer items-center gap-3.5 text-[0.95rem]">
                      <input type="checkbox" checked={checked} onChange={() => toggleColour(c.name)} className="peer sr-only" />
                      <span
                        aria-hidden
                        className="grid size-4 place-items-center border hairline peer-checked:border-charcoal peer-checked:bg-charcoal peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--focus)]"
                      >
                        <span className={cn("size-1.5 bg-ivory", !checked && "hidden")} />
                      </span>
                      <span aria-hidden className="size-3.5 rounded-full ring-1 ring-charcoal/15" style={{ background: c.hex }} />
                      {c.name}
                    </label>
                  </li>
                );
              })}
            </ul>
          </fieldset>
          <p className="mt-10 text-xs leading-relaxed text-muted">Size, price and availability filters appear once the showroom’s stock data is connected.</p>
        </div>
        <footer className="grid flex-none grid-cols-2 gap-3 border-t hairline px-6 pt-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
          <button type="button" onClick={clearAll} className="btn btn-outline">
            Clear all
          </button>
          <button type="button" onClick={() => setFiltersOpen(false)} className="btn">
            Show {results.length}
          </button>
        </footer>
      </Sheet>
    </>
  );
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <button type="button" onClick={onRemove} className="flex min-h-9 items-center gap-2 border hairline px-3 text-sm transition-colors hover:border-charcoal">
      {label}
      <X aria-hidden className="size-3.5" strokeWidth={1.4} />
      <span className="sr-only">— remove filter</span>
    </button>
  );
}
