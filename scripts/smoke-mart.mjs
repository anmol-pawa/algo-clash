// Usage: node scripts/smoke-mart.mjs <baseUrl>. Seeds Bits, buys items, checks refusal, persistence and layout.
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
  await page.goto(`${base}/mart/`);
  await page.waitForSelector("[data-testid=bits]");
  await page.waitForTimeout(500);
  check(`${name} starter kit shows 3 tokens`, (await page.textContent("[data-testid=item-hint-token]")).includes("own 3/30"));
  check(`${name} buy disabled with 0 Bits`, await page.locator("[data-testid=item-hint-token] button").isDisabled());
  await page.evaluate(() => new Promise((res, rej) => {
    const r = indexedDB.open("algo-clash");
    r.onsuccess = () => {
      const tx = r.result.transaction("core", "readwrite");
      const s = tx.objectStore("core");
      const get = s.get("main");
      get.onsuccess = () => { const c = get.result; c.profile.bits = 100; s.put(c, "main"); };
      tx.oncomplete = () => res(); tx.onerror = () => rej(tx.error);
    };
    r.onerror = () => rej(r.error);
  }));
  await page.reload();
  await page.waitForSelector("[data-testid=bits]");
  await page.waitForTimeout(500);
  check(`${name} bits seeded`, (await page.textContent("[data-testid=bits]")).includes("100"));
  await page.locator("[data-testid=item-debug-lens] button").click();
  await page.locator("[data-testid=item-hint-token] button").click();
  check(`${name} bits spent (100-40-15=45)`, (await page.textContent("[data-testid=bits]")).includes("45"));
  await page.screenshot({ path: `${dir}/mart-${name}.png` });
  await page.reload();
  await page.waitForSelector("[data-testid=bits]");
  await page.waitForTimeout(500);
  check(`${name} purchases persist`, (await page.textContent("[data-testid=item-debug-lens]")).includes("own 1/10") && (await page.textContent("[data-testid=item-hint-token]")).includes("own 4/30"));
  await page.locator("[data-testid=item-debug-lens] button").click();
  check(`${name} unaffordable disabled (5 Bits left)`, await page.locator("[data-testid=item-debug-lens] button").isDisabled());
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  check(`${name} no horizontal overflow`, !overflow);
  check(`${name} no console errors`, errors.length === 0, errors.join("|"));
  await ctx.close();
}
await browser.close();
process.exit(bad ? 1 : 0);
