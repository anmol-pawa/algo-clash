// Usage: node scripts/smoke-party.mjs <baseUrl>. Opens /party, checks the default loadout, unequips/equips, Structdex tab, persistence.
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
  await page.waitForSelector("[data-testid=level]");
  await page.waitForTimeout(500);
  const equipped = page.locator("ul[aria-label='Equipped moves'] button");
  check(`${name} starter move equipped by default`, (await equipped.count()) === 1);
  await page.screenshot({ path: `${dir}/party-${name}.png`, fullPage: true });
  await equipped.first().click();
  check(`${name} unequip empties the slot`, (await equipped.count()) === 0);
  await page.waitForTimeout(300);
  await page.reload();
  await page.waitForSelector("[data-testid=level]");
  check(`${name} unequip persisted`, (await page.locator("ul[aria-label='Equipped moves'] button").count()) === 0);
  await page.getByRole("button", { name: "Equip" }).first().click();
  check(`${name} re-equip`, (await page.locator("ul[aria-label='Equipped moves'] button").count()) === 1);
  await page.getByRole("tab", { name: /STRUCTDEX/ }).click();
  check(`${name} dex lists species`, (await page.locator("ul[aria-label=Structdex] li").count()) >= 10);
  await page.screenshot({ path: `${dir}/party-dex-${name}.png`, fullPage: true });
  const ov = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  check(`${name} no horizontal overflow`, !ov);
  check(`${name} no console errors`, errors.length === 0, errors.join("|"));
  await ctx.close();
}
await browser.close();
process.exit(bad ? 1 : 0);
