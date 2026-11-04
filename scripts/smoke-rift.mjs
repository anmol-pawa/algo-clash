// Usage: node scripts/smoke-rift.mjs <baseUrl>. Opens /rift/, checks the five rooms, plays the Blitz Gate, checks reward + persistence.
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
  await page.waitForSelector("[data-testid=rift-status]");
  check(`${name} five rooms`, (await page.locator("ol[aria-label='Rift rooms'] > li").count()) === 5);
  check(`${name} streak starts at 0`, (await page.textContent("[data-testid=rift-status]")).includes("Streak 0"));
  await page.screenshot({ path: `${dir}/rift-list-${name}.png` });
  await page.locator("ol[aria-label='Rift rooms'] button:not([disabled])", { hasText: "Blitz Gate" }).click();
  await page.waitForSelector("section[aria-label='Concept card']");
  await page.screenshot({ path: `${dir}/rift-blitz-${name}.png` });
  for (let i = 0; i < 5; i++) {
    await page.waitForSelector("section[aria-label='Concept card']");
    const sec = page.locator("section[aria-label='Concept card']");
    if (await sec.locator("[role=radio]").count()) await sec.locator("[role=radio]").first().click();
    else if (await sec.locator("[role=checkbox]").count()) await sec.locator("[role=checkbox]").first().click();
    else if (await sec.locator("textarea").count()) await sec.locator("textarea").fill("0");
    else if (await sec.locator("input").count()) { for (const el of await sec.locator("input").all()) await el.fill("x"); }
    else { const n = await sec.locator("div.flex.flex-col.gap-1 > button").count(); for (let k = 0; k < n; k++) await sec.locator("div.flex.flex-col.gap-1 > button:not([disabled])").first().click(); }
    await page.getByRole("button", { name: "Check" }).click();
    await page.getByRole("button", { name: /^(Next|Finish)$/ }).click();
  }
  // Arbitrary answers rarely reach 3/5, so accept either outcome and check the matching state (payouts are unit-tested).
  await page.waitForSelector("[data-testid=rift-reward], [data-testid=rift-blitz-miss]");
  const passed = (await page.locator("[data-testid=rift-reward]").count()) > 0;
  console.log(`info ${name} blitz ${passed ? "passed" : "missed"}`);
  await page.screenshot({ path: `${dir}/rift-reward-${name}.png` });
  if (passed) check(`${name} reward shown`, (await page.textContent("[data-testid=rift-reward]")).includes("+10 Bits"));
  await page.reload();
  await page.waitForSelector("[data-testid=rift-status]");
  await page.waitForTimeout(300);
  const row = await page.locator("ol[aria-label='Rift rooms'] li", { hasText: "Blitz Gate" }).textContent();
  check(`${name} clear state persisted`, passed ? row.includes("Clear") : row.includes("+10 Bits"));
  check(`${name} bits persisted`, (await page.textContent("[data-testid=rift-status]")).includes(passed ? "10 Bits" : "0 Bits"));
  const ov = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  check(`${name} no horizontal overflow`, !ov);
  check(`${name} no console errors`, errors.length === 0, errors.join("|"));
  await ctx.close();
}
await browser.close();
process.exit(bad ? 1 : 0);
