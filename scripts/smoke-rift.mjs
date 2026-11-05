// Usage: node scripts/smoke-rift.mjs <baseUrl>. Opens /rift, clears the blitz room, checks reward + persistence.
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
  await page.goto(`${base}/rift/`);
  await page.waitForSelector("[data-testid=rift-day]");
  await page.screenshot({ path: `${dir}/rift-map-${name}.png` });
  check(`${name} five rooms`, (await page.locator("ol[aria-label=Rooms] > li").count()) === 5);
  await page.locator("[data-testid=room-blitz] button").click();
  for (let i = 0; i < 5; i++) {
    await page.waitForSelector("[data-testid=feedback], section[aria-label='Concept card']");
    const sec = page.locator("section[aria-label='Concept card']");
    if (await sec.locator("textarea").count()) await sec.locator("textarea").fill("0");
    else if (await sec.locator("input[aria-label^='blank']").count()) { const n = await sec.locator("input[aria-label^='blank']").count(); for (let k = 0; k < n; k++) await sec.locator("input[aria-label^='blank']").nth(k).fill("x"); }
    else if (await sec.locator("[data-testid=parsons-answer]").count()) { for (let k = 0; k < 40; k++) { const b = sec.locator("div.grid > div").first().locator("button:not([disabled])").first(); if (!(await b.count())) break; await b.click(); } }
    else await sec.locator("[aria-label=choices] button").first().click();
    await page.getByRole("button", { name: "Check" }).click({ timeout: 3000 }).catch(async (e) => { console.log(await sec.innerText()); throw e; });
    await page.waitForSelector("[data-testid=feedback]", { timeout: 5000 });
    if (i === 0) await page.screenshot({ path: `${dir}/rift-card-${name}.png` });
    await page.getByRole("button", { name: /^(Next|Finish)$/ }).click();
  }
  await page.waitForSelector("[data-testid=rift-earned]");
  check(`${name} blitz cleared and paid`, (await page.textContent("[data-testid=rift-earned]")).includes("10 Bits"), await page.textContent("[data-testid=rift-earned]"));
  await page.reload();
  await page.waitForSelector("[data-testid=rift-earned]");
  await page.waitForTimeout(300);
  check(`${name} persisted`, (await page.textContent("[data-testid=rift-earned]")).includes("10 Bits"));
  await page.screenshot({ path: `${dir}/rift-after-${name}.png` });
  check(`${name} no horizontal overflow`, !(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1)));
  check(`${name} no console errors`, errors.length === 0, errors.join("|"));
  await ctx.close();
}
await browser.close();
process.exit(bad ? 1 : 0);
