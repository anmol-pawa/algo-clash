// Usage: node scripts/smoke-save.mjs <baseUrl>. Runs the IndexedDB round trip on /dev/save at desktop and iPhone 14 size.
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium, devices } = require("playwright");
const base = process.argv[2] ?? "http://localhost:3000";
const browser = await chromium.launch();
let failed = false;
for (const [name, opts] of [["desktop", { viewport: { width: 1280, height: 800 } }], ["iphone", devices["iPhone 14"]]]) {
  const ctx = await browser.newContext(opts);
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(`${base}/dev/save/`);
  await page.getByRole("button", { name: "IndexedDB round trip" }).click();
  await page.getByTestId("log").filter({ hasText: /roundtrip|error/ }).waitFor();
  const log = await page.getByTestId("log").innerText();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  console.log(name, { log, overflow, errors });
  if (!log.includes("roundtrip OK") || overflow || errors.length) failed = true;
  await ctx.close();
}
await browser.close();
process.exit(failed ? 1 : 0);
