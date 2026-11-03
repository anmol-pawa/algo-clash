// Usage: node scripts/smoke-battle.mjs <baseUrl>. Battle stage smoke: intro, hits, verdict stingers, no overflow.
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium, devices } = require("playwright");
const base = process.argv[2] ?? "http://localhost:3000";
const shots = process.env.SHOT_DIR;
const browser = await chromium.launch();
let failed = false;
for (const [name, opts] of [["desktop", { viewport: { width: 1280, height: 800 } }], ["iphone", devices["iPhone 14"]]]) {
  const ctx = await browser.newContext(opts);
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(`${base}/dev/battle/`);
  await page.locator("canvas").waitFor();
  await page.waitForTimeout(400);
  if (shots) await page.screenshot({ path: `${shots}/battle-${name}-1-intro.png` });
  await page.waitForTimeout(1000);
  await page.getByRole("button", { name: "Hit foe" }).click();
  await page.waitForTimeout(220);
  if (shots) await page.screenshot({ path: `${shots}/battle-${name}-2-hit.png` });
  await page.getByRole("button", { name: "Foe hits" }).click();
  await page.getByRole("button", { name: "AC", exact: true }).click();
  await page.waitForTimeout(350);
  if (shots) await page.screenshot({ path: `${shots}/battle-${name}-3-verdict.png` });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  if (overflow) { console.error(name, "horizontal overflow"); failed = true; }
  if (errors.length) { console.error(name, errors); failed = true; }
  console.log(name, "ok");
  await ctx.close();
}
await browser.close();
process.exit(failed ? 1 : 0);
