const cedis = new Intl.NumberFormat("en-GH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** `125000` pesewas → `GH₵ 1,250.00` */
export function formatCedis(minor: number): string {
  return `GH₵ ${cedis.format(minor / 100)}`;
}

export function formatPrice(minor: number | null): string {
  return minor === null ? "Price on request" : formatCedis(minor);
}

/** Two-digit editorial index: 1 → "01". */
export function pad2(n: number): string {
  return String(n).padStart(2, "0");
}
