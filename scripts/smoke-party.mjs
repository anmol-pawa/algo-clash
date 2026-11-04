// Usage: node scripts/smoke-party.mjs <baseUrl>. Opens /party, checks the starter, locked move, and Structdex tab.
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
  await page.goto(`${base}/party/`);
  await page.waitForSelector("[data-testid=form-name]");
  await page.waitForTimeout(500);
  check(`${name} starter shown`, (await page.textContent("[data-testid=form-name]")) === "Arrayling");
  check(`${name} locked move points to Forge`, (await page.locator("ul[aria-label=Moves] a[href='/forge/']").count()) === 1);
  await page.screenshot({ path: `${dir}/party-${name}.png` });
  await page.getByRole("button", { name: "Structdex" }).click();
  await page.waitForSelector("[data-testid=dex-vectorling]");
  check(`${name} dex hides unmet species`, (await page.textContent("[data-testid=dex-vectorling]")).includes("???"));
  await page.screenshot({ path: `${dir}/dex-${name}.png` });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  check(`${name} no horizontal overflow`, !overflow);
  check(`${name} no console errors`, errors.length === 0, errors.join("|"));
  await ctx.close();
}
await browser.close();
process.exit(bad ? 1 : 0);
