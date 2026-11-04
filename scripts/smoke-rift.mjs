// Usage: node scripts/smoke-rift.mjs <baseUrl>. Opens /rift, clears the blitz room, checks persistence and layout.
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
  page.setDefaultTimeout(5000);
  await page.goto(`${base}/rift/`);
  await page.waitForSelector("[data-testid=rift-rooms]");
  await page.screenshot({ path: `${dir}/rift-hub-${name}.png` });
  check(`${name} five rooms`, (await page.locator("[data-testid=rift-rooms] > li").count()) === 5);
  // The Team Undefined Den is a single compiler-error (multiple choice) card.
  await page.click("[data-testid=room-3]");
  await page.locator("[role=radio]").first().click();
  await page.getByRole("button", { name: "Check" }).click();
  await page.getByRole("button", { name: /Finish|Next/ }).click();
  await page.screenshot({ path: `${dir}/rift-cards-${name}.png` });
  const done = page.locator("[data-testid=room-done]");
  if (await done.count()) { await done.click(); await page.waitForTimeout(500); }
  check(`${name} den room cleared`, (await page.locator("[aria-label=cleared]").count()) >= 1);
  await page.reload();
  await page.waitForSelector("[data-testid=rift-rooms]");
  check(`${name} cleared survives reload`, (await page.locator("[aria-label=cleared]").count()) >= 1);
  check(`${name} no horizontal overflow`, await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth));
  check(`${name} no console errors`, errors.length === 0, errors.join(" | "));
  await ctx.close();
}
await browser.close();
process.exit(bad ? 1 : 0);
