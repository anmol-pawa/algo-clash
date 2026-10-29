// Usage: node scripts/smoke-editor.mjs <baseUrl> [outDir]. Drives /dev/editor at desktop and iPhone 14 size.
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium, devices } = require("playwright");
const base = process.argv[2] ?? "http://localhost:3000";
const out = process.argv[3] ?? ".";
const browser = await chromium.launch();
for (const [name, opts] of [["desktop", { viewport: { width: 1280, height: 800 } }], ["iphone", devices["iPhone 14"]]]) {
  const ctx = await browser.newContext(opts);
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(`${base}/dev/editor/`);
  await page.waitForSelector(".cm-content");
  await page.click(".cm-content");
  await page.keyboard.press("Control+End");
  await page.keyboard.type("int x");
  await page.getByRole("button", { name: "( )", exact: true }).click();
  await page.getByRole("button", { name: "Theme: night" }).click();
  await page.getByRole("button", { name: "Larger font" }).click();
  const text = await page.locator(".cm-content").innerText();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  console.log(name, { hasParens: text.includes("int x()"), overflow, errors });
  await page.screenshot({ path: `${out}/editor-${name}.png` });
  await ctx.close();
}
await browser.close();
