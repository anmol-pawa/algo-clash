// Usage: node scripts/smoke-draft.mjs <baseUrl>. Types in /dev/problem, waits for the 5 s autosave, reloads, expects the text back.
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
  await page.goto(`${base}/dev/problem/`);
  await page.locator(".cm-content").click();
  await page.keyboard.press("Control+End");
  await page.keyboard.type("// draft-marker");
  await page.waitForTimeout(5600);
  await page.reload();
  await page.waitForFunction(() => document.querySelector(".cm-content")?.textContent?.includes("draft-marker"), null, { timeout: 8000 }).catch(() => {});
  const restored = (await page.locator(".cm-content").innerText()).includes("draft-marker");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  await page.screenshot({ path: `/tmp/draft-${name}.png` });
  console.log(name, { restored, overflow, errors });
  if (!restored || overflow || errors.length) failed = true;
  await ctx.close();
}
await browser.close();
process.exit(failed ? 1 : 0);
