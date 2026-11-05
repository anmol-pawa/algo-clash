// Usage: node scripts/smoke-mart.mjs <baseUrl>. Seeds 50 Bits, buys items, checks refusals, caps and persistence.
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
  await page.waitForSelector("[data-testid=mart-bits]");
  await page.evaluate(() => new Promise((res, rej) => {
    const r = indexedDB.open("algo-clash", 2);
    r.onsuccess = () => {
      const tx = r.result.transaction("core", "readwrite");
      tx.objectStore("core").put({ version: 1, profile: { bits: 50 } }, "main");
      tx.oncomplete = () => res(); tx.onerror = () => rej(tx.error);
    };
    r.onerror = () => rej(r.error);
  }));
  await page.reload();
  await page.waitForFunction(() => document.querySelector("[data-testid=mart-bits]")?.textContent?.includes("50"));
  check(`${name} shows 50 bits`, true);
  check(`${name} lens affordable at 50 Bits`, !(await page.getByRole("button", { name: /Buy Debug Lens/ }).isDisabled()));
  await page.getByRole("button", { name: /Buy Hint Token/ }).click();
  await page.waitForFunction(() => document.querySelector("[data-testid=mart-bits]")?.textContent?.includes("35"));
  check(`${name} hint token bought`, (await page.textContent("[data-testid=have-hint-token]")).includes("you have 1/"));
  await page.getByRole("button", { name: /Buy Rematch Ticket/ }).click();
  await page.waitForFunction(() => document.querySelector("[data-testid=mart-bits]")?.textContent?.includes("10"));
  await page.reload();
  await page.waitForFunction(() => document.querySelector("[data-testid=mart-bits]")?.textContent?.includes("10"));
  check(`${name} purchases persist`, (await page.textContent("[data-testid=have-rematch-ticket]")).includes("you have 1/"));
  check(`${name} broke: buys disabled`, await page.getByRole("button", { name: /Buy Hint Token/ }).isDisabled());
  await page.screenshot({ path: `${dir}/mart-${name}.png`, fullPage: true });
  await page.goto(`${base}/`);
  check(`${name} title has MART link`, (await page.locator("a[href$='/mart/']").count()) === 1);
  await page.screenshot({ path: `${dir}/title-${name}.png`, fullPage: true });
  check(`${name} no horizontal overflow`, !(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1)));
  check(`${name} no console errors`, errors.length === 0, errors.join("|"));
  await ctx.close();
}
await browser.close();
process.exit(bad ? 1 : 0);
