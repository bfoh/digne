# Digne Suits & More — website

The website for Digne Suits & More, a formalwear showroom in Agbogba, Accra.
It is an editorial catalogue: visitors browse the collections, save pieces,
gather them into an enquiry bag and send that to the showroom on WhatsApp, or
request a visit. **Nothing is sold or paid for online yet** — see
[docs/COMMERCE.md](docs/COMMERCE.md) for what switching that on involves.

- [docs/BUSINESS-INPUTS.md](docs/BUSINESS-INPUTS.md) — everything still needed from Digne before launch
- [docs/COMMERCE.md](docs/COMMERCE.md) — enquiry mode today, and the path to online checkout

## Stack

Next.js 16 (App Router, Turbopack, Cache Components, typed routes) · React 19 ·
TypeScript (strict) · Tailwind CSS 4 · GSAP (ScrollTrigger, SplitText) and
Lenis for motion · Zustand for the bag and saved pieces (browser storage) ·
react-hook-form + Zod for forms · Playwright + axe-core for tests.

> **Read `AGENTS.md` first.** This Next.js version differs from older releases;
> its own guides ship in `node_modules/next/dist/docs/`.

## Getting started

Requires Node.js 20.9 or later.

```bash
npm install
cp .env.example .env.local   # then set NEXT_PUBLIC_SITE_URL
npm run dev                  # http://localhost:3000
```

To preview on a phone, join the same Wi-Fi and open the "Network" address `next dev` prints. `next.config.ts` adds this machine's LAN addresses to `allowedDevOrigins`; without that, Next blocks its dev scripts for other hosts and the page never hydrates.

| Script | What it does |
| --- | --- |
| `npm run dev` | Development server with hot reload |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run check` | Regenerate route types, type-check and lint — run before every commit |
| `npm run test:e2e` | Build, start on port 3200 and run the Playwright suite |
| `npm run assets` | Rebuild every image and brand asset from `source-assets/` |

## Environment

| Variable | Where | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | build time | Public origin, no trailing slash. Drives canonical URLs, Open Graph, JSON-LD, `sitemap.xml` and `robots.txt`. **Set it before `next build`** — `NEXT_PUBLIC_` values are inlined into the bundle. |
| `E2E_BASE_URL` | tests | Point the Playwright suite at a deployed site instead of a local build. |
| `E2E_PORT` | tests | Port for the local test server (default `3200`). |

There are no secrets in the project today. Any future payment or database
credentials are server-only and must never carry the `NEXT_PUBLIC_` prefix.

## Where things live

```
src/
  app/                 Routes (one folder per page), sitemap, robots, manifest, 404
  config/
    site.ts            Verified business facts — name, phone, address, map pin, hours, email, socials
    commerce.ts        Commerce mode ("enquiry" | "online") and the checkout switch
    navigation.ts      Every menu, footer and legal link
  content/
    catalogue.ts       Categories and pieces (validated by src/lib/commerce/schema.ts)
    media.ts           Every photograph: alt text, crop focus, kind, provenance note
    faq.ts, showroom.ts, product-info.ts   Page copy
  components/          animation/, home/, collection/, product/, forms/, page/, layout/, navigation/
  lib/
    commerce/          Catalogue schema + server-only queries
    enquiry-forms.ts   Contact and visit-request schemas and their WhatsApp messages
    whatsapp.ts        wa.me links and message builders
  stores/              Enquiry bag and saved pieces (browser localStorage)
