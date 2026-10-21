import { test as base, expect, type Locator, type Page } from "@playwright/test";

export const PHONE_E164 = "+233535046945";
export const WHATSAPP = "https://wa.me/233535046945";

/** Decodes the prefilled text of a wa.me link. */
export const whatsappText = (href: string) => new URL(href).searchParams.get("text") ?? "";

/**
 * Every test starts with the brand intro already seen (so the preloader doesn't
 * delay journeys) and with window.open captured, so WhatsApp hand-offs can be
 * asserted without leaving the page. Console errors fail the test.
 */
export const test = base.extend<{ consoleErrors: string[]; allowedConsoleErrors: RegExp[] }>({
  /** Console errors a test expects, e.g. the 404 response on the not-found page. */
  allowedConsoleErrors: [[], { option: true }],
  consoleErrors: [
    async ({ page, allowedConsoleErrors }, use) => {
      const errors: string[] = [];
      page.on("console", (m) => {
        if (m.type() === "error" && !allowedConsoleErrors.some((re) => re.test(m.text()))) errors.push(m.text());
      });
      page.on("pageerror", (e) => errors.push(e.message));
      await use(errors);
      expect(errors, "console errors").toEqual([]);
    },
    { auto: true },
  ],
  page: async ({ page }, use) => {
    await page.addInitScript(() => {
      sessionStorage.setItem("digne:intro", "1");
      const w = window as Window & { __opened?: string[] };
      w.__opened = [];
      window.open = (url?: string | URL) => {
        w.__opened!.push(String(url));
        return { opener: null } as Window;
      };
    });
    await use(page);
  },
});

export { expect };

export async function openedUrls(page: Page): Promise<string[]> {
  return page.evaluate(() => (window as Window & { __opened?: string[] }).__opened ?? []);
}

/** Waits for client hydration: the header's bag label gains its count once hydrated. */
export async function hydrated(page: Page) {
  await expect(page.getByRole("button", { name: /^Enquiry bag, \d+ items?$/ })).toBeAttached();
}

/**
 * Follows a link in the sticky homepage hero. Before a pointer click,
 * Playwright scrolls the target "into view"; under load that has scrolled the
 * page beneath the section that slides over the hero, so the click landed on
 * that section. A real tap doesn't scroll, and neither does keyboard focus.
 */
export async function followHeroLink(link: Locator) {
  await link.focus();
  await link.press("Enter");
}
