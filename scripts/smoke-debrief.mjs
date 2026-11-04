// Usage: node scripts/smoke-debrief.mjs <baseUrl>. Opens /dev/debrief, answers the elaborative prompt, opens the reference.
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium, devices } = require("playwright");
const base = process.argv[2] ?? "http://localhost:3000";
const dir = process.env.SHOT_DIR ?? ".";
const browser = await chromium.launch();
let bad = 0;
const check = (name, ok, extra = "") => { console.log(ok ? "ok  " : "FAIL", name, extra); if (!ok) bad++; };
for (const [name, opts] of [["desktop", { viewport: { width: 1280, height: 800 } }], ["iphone", devices["iPhone 14"]]]) {
  const ctx = await browser.newContext(opts);
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  await page.goto(`${base}/dev/debrief/`);
  await page.waitForSelector("[data-testid=debrief]");
  check(`${name} signals section first after prompt`, (await page.locator("h2").first().textContent()) === "Signals");
  await page.getByRole("button", { name: /^The init value 0/ }).click();
  check(`${name} prompt feedback right`, (await page.textContent("[data-testid=prompt-feedback]")).startsWith("Right."));
  await page.getByRole("button", { name: /reference solution/ }).click();
  check(`${name} reference shown`, (await page.textContent("[data-testid=reference]")).includes("totalWeight"));
  await page.screenshot({ path: `${dir}/debrief-${name}.png`, fullPage: true });
  check(`${name} no horizontal overflow`, !(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1)));
  check(`${name} no console errors`, errors.length === 0, errors.join("|"));
  await ctx.close();
}
await browser.close();
process.exit(bad ? 1 : 0);
