import { expect, test } from "@playwright/test";
import { hydrated, openCommandPalette } from "./helpers";

// Give each test its own client bucket so the in-memory rate limiter never
// interferes with a rerun or a parallel test.
test.beforeEach(async ({ page }) => {
  const suffix = Math.floor(Math.random() * 200) + 1;
  await page.setExtraHTTPHeaders({ "x-forwarded-for": `203.0.113.${suffix}` });
});

test("home loads with the real workshop details and no console errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });

  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/Tyres for\s*Harare roads/);
  await expect(page.getByText("20 McChlery Road, Eastlea, Harare").first()).toBeVisible();
  await expect(page.getByRole("link", { name: "Get directions" }).first()).toHaveAttribute(
    "href",
    /google\.com\/maps\/search/,
  );

  await page.waitForLoadState("networkidle");
  expect(errors).toEqual([]);

  for (const width of [390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(overflow, `horizontal overflow at ${width}px`).toBe(0);
  }
});

test("tyre filters, view switch and deep links keep working", async ({ page }) => {
  await page.goto("/tyres");
  await hydrated(page);
  await expect(page.getByRole("heading", { level: 1, name: "Tyre catalogue" })).toBeVisible();

  const sizeSelect = page.locator("#inventory-size");
  const firstSize = await sizeSelect.locator("option").nth(1).getAttribute("value");
  expect(firstSize).toBeTruthy();
  await sizeSelect.selectOption(firstSize ?? "");
  await expect(page.locator(".tyre-card").first()).toBeVisible();

  await page.getByRole("button", { name: "List" }).click();
  await expect(page.locator("table.data-table")).toBeVisible();
  await page.getByRole("button", { name: "Grid" }).click();
  await expect(page.locator(".tyre-card-grid")).toBeVisible();

  await page.goto(`/tyres?size=${encodeURIComponent(firstSize ?? "")}`);
  await expect(page.locator("#inventory-size")).toHaveValue(firstSize ?? "");
  await expect(page.locator(".tyre-card").first()).toBeVisible();
});

test("booking wizard validates and submits with a WhatsApp confirmation", async ({ page }) => {
  await page.goto("/book");
  await hydrated(page);

  // Continue past the default service, then check validation on vehicle details.
  await page.getByRole("button", { name: /Continue/ }).click();
  await page.getByRole("button", { name: /Continue/ }).click();
  await expect(page.locator("#book-vehicle-error")).toHaveText("Add the vehicle, between 2 and 80 characters.");

  await page.locator("#book-vehicle").fill("2018 Toyota RAV4");
  await page.locator("#book-reg").fill("ABC 1234");
  await page.getByRole("button", { name: /Continue/ }).click();

  await page.locator(".booking-days button:not([disabled])").first().click();
  await page.locator(".slot-grid button:not([disabled])").first().click();
  await page.getByRole("button", { name: /Continue/ }).click();

  await page.locator("#book-name").fill("Test Customer");
  await page.locator("#book-phone").fill("0773 646 6184");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Confirm booking" }).click();

  await expect(page.getByRole("heading", { name: "Booking saved" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Confirm on WhatsApp" })).toHaveAttribute(
    "href",
    /https:\/\/wa\.me\/2637736466184\?text=.*TS-B/,
  );
});

test("quote can be added and submitted with indicative copy", async ({ page }) => {
  await page.goto("/tyres");
  await hydrated(page);
  await page.getByRole("button", { name: "Add to quote" }).first().click();

  await page.getByRole("button", { name: /Review quote/ }).click();
  await expect(page.getByRole("dialog", { name: "Quote" })).toBeVisible();
  await expect(page.getByText("Prices are indicative.", { exact: false }).first()).toBeVisible();

  await page.locator("#quote-name").fill("Test Customer");
  await page.locator("#quote-phone").fill("0773 646 6184");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Send quote request" }).click();

  await expect(page.getByRole("heading", { name: "Quote saved" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Confirm on WhatsApp" })).toHaveAttribute(
    "href",
    /https:\/\/wa\.me\/2637736466184\?text=.*TS-Q/,
  );
});

test("command palette opens, filters and closes", async ({ page }) => {
  await page.goto("/");
  const palette = await openCommandPalette(page);
  await page.getByRole("textbox", { name: "Search size, service or SKU" }).fill("alignment");
  await expect(palette.getByRole("option").first()).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(palette).toBeHidden();
});

test("mobile menu opens, closes and returns focus", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await hydrated(page);

  const menuButton = page.getByRole("button", { name: "Open menu" });
  await expect(menuButton).toBeVisible();
  await expect(page.locator(".mobile-action-bar")).toBeVisible();

  await menuButton.click();
  await expect(page.getByRole("dialog", { name: "Mobile navigation" })).toBeVisible();
  await expect(page.locator(".mobile-action-bar")).toBeHidden();

  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: "Mobile navigation" })).toBeHidden();
  await expect(page.getByRole("button", { name: "Open menu" })).toBeFocused();

  await page.goto("/book");
  await expect(page.locator(".mobile-action-bar")).toHaveCount(0);
});

test("footer legal routes render their documents", async ({ page }) => {
  await page.goto("/");
  const footer = page.locator("footer.site-footer");

  for (const [linkName, heading] of [
    ["Privacy", "Privacy"],
    ["Terms", "Terms"],
    ["Refunds", "Refunds"],
    ["Tyre disposal", "Tyre disposal"],
  ] as const) {
    await page.goto("/");
    await footer.getByRole("link", { name: linkName }).click();
    await expect(page.getByRole("heading", { level: 1, name: heading })).toBeVisible();
  }
});
