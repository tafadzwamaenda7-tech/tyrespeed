import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { hydrated, openCommandPalette } from "./helpers";

const pages = ["/", "/tyres", "/services", "/workshop", "/book", "/faq", "/privacy"];
const viewports = [
  { name: "1440", width: 1440, height: 900 },
  { name: "390", width: 390, height: 844 },
];

// Axe reports best-practice items too; the launch target is zero WCAG A/AA violations.
const tags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"];

/** Settle every reveal into its final state so axe audits real colours, not mid-transition blends. */
async function revealContent(page: Page): Promise<void> {
  await page.addStyleTag({
    content: "*, *::before, *::after { transition: none !important; animation: none !important; }",
  });
  await page.evaluate(() => {
    document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((element) => {
      element.classList.add("is-revealed");
      element.style.opacity = "1";
      element.style.transform = "none";
    });
  });
}

async function check(page: Page, label: string, selector?: string): Promise<void> {
  const consoleErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => consoleErrors.push(error.message));

  let builder = new AxeBuilder({ page }).withTags(tags);
  if (selector) builder = builder.include(selector);
  const results = await builder.analyze();
  expect(
    results.violations,
    `${label}: ${results.violations.map((v) => `${v.id} (${v.impact})`).join(", ")}`,
  ).toEqual([]);
  expect(consoleErrors, `${label} console errors`).toEqual([]);
}

for (const viewport of viewports) {
  test(`axe reports no violations at ${viewport.name}px`, async ({ page }) => {
    test.setTimeout(240_000);
    await page.setViewportSize({ width: viewport.width, height: viewport.height });

    for (const path of pages) {
      await page.goto(path);
      await hydrated(page);
      await revealContent(page);
      await check(page, path);
    }
  });

  test(`axe reports no violations in overlays at ${viewport.name}px`, async ({ page }) => {
    test.setTimeout(180_000);
    await page.setViewportSize({ width: viewport.width, height: viewport.height });

    const mobile = viewport.name === "390";

    await page.goto("/tyres");
    await hydrated(page);
    await page.getByRole("button", { name: "Add to quote" }).first().click();

    await page.getByRole("button", { name: /Review quote/ }).click();
    const drawer = page.locator(".drawer");
    await expect(drawer).toBeVisible();
    await check(page, `${viewport.name}px quote drawer`, ".drawer");
    await page.getByRole("button", { name: "Close quote" }).click();

    if (mobile) {
      await page.getByRole("button", { name: "Open menu" }).click();
      await page.locator(".menu-search-button").click();
    } else {
      await openCommandPalette(page);
    }
    const palette = page.locator(".palette");
    await expect(palette).toBeVisible();
    await check(page, `${viewport.name}px command palette`, ".palette");
    await page.keyboard.press("Escape");

    if (mobile) {
      await page.getByRole("button", { name: "Open menu" }).click();
      const menu = page.getByRole("dialog", { name: "Mobile navigation" });
      await expect(menu).toBeVisible();
      await check(page, `${viewport.name}px mobile menu`, ".menu-sheet");
    }
  });
}

test("keyboard focus uses a solid 2px outline at both breakpoints", async ({ page }) => {
  for (const viewport of viewports) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("/");
    await page.keyboard.press("Tab");

    const focus = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el) return null;
      const style = getComputedStyle(el);
      return {
        tag: el.tagName,
        style: style.outlineStyle,
        width: style.outlineWidth,
        offset: style.outlineOffset,
      };
    });

    expect(focus, `${viewport.name}px focus`).not.toBeNull();
    expect(focus?.style).toBe("solid");
    expect(focus?.width).toBe("2px");
    expect(focus?.offset).toBe("3px");
  }
});

test("reduced motion reveals content without animation", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");

  const motion = await page.evaluate(() => {
    const style = getComputedStyle(document.documentElement);
    const revealed = Array.from(document.querySelectorAll("[data-reveal]")).map(
      (el) => getComputedStyle(el).opacity,
    );
    return {
      scrollBehavior: style.scrollBehavior,
      hidden: revealed.filter((opacity) => Number(opacity) < 1).length,
      total: revealed.length,
    };
  });

  expect(motion.scrollBehavior).toBe("auto");
  expect(motion.hidden).toBe(0);
  expect(motion.total).toBeGreaterThan(0);
});
