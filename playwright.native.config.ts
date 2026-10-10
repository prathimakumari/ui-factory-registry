import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "./native-tests",
  outputDir: "native-test-results",
  workers: 1,
  timeout: 60000,
  use: {
    baseURL: "http://127.0.0.1:3200",
    ...devices["Desktop Chrome"],
    reducedMotion: "reduce",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: "node scripts/serve-mobile-preview.mjs",
    url: "http://127.0.0.1:3200",
    reuseExistingServer: false,
  },
});