source-assets/         Original photographs and logo — inputs to `npm run assets`
e2e/                   Playwright journeys and accessibility checks
legacy-prototype/      The earlier static prototype, kept for reference only
```

### Editing content

- **Business details** — `src/config/site.ts`. Fields that are `null` (hours,
  email) or empty (social links) stay off the site — opening hours fall back
  to "please call or message ahead" — until they hold verified values.
- **Pieces** — `src/content/catalogue.ts`. The schema rejects bad data at build
  time (unknown photo keys, broken "pairs well with" links). Setting
  `priceMinor` (in pesewas: `125000` → `GH₵ 1,250.00`), `sizes`, `fabric` or
  `care` on a piece makes the matching UI appear: price, size stock and
  materials, plus the price and size filters as soon as any piece has that data.
- **Photographs** — add the original to `source-assets/`, extend
  `scripts/build-brand-assets.mjs` if it needs a crop, run `npm run assets`,
  then register it in `src/content/media.ts` with alt text and a `kind`.
  A piece's hover image is its first `on-model` photo, else its second view.

### Pages

`/`, `/collections` (+ `/collections/{suits,blazers,shirts,trousers,occasionwear}`),
`/products/[slug]`, `/our-story`, `/the-showroom`, `/appointments`, `/contact`,
`/cart` (the enquiry bag), `/wishlist`, `/faq`, `/size-guide`,
`/shipping-returns`, `/privacy-policy`, `/terms-and-conditions`, and a branded
404. `/checkout` and `/order-success` deliberately do not exist yet.

### Forms

The contact form and the visit request validate in the browser, then open
WhatsApp with the message written out for the visitor to send. **Nothing is
stored or sent by the website**, and the visit request says plainly that a
visit is not booked until the showroom replies. The schemas in
`src/lib/enquiry-forms.ts` are ready to reuse in a server action if Digne later
wants submissions delivered by email or saved — see docs/COMMERCE.md.

## Testing

```bash
npm run check        # types + lint
npm run test:e2e     # builds, serves on :3200, runs every test on desktop and Pixel 7
E2E_BASE_URL=https://staging.example.com npx playwright test   # against a deployment
```

The suite (54 tests, 51 run, 3 skipped by design) covers the eight customer
journeys from the brief — home → collections → product, product → bag,
filtering, showroom directions, contact enquiry, mobile menu, saved pieces,
reduced motion — plus a check that a visit request never claims a booking.
It also runs axe (WCAG 2.2 AA rules) on 16 pages and checks keyboard paths:
the skip link, and quick view focus trapping and return. Any console error
fails a test. The HTML report lands in `playwright-report/`.

Locally, if something is already listening on port 3200 the suite uses it
instead of building — make sure it is a current production build, or set
`E2E_PORT`.

## Performance (last measured)

Production build, Pixel 7 profile, 4× CPU throttling, ~9 Mbps / 60 ms latency:

| Page | LCP | CLS |
| --- | --- | --- |
| Home, first visit (with brand intro) | ~2.2 s | 0 |
| Home, intro already seen this session | ~2.0 s | 0 |
| /collections | 0.55 s | 0 |
| Product page | 0.71 s | 0 |
| /the-showroom | 0.60 s | 0 |
| /contact | 0.53 s | 0 |

JavaScript is about 265 kB gzipped per page, of which about 150 kB is React and
the Next.js runtime, 46 kB GSAP and 17 kB Lenis. These are lab figures from
emulation, not field data — check real-user numbers in Search Console once
the site is live.

Two things to know when re-measuring the homepage:

- On phones the hero photo fills the viewport, and Chrome deliberately ignores
  viewport-filling images for LCP, so the hero copy is the LCP element. Its
  timing is set by the intro choreography (`Preloader.tsx`, `Hero.tsx`,
  `LATE_HYDRATION_MS` in `boot.ts`); lengthening those delays moves LCP.
- The brand intro plays once per browser session (`sessionStorage
  digne:intro`), never under reduced motion, and can be skipped with a click
  or any key.

## Deployment

Any Node.js host works (`npm run build` then `npm run start`), as do Docker or
Vercel. Static export is not suitable: product pages use partial prerendering.

1. Set `NEXT_PUBLIC_SITE_URL` to the final domain **before** building.
2. `npm ci && npm run build && npm run start` (port 3000 by default; set `PORT` to change it).
3. Put the server behind HTTPS. Security headers are set in `next.config.ts`.
4. Submit `https://<domain>/sitemap.xml` in Google Search Console and link the
   site from the Google Business profile.

Before launch, work through [docs/BUSINESS-INPUTS.md](docs/BUSINESS-INPUTS.md):
image permissions, opening hours, policies and a legal read of the privacy and
terms pages are all still open.

## Maintenance notes

- **Run `npm run check` after adding a page.** Routes are typed; `next typegen`
  regenerates the route types and links to a new page won't type-check until
  it has run. Use the `route()` helper in `src/lib/route.ts` for hrefs stored in data.
- **Stale styles in development.** Turbopack's dev cache has occasionally
  served an old `globals.css` or component after edits. Stop the dev server,
  delete `.next`, and restart. Verify anything important against a production
  build (`npm run build && npm run start`) rather than the dev server.
- **Production builds skip Turbopack's persistent cache**
  (`turbopackFileSystemCacheForBuild: false` in `next.config.ts`): a warm build
  once shipped a stale stylesheet. Cold builds take seconds here.
- **Motion rules.** Reveal animations change opacity only — never
  `visibility` — so content stays in the accessibility tree while it waits to
  appear. Intro text starts at ≥ 0.58 opacity where it must stay legible
  (WCAG contrast). Everything has a reduced-motion path; keep it that way.
- **Honesty rules.** Don't add prices, stock, fabric, reviews, ratings,
  awards, dates or social links that Digne hasn't confirmed. The schema and UI
  are built to hide what is missing rather than fill it.
