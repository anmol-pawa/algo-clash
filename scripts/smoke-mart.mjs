// Usage: node scripts/smoke-mart.mjs <baseUrl>. Mart smoke: starter kit, too-poor refusal, buying with seeded Bits, persistence over reload.
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium, devices } = require("playwright");
const base = process.argv[2] ?? "http://localhost:3000";
const shots = process.env.SHOT_DIR;
const browser = await chromium.launch();
let failed = false;
const fail = (m) => { console.error("FAIL", m); failed = true; };
for (const [name, opts] of [["desktop", { viewport: { width: 1280, height: 800 } }], ["iphone", devices["iPhone 14"]]]) {
  const ctx = await browser.newContext(opts);
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(`${base}/mart/`);
  await page.getByTestId("mart-list").waitFor();
  await page.waitForFunction(() => document.querySelector("[data-testid=mart-bits]")?.textContent !== "…");
  const bits0 = Number(await page.getByTestId("mart-bits").innerText());
  const tokens = page.getByTestId("mart-item-hint-token");
  const lens = page.getByTestId("mart-item-debug-lens");
  if (!/Owned 3\/30/.test(await tokens.innerText())) fail(`${name}: starter kit of 3 tokens missing`);
  if (bits0 < 15) {
    if (!(await tokens.getByRole("button").isDisabled())) fail(`${name}: buy should be disabled when poor`);
  }
  // Seed Bits directly in the save, then reload.
  await page.evaluate(() => new Promise((res, rej) => {
    const r = indexedDB.open("algo-clash");
    r.onerror = () => rej(r.error);
    r.onsuccess = () => {
      const db = r.result;
      const os = db.transaction("core", "readwrite").objectStore("core");
      const keys = os.getAllKeys();
      keys.onsuccess = () => {
        const key = keys.result[0];
        const get = os.get(key);
        get.onsuccess = () => {
          const row = get.result;
          row.profile.bits = 100;
          const put = os.put(row, key);
          put.onsuccess = () => { db.close(); res(); };
          put.onerror = () => rej(put.error);
        };
      };
    };
  }));
  await page.reload();
  await page.waitForFunction(() => document.querySelector("[data-testid=mart-bits]")?.textContent === "100");
  await tokens.getByRole("button").click();
  await page.waitForFunction(() => document.querySelector("[data-testid=mart-bits]")?.textContent === "85");
  if (!/Owned 4\/30/.test(await tokens.innerText())) fail(`${name}: token count after buy`);
  await lens.getByRole("button").click();
  await page.waitForFunction(() => document.querySelector("[data-testid=mart-bits]")?.textContent === "45");
  await page.getByTestId("mart-item-complexity-compass").getByRole("button").click();
  await page.waitForFunction(() => document.querySelector("[data-testid=mart-bits]")?.textContent === "15");
  if (!(await lens.getByRole("button").isDisabled())) fail(`${name}: lens should be disabled when poor`);
  if (shots) await page.screenshot({ path: `${shots}/mart-${name}.png`, fullPage: true });
  await page.reload();
  await page.waitForFunction(() => document.querySelector("[data-testid=mart-bits]")?.textContent === "15");
  if (!/Owned 4\/30/.test(await page.getByTestId("mart-item-hint-token").innerText())) fail(`${name}: purchase did not persist`);
  if (await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1)) fail(`${name}: horizontal overflow`);
  if (errors.length) fail(`${name}: console errors ${errors.join(" | ")}`);
  await ctx.close();
}
await browser.close();
if (failed) process.exit(1);
console.log("mart smoke ok");
