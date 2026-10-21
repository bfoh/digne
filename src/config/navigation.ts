import type { Route } from "next";

import type { MediaKey } from "@/content/media";
import { route } from "@/lib/route";

export interface NavItem {
  label: string;
  href: Route;
}

export interface FeatureNavItem extends NavItem {
  index: string;
  media: MediaKey;
  note: string;
}

/** Full-screen menu. With typedRoutes on, a link to a missing page fails type-checking. */
export const menuNav: FeatureNavItem[] = [
  { index: "01", label: "Collections", href: route("/collections"), media: "suitWall", note: "Suits, blazers, shirts, trousers & occasionwear" },
  { index: "02", label: "Our Story", href: route("/our-story"), media: "reception", note: "The world of Digne" },
  { index: "03", label: "The Showroom", href: route("/the-showroom"), media: "showroom", note: "Agbogba, Accra" },
  { index: "04", label: "Contact", href: route("/contact"), media: "boutique", note: "Call, message or visit" },
];

export const headerNav: NavItem[] = [
  { label: "Collections", href: route("/collections") },
  { label: "Our Story", href: route("/our-story") },
  { label: "Showroom", href: route("/the-showroom") },
  { label: "Contact", href: route("/contact") },
];

export interface CollectionNavItem extends NavItem {
  /** Thumbnail for the phone menu — the category's cover in src/content/catalogue.ts. */
  thumb: { key: MediaKey; focus?: string };
}

export const collectionNav: CollectionNavItem[] = [
  { label: "Suits", href: route("/collections/suits"), thumb: { key: "suitWall" } },
  { label: "Blazers", href: route("/collections/blazers"), thumb: { key: "maroonCheck" } },
  { label: "Shirts", href: route("/collections/shirts"), thumb: { key: "reception", focus: "88% 30%" } },
  { label: "Trousers", href: route("/collections/trousers"), thumb: { key: "boutique", focus: "64% 70%" } },
  { label: "Occasionwear", href: route("/collections/occasionwear"), thumb: { key: "embellished" } },
];

export const serviceNav: NavItem[] = [
  { label: "Request a visit", href: route("/appointments") },
  { label: "Contact", href: route("/contact") },
  { label: "Saved pieces", href: route("/wishlist") },
  { label: "Enquiry bag", href: route("/cart") },
];

export const clientCareNav: NavItem[] = [
  { label: "Request a visit", href: route("/appointments") },
  { label: "Contact", href: route("/contact") },
  { label: "Questions", href: route("/faq") },
  { label: "Size guide", href: route("/size-guide") },
  { label: "Delivery & returns", href: route("/shipping-returns") },
];

export const legalNav: NavItem[] = [
  { label: "Privacy", href: route("/privacy-policy") },
  { label: "Terms", href: route("/terms-and-conditions") },
];
