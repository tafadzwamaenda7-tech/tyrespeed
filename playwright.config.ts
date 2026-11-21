import { existsSync } from "node:fs";
import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000";

// Prefer the locally installed Chrome so tests match what is on this machine.
// CI falls back to the bundled Chromium installed by `playwright install`.
const chromeCandidates = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "/usr/bin/google-chrome",
  "/usr/bin/google-chrome-stable",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
];
const useInstalledChrome = !process.env.CI && chromeCandidates.some(existsSync);

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 2,
  timeout: 90_000,
  expect: { timeout: 15_000 },
  reporter: process.env.CI ? "line" : [["list"], ["html", { open: "never" }]],
  use: {
    baseURL,
    navigationTimeout: 90_000,
    actionTimeout: 20_000,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        ...(useInstalledChrome ? { channel: "chrome" } : {}),
      },
    },
  ],
  webServer: {
    // A production server has no on-demand compilation or HMR, so two workers
    // cannot race a dev rebuild into a missing chunk or kill the server.
    command: "npm run start",
    url: baseURL,
    reuseExistingServer: false,
    timeout: 300_000,
  },
});
