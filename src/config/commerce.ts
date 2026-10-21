/**
 * Commerce mode.
 *
 * "enquiry" — catalogue mode. Pieces can be saved and gathered into an enquiry
 * bag, then sent to the showroom by WhatsApp or phone. No prices are shown
 * unless the catalogue provides them, and no payment is taken.
 *
 * "online" — requires verified prices and stock in the catalogue AND a payment
 * provider configured server-side (see docs/COMMERCE.md). Until both exist,
 * keep this on "enquiry".
 */
export type CommerceMode = "enquiry" | "online";

export const commerce = {
  mode: "enquiry" as CommerceMode,
  currency: "GHS" as const,
  /** Server-side payment integration status. Flip only after Paystack/Flutterwave is wired and tested. */
  checkoutEnabled: false,
};

export const isEnquiryMode = commerce.mode === "enquiry";
