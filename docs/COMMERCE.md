# Commerce: enquiry mode today, online checkout later

## How it works today

The site runs in **enquiry mode** (`src/config/commerce.ts`):

```ts
export const commerce = { mode: "enquiry", currency: "GHS", checkoutEnabled: false };
```

- Visitors save pieces (`/wishlist`) and add them to an **enquiry bag**
  (`/cart`), choosing a colour and a preferred size. Both live in the
  visitor's browser storage (`digne:bag`, `digne:wishlist`). Nothing reaches a
  server.
- The bag ends in **"Send enquiry on WhatsApp"**, which opens `wa.me/233535046945`
  with every piece, colour, size and quantity written out, or in a call.
  The bag says plainly that nothing is reserved or charged and that the
  showroom confirms availability, sizes and prices.
- No price is shown unless a piece has a verified `priceMinor`; until then it
  reads "Price on request". Sizes are a **preference scale**, not stock, until a
  piece has verified `sizes`.
- There is no `/checkout` or `/order-success` route, no payment form and no
  simulated payment step. That is deliberate: the brief forbids a flow that
  looks like a real payment before one exists.

The contact form and the visit request work the same way: they validate, then
hand the message to WhatsApp. The site stores and sends nothing.

## Before switching on online sales

Business inputs first (tracked in [BUSINESS-INPUTS.md](BUSINESS-INPUTS.md)):

1. Real products with verified prices, sizes and stock, and someone who keeps them current.
2. Delivery and/or in-store collection terms, delivery fees, and an exchange and returns policy.
3. A merchant account with a payment provider that settles in GHS. Paystack
   and Flutterwave both support cards and mobile money in Ghana; the choice is
   Digne's.
4. Terms of sale reviewed by a lawyer, and an updated privacy policy (orders
   mean storing names, phone numbers and addresses).

## Target architecture

The rule throughout: **the browser never decides what anything costs or whether it was paid.**

```
Bag (browser)  ──slug, colour, size, qty──▶  Server: create order
                                               • re-read price + stock from the catalogue/DB
                                               • total in pesewas, status = "pending"
                                               • unique reference, idempotency key
                                               • initialise payment with the SECRET key
               ◀──── provider checkout URL ───┘
Provider checkout  ──redirect──▶ /order-success?reference=…   (shows "confirming…", reads status from DB)
Provider  ──signed webhook──▶ /api/payments/webhook
                                               • verify signature on the raw body
                                               • re-verify the transaction with the provider API
                                               • check amount + currency match the order
                                               • pending → paid exactly once; decrement stock
                                               • notify the showroom
```

### 1. Product data

Keep `src/content/catalogue.ts` for a small, slowly changing range: set
`source: "product"`, `priceMinor`, `sizes` (with `available`), `availability`,
and `fabric`/`care` where Digne supplies them. If stock changes daily, move
pieces to a database or headless CMS and keep `src/lib/commerce/catalogue.ts`
as the single read path. Its functions are already server-only, and
`PieceSummary` is the only shape sent to the browser.

### 2. Creating an order (server only)

A Server Action or Route Handler receives only `{ slug, colour, size, quantity }[]`
plus an idempotency key generated when the checkout page loads. It:

- validates the payload with Zod (the bag's `MAX_QUANTITY` is 10);
- looks up each piece, rejects unknown, unpriced or out-of-stock lines, and
  computes the total in pesewas on the server;
- inserts an order (`status: "pending"`, lines snapshotted with their prices,
  a unique `reference`). If an order with that idempotency key already
  exists, it returns that order instead of creating a second;
- initialises the payment with the provider's secret key and returns the
  provider's checkout URL.

Secret keys stay in server environment variables (`PAYSTACK_SECRET_KEY`, never
`NEXT_PUBLIC_…`). The publishable key is only needed if you embed the
provider's inline widget.

### 3. The return page is not proof of payment

`/order-success?reference=…` only shows the order's status as stored on the
server, with a "We're confirming your payment" state while it is `pending`. It
may ask the provider's verify endpoint, from the server, to speed things up. It
must never mark an order paid because the browser arrived at that URL.

### 4. Webhook: verified, then idempotent

A sketch for Paystack. Check the provider's current documentation before
relying on header names or event shapes.

```ts
// src/app/api/payments/webhook/route.ts
import { createHmac, timingSafeEqual } from "node:crypto";

export async function POST(request: Request) {
  const raw = await request.text(); // the raw body — the signature is over these exact bytes
  const signature = request.headers.get("x-paystack-signature") ?? "";
  const expected = createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!).update(raw).digest("hex");
  const valid = signature.length === expected.length && timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  if (!valid) return new Response("Invalid signature", { status: 401 });

  const event = JSON.parse(raw);
  if (event.event === "charge.success") {
    // In one transaction: re-verify the reference with the provider's API,
    // confirm amount + currency equal the stored order, then
    //   UPDATE orders SET status = 'paid' WHERE reference = $1 AND status = 'pending'
    // and decrement stock only if that update changed a row. Record the event
    // id so a redelivered webhook is a no-op.
    await settleOrder(event.data.reference);
  }
  return new Response(null, { status: 200 });
}
```

Providers retry webhooks, so the same event will sometimes arrive twice. The
conditional update makes the second delivery harmless.

### 5. Switching the UI over

1. Add `/checkout` (with `robots: { index: false }`) and `/order-success`.
   Keep both out of `src/app/sitemap.ts`.
2. Set `commerce.mode = "online"`. Labels change from "Enquiry bag" to "Bag" and
   the enquiry-only notes disappear (`BagView`, `BagDrawer`, `PieceOptions`).
3. Add the checkout button to `BagView` behind `commerce.checkoutEnabled`.
   Flip it to `true` only after a full run in the provider's **test mode**:
   success, failure, abandoned payment, duplicate webhook and amount mismatch.
4. Add a Content-Security-Policy that allows the provider's domains
   (`node_modules/next/dist/docs/01-app/02-guides/content-security-policy.md`).
5. Extend `e2e/` with a test-mode checkout journey, and unit-test the
   signature check and the idempotent settle.
6. Update the shipping & returns, terms and privacy pages.

## Delivering form submissions (optional, independent of payments)

If Digne wants contact and visit requests by email or in a database instead
of (or as well as) WhatsApp:

- Reuse `contactSchema` / `visitSchema` and the message builders from
  `src/lib/enquiry-forms.ts` in a Server Action, and validate again on the server.
- Add spam protection (a honeypot field plus rate limiting by IP) and send via
  a transactional email provider whose key stays server-side.
- Keep the honest copy. A visit request is still **not** a booking until the
  showroom confirms it. Update the privacy policy with what is stored and for
  how long.
