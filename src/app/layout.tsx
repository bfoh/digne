import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";

import { EditorialCursor } from "@/components/animation/EditorialCursor";
import { Preloader } from "@/components/animation/Preloader";
import { ScrollProgress } from "@/components/animation/ScrollProgress";
import { SmoothScroll } from "@/components/animation/SmoothScroll";
import { Announcer } from "@/components/layout/Announcer";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { MenuOverlay } from "@/components/navigation/MenuOverlay";
import { BagDrawer } from "@/components/product/BagDrawer";
import { QuickView } from "@/components/product/QuickView";
import { site } from "@/config/site";
import { getPieces, summarise } from "@/lib/commerce/catalogue";

import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const sans = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Digne Suits & More | Suits & Formalwear in Accra, Ghana",
    template: "%s | Digne Suits & More",
  },
  description: site.description,
  applicationName: site.name,
  formatDetection: { telephone: false, address: false, email: false },
  openGraph: {
    type: "website",
    locale: site.locale,
    siteName: site.name,
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#120a0b",
  colorScheme: "light",
};

/**
 * Runs before first paint: records whether motion is allowed and whether the
 * brand intro has already played this session, so CSS can show the right
 * state immediately (no flash, no hydration mismatch).
 */
const bootScript = `(function(){var d=document.documentElement;try{d.dataset.motion=matchMedia("(prefers-reduced-motion: reduce)").matches?"reduce":"full";if(sessionStorage.getItem("digne:intro"))d.dataset.introSeen=""}catch(e){}})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  const pieces = getPieces().map(summarise);
  return (
    <html lang="en-GH" className={`${display.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        <a href="#main" className="skip-link eyebrow">
          Skip to content
        </a>
        <Preloader />
        <SiteHeader />
        <MenuOverlay />
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <SiteFooter />
        <QuickView />
        <BagDrawer pieces={pieces} />
        <ScrollProgress />
        <EditorialCursor />
        <Announcer />
        <SmoothScroll />
      </body>
    </html>
  );
}
