# What we still need from Digne

The site was built without guessing at facts. Wherever something wasn't
confirmed, it is left out, worded neutrally, or marked `TODO(business)` in the
code. This list is everything that needs a decision or real information from
Digne. Each item says where it goes and what the site does in the meantime.

**Before launch** items block going live. **Before online sales** items only
matter once Digne wants to sell online (see [COMMERCE.md](COMMERCE.md)).

## Before launch

### Photographs and logo

| Need | Why | Today |
| --- | --- | --- |
| **Permission to publish every photograph** | All nine store photographs were taken from Google Maps screenshots. Photos on a Google Business profile are often uploaded by customers or other contributors, who own them. Digne needs to confirm it owns each one or has the owner's permission. | Used throughout the site. Replace any photo without permission before launch. |
| **Sign-off on the AI-enhanced images** | The screenshots were AI-enhanced to remove map overlays, which can alter garment, signage or interior details. Digne should confirm each image fairly represents the showroom. | Used for atmosphere. The FAQ and terms say the images are digitally enhanced and that colour and detail may differ. |
| **The third-party label on the black safari jacket photo** (`charcoal` in `src/content/media.ts`) | The hang tag shows another brand's label. Confirm Digne may show it, or retouch or replace the photo. | Flagged in the media registry. |
| **The master logo file** (SVG, AI or PDF) | The logo on the site is an AI-assisted reconstruction from a photo of the signage, not the original artwork. | Reconstructed emblem and wordmark. Swap in the master with `npm run assets`. |

### Business details (`src/config/site.ts`)

| Need | Today |
| --- | --- |
| **Opening hours**, by day | Hidden. Pages say "Please call or message ahead to confirm today's hours." When they arrive, also add `openingHoursSpecification` to the store structured data in `src/lib/seo.ts`. |
| **Email address** for enquiries | Hidden. Contact is by phone and WhatsApp. |
| **Social media accounts** (only real, owned ones) | Hidden. No social links anywhere. |
| **Legal business name** and registration details, for the privacy and terms pages | Pages use the trading name "Digne Suits & More". |
| **Domain name** | Set as `NEXT_PUBLIC_SITE_URL` before building. |
| Confirm the **phone/WhatsApp number** 053 504 6945 and the **map pin** | Taken from a promotional photo and the Google Business profile. |

### Words that need approval

| Need | Where | Today |
| --- | --- | --- |
| **The founder's story**: when the showroom opened, who runs it, what "Digne" means | `/our-story` (`src/app/our-story/page.tsx`) | The page describes only what can be seen and done in the showroom. No dates, people or claims. |
| **Approval of the proposed brand lines**: "The Art of Dressing Well." and "Style is not only what you wear. It is how you arrive." | `src/config/site.ts`, `src/components/home/Statement.tsx` | Written for the site. Not an existing company slogan. |
| **The nine catalogue entries** (Burgundy Waistcoat Ensemble, Black Safari Jacket, Pearl-Shoulder Evening Blazer, Royal Blue Blazer, Grey Check Blazer, Burgundy Blazer, Two-Piece Suits, Dress Shirts, Tailored Trousers) | `src/content/catalogue.ts` | Editorial descriptions of what is visible in the photos. Names and visible details only: no prices, fabric, stock or care. Confirm they represent what Digne actually carries, and rename or remove any that don't. |
| **Size labels Digne uses** (jackets 46–58 EU? shirts S–XXL? waist 30–40 in?) | `JACKET_SIZES`, `SHIRT_SIZES`, `WAIST_SIZES` in `src/content/catalogue.ts`, and `/size-guide` | Offered as *preferences*. Visitors are told the showroom confirms fit and availability. |

### Policies and legal

| Need | Where | Today |
| --- | --- | --- |
| **Collection, delivery and exchange/returns policy** | `/shipping-returns`, the product page accordion (`src/content/product-info.ts`) | Says buying happens in the showroom, nothing is paid online, and to ask about delivery and exchanges before buying. |
| **Legal review of the privacy policy** | `/privacy-policy` | Describes what the site actually does: browser storage only, no cookies of its own, no analytics, enquiries go through WhatsApp. It refers to Ghana's Data Protection Act, 2012 (Act 843). Confirm whether Digne must register with the Data Protection Commission, and how long it keeps WhatsApp enquiries. |
| **Legal review of the terms of use** | `/terms-and-conditions` | Plain-language terms for an enquiry-only catalogue. No contract of sale. |

## Before online sales

| Need | Notes |
| --- | --- |
| **Real prices** per piece | Set `priceMinor` in pesewas (`125000` → `GH₵ 1,250.00`). Prices and price filters appear automatically. |
| **Real sizes and stock**, plus who keeps them current | Set `sizes` with `available`, and `availability`. Size filters and stock states appear automatically. |
| **Fabric composition and care** from the garment labels | Set `fabric` / `care`. Never inferred from photos. |
| **A payment provider merchant account** (e.g. Paystack or Flutterwave, settling in GHS) | Keys are server-side only. See COMMERCE.md. |
| **Delivery areas and fees**, and **terms of sale** | Needed for checkout and the legal pages. |

## Photography that would lift the site

Not blocking, but it would make the biggest visual difference:

- **Higher-resolution originals.** The full photographs are 1122–1448 px wide.
  The single-piece close-ups were cropped from them and are only 376–561 px
  wide, so they soften on large or high-density screens. Originals from a
  camera or recent phone at 3000 px or more would fix that.
- **Clean product shots** (packshots) of each piece on a plain background.
- **On-model photographs.** Product cards already switch to an on-model view
  on hover, as on the reference site. Today they use a second close-up instead,
  because no on-model photos exist. Register a photo with `kind: "on-model"` in
  `src/content/media.ts` and it is used automatically.
  - Real models need their written consent.
  - AI-generated models must be disclosed as such, and must never be presented
    as Digne customers or as exact stocked products.
