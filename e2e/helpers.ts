import { expect, type Locator, type Page } from "@playwright/test";

const READY_TIMEOUT = 20_000;
const MAX_ATTEMPTS = 3;

/**
 * Wait for hydration before any client-only click. A cold Next dev server can
 * occasionally serve a document whose JS chunk 404s; the marker never appears
 * in that case. Bounded reloads recover from that without masking real bugs.
 */
export async function hydrated(page: Page): Promise<void> {
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    try {
      await page.waitForFunction(
        () => {
          const motionMarker = document.documentElement.style.getPropertyValue("--scroll-progress");
          const shortcut = document.querySelector(".search-trigger kbd")?.textContent?.trim();
          return motionMarker !== "" && shortcut !== undefined && shortcut !== "Search";
        },
        null,
        { timeout: READY_TIMEOUT },
      );
      return;
    } catch (error) {
      if (attempt === MAX_ATTEMPTS) throw error;
      await page.reload({ waitUntil: "domcontentloaded" });
    }
  }
}

/** Open the desktop command palette through its own, now-hydrated trigger. */
export async function openCommandPalette(page: Page): Promise<Locator> {
  await hydrated(page);

  const trigger = page.locator(".search-trigger");
  await expect(trigger).toBeVisible();
  await expect(trigger.locator("kbd")).not.toHaveText("Search");
  await trigger.click();

  const palette = page.getByRole("dialog", { name: "Search tyrespeed" });
  await expect(palette).toBeVisible();
  return palette;
}
