import type { Piece } from "@/lib/commerce/schema";

export type InfoIcon = "materials" | "care" | "fit" | "collection" | "exchanges";

export interface InfoSection {
  id: InfoIcon;
  title: string;
  body: string;
}

/**
 * The accordion beneath every product. Verified piece data (fabric, care) is
 * used when Digne supplies it; otherwise the copy says plainly what happens in
 * store. TODO(business): replace the collection/delivery and exchange copy
 * with Digne's actual policies (docs/BUSINESS-INPUTS.md).
 */
export function productInfo(piece: Pick<Piece, "fabric" | "care">): InfoSection[] {
  return [
    {
      id: "materials",
      title: "Materials",
      body: piece.fabric ?? "Fabric composition is confirmed from the garment’s label in store. Ask before you buy and the showroom will check it for you.",
    },
    {
      id: "care",
      title: "Care guide",
      body: piece.care ?? "Follow the care label sewn into the garment. If you’re unsure, ask the showroom before cleaning.",
    },
    {
      id: "fit",
      title: "Fit & sizing",
      body: "Sizes and fit are confirmed in person — the surest way to choose is to try the piece on at the showroom in Agbogba.",
    },
    {
      id: "collection",
      title: "Collection & delivery",
      body: "Online ordering isn’t open yet. Send an enquiry and the showroom will advise how you can receive your pieces.",
    },
    {
      id: "exchanges",
      title: "Exchanges & returns",
      body: "Please confirm the showroom’s exchange and returns policy before you buy.",
    },
  ];
}
