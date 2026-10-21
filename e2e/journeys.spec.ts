import { expect, followHeroLink, hydrated, openedUrls, PHONE_E164, test, WHATSAPP, whatsappText } from "./fixtures";

/** The customer journeys from the brief (section 25). */

test("1 · Home → Collections → Product", async ({ page }) => {
  await page.goto("/");
  await hydrated(page);
  await followHeroLink(page.getByRole("link", { name: /explore collections/i }).first());
  await expect(page).toHaveURL(/\/collections$/);
  await expect(page.getByRole("heading", { level: 1, name: /the collections/i })).toBeVisible();

  const first = page.locator("article.piece-card").first();
  const name = (await first.getByRole("heading").textContent())?.trim() ?? "";
  await first.getByRole("link").first().click();
  await expect(page).toHaveURL(/\/products\/[a-z0-9-]+$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(name);
  await expect(page.getByRole("button", { name: /add to enquiry bag/i })).toBeVisible();
});

test("2 · Product → Cart", async ({ page }) => {
  await page.goto("/products/royal-blue-blazer");
  await hydrated(page);
  await page.getByRole("radio", { name: "52" }).check({ force: true });
  await page.getByRole("button", { name: /add to enquiry bag/i }).click();

  const drawer = page.getByRole("dialog", { name: /enquiry bag/i });
  await expect(drawer).toBeVisible();
  await expect(drawer.getByRole("link", { name: "Royal Blue Blazer" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Enquiry bag, 1 item" })).toBeAttached();

  await drawer.getByRole("link", { name: /view bag/i }).click();
  await expect(page).toHaveURL(/\/cart$/);
  const main = page.getByRole("main");
  await expect(main.getByRole("link", { name: "Royal Blue Blazer" })).toBeVisible();
  await expect(main).toContainText("Royal blue · Size 52");

  // The bag ends in a WhatsApp enquiry — never a payment.
  const send = main.getByRole("link", { name: /send enquiry on whatsapp/i });
  const href = (await send.getAttribute("href")) ?? "";
  expect(href.startsWith(WHATSAPP)).toBe(true);
  expect(whatsappText(href)).toContain("Royal Blue Blazer (colour: Royal blue, size: 52)");
  await expect(main.getByText(/online checkout isn’t available yet/i)).toBeVisible();
  await expect(page.getByRole("button", { name: /pay|checkout/i })).toHaveCount(0);
});

test("3 · Collections → Filter → Product", async ({ page }) => {
  await page.goto("/collections");
  await hydrated(page);
  await page.getByRole("button", { name: /^filter/i }).click();
  const filters = page.getByRole("dialog", { name: "Filter" });
  await expect(filters).toBeVisible();
  // The checkbox follows the URL, so assert on the URL rather than the click.
  await filters.locator("label", { hasText: "Burgundy" }).click();
  await expect(page).toHaveURL(/colour=Burgundy/);
  await expect(filters.getByRole("checkbox", { name: "Burgundy" })).toBeChecked();
  await filters.getByRole("button", { name: /^show \d+$/i }).click();
  await expect(filters).toBeHidden();

  const cards = page.locator("article.piece-card");
  const count = await cards.count();
  expect(count).toBeGreaterThan(0);
  await expect(page.getByRole("button", { name: /burgundy.*remove filter/i })).toBeVisible();

  await cards.first().getByRole("link").first().click();
  await expect(page).toHaveURL(/\/products\//);
  await expect(page.getByText("Burgundy").first()).toBeVisible();
});

test("4 · Home → Showroom → Directions", async ({ page }) => {
  await page.goto("/");
  await hydrated(page);
  await followHeroLink(page.getByRole("link", { name: /visit our showroom/i }));
  await expect(page).toHaveURL(/\/the-showroom$/);
  await expect(page.getByRole("heading", { level: 1, name: /the showroom/i })).toBeVisible();

  const directions = page.getByRole("link", { name: /get directions/i }).first();
  await expect(directions).toHaveAttribute("href", /^https:\/\/www\.google\.com\/maps\/place\/Digne\+Suits\+and\+more/);
  await expect(directions).toHaveAttribute("target", "_blank");
  await expect(directions).toHaveAttribute("rel", /noopener/);
  await expect(page.locator(`main a[href="tel:${PHONE_E164}"]`).first()).toBeVisible();

  // The map embed waits for consent: no Google frame until asked.
  await expect(page.locator('iframe[src*="google"]')).toHaveCount(0);
  await page.getByRole("button", { name: /show the map/i }).click();
  await expect(page.locator('iframe[src*="maps.google.com"]')).toHaveCount(1);
});

test("5 · Home → Contact → Enquiry", async ({ page }) => {
  await page.goto("/");
  await hydrated(page);
  await page.getByRole("contentinfo").getByRole("link", { name: "Contact" }).click();
  await expect(page).toHaveURL(/\/contact$/);

  const submit = page.getByRole("button", { name: /continue in whatsapp/i });
  await submit.click();
  await expect(page.getByText("Please tell us your name.")).toBeVisible();
  await expect(page.getByLabel("Your name", { exact: true })).toBeFocused();
  expect(await openedUrls(page)).toHaveLength(0);

  await page.getByLabel("Your name", { exact: true }).fill("Ama Owusu");
  await page.getByLabel("About", { exact: true }).selectOption("Dressing for an occasion");
  await page.getByLabel("Message", { exact: true }).fill("I need a burgundy suit for a wedding in December.");
  await submit.click();

  const [href] = await openedUrls(page);
  expect(href.startsWith(WHATSAPP)).toBe(true);
  const text = whatsappText(href);
  expect(text).toContain("Name: Ama Owusu");
  expect(text).toContain("I need a burgundy suit for a wedding in December.");
  await expect(page.getByRole("status").getByText("Your message is waiting to be sent.")).toBeVisible();
});

test("5b · Visit request never claims a booking", async ({ page }) => {
  await page.goto("/appointments");
  await hydrated(page);
  await page.getByLabel("Your name", { exact: true }).fill("Ama Owusu");
  const date = new Date(Date.now() + 3 * 864e5);
  const iso = new Date(date.getTime() - date.getTimezoneOffset() * 6e4).toISOString().slice(0, 10);
  await page.getByLabel("Preferred date", { exact: true }).fill(iso);
  await page.getByRole("radio", { name: "Morning" }).check({ force: true });
  await page.getByRole("radio", { name: "A wedding" }).check({ force: true });
  await page.getByRole("radio", { name: "Two of us" }).check({ force: true });
  await page.getByRole("button", { name: /send request on whatsapp/i }).click();

  const [href] = await openedUrls(page);
  expect(whatsappText(href)).toContain("request a visit");
  const status = page.getByRole("status").filter({ hasText: "Ready in WhatsApp" });
  await expect(status).toContainText("Your visit isn’t booked yet.");
  await expect(status).not.toContainText(/confirmed!|is booked|booking confirmed/i);
});

test("6 · Mobile menu → page navigation", async ({ page, isMobile }) => {
  test.skip(!isMobile, "The full-screen menu is the primary navigation on phones.");
  await page.goto("/");
  await hydrated(page);
  await page.getByRole("button", { name: "Menu" }).first().click();
  const menu = page.getByRole("dialog", { name: "Site menu" });
  await expect(menu).toBeVisible();
  await menu.getByRole("link", { name: /our story/i }).click();
  await expect(page).toHaveURL(/\/our-story$/);
  await expect(page.getByRole("heading", { level: 1, name: /our story/i })).toBeVisible();
  await expect(menu).toBeHidden();

  // Escape closes it again.
  await page.getByRole("button", { name: "Menu" }).first().click();
  await expect(menu).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
});

test("7 · Wishlist → saved product", async ({ page }) => {
  await page.goto("/products/pearl-shoulder-evening-blazer");
  await hydrated(page);
  await page.getByRole("button", { name: /^save piece$/i }).click();
  await expect(page.getByRole("link", { name: "Saved pieces, 1 saved" })).toBeAttached();

  await page.goto("/wishlist");
  const card = page.locator("article.piece-card", { hasText: "Pearl-Shoulder Evening Blazer" });
  await expect(card).toBeVisible();
  await page.reload();
  await expect(card).toBeVisible();

  await card.getByRole("link").first().click();
  await expect(page).toHaveURL(/\/products\/pearl-shoulder-evening-blazer$/);
  await expect(page.getByRole("button", { name: /^saved$/i })).toHaveAttribute("aria-pressed", "true");
});

test.describe("8 · Reduced motion → homepage", () => {
  test.use({ reducedMotion: "reduce" });

  test("content is visible at once and nothing moves on its own", async ({ page }) => {
    await page.addInitScript(() => sessionStorage.removeItem("digne:intro"));
    await page.goto("/");
    await hydrated(page);
    await expect(page.locator(".preloader")).toBeHidden();
    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toBeVisible();
    await expect(h1).toHaveCSS("opacity", "1");
    // The slideshow waits for the visitor.
    await expect(page.getByRole("button", { name: "Play slideshow" })).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("data-motion", "reduce");
  });
});
