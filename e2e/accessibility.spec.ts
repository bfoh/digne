import AxeBuilder from "@axe-core/playwright";

import { expect, hydrated, test } from "./fixtures";

/** Automated WCAG 2.2 A/AA checks. They catch a large share of issues, not all — keyboard and screen-reader passes are still needed. */
const PAGES = [
  "/",
  "/collections",
  "/collections/blazers",
  "/products/burgundy-waistcoat-ensemble",
  "/our-story",
  "/the-showroom",
  "/contact",
  "/appointments",
  "/cart",
  "/wishlist",
  "/faq",
  "/size-guide",
  "/shipping-returns",
  "/privacy-policy",
  "/terms-and-conditions",
  "/no-such-page",
];

for (const path of PAGES) {
  test.describe(() => {
    // The not-found page is served with a 404 status, which the browser logs.
    if (path === "/no-such-page") test.use({ allowedConsoleErrors: [/status of 404/] });

    test(`axe: ${path}`, async ({ page }) => {
      await page.goto(path);
      await hydrated(page);
      // Let entrance animations settle so colour contrast is measured on final states.
      await page.waitForTimeout(2500);
      const { violations } = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
      const summary = violations.map((v) => `${v.impact} ${v.id}: ${v.help} — ${v.nodes.slice(0, 3).map((n) => n.target.join(" ")).join(" | ")}`);
      expect(summary).toEqual([]);
    });
  });
}

test("keyboard: skip link moves focus to the main content", async ({ page, isMobile }) => {
  test.skip(isMobile, "Keyboard journey runs on desktop.");
  await page.goto("/");
  await hydrated(page);
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: /skip to (main )?content/i });
  await expect(skip).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main")).toBeFocused();
});

test("keyboard: quick view traps focus and returns it", async ({ page, isMobile }) => {
  test.skip(isMobile, "Quick view opens from the card's + on desktop.");
  await page.goto("/collections");
  await hydrated(page);
  const trigger = page.getByRole("button", { name: /^quick view: /i }).first();
  await trigger.focus();
  await page.keyboard.press("Enter");
  const dialog = page.locator("dialog#quick-view");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("button", { name: /close/i })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});
