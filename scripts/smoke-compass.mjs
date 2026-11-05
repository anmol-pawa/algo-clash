// Usage: node scripts/smoke-compass.mjs <baseUrl>. Complexity Compass on /dev/arena: hidden with none held, then seeded, confirm-then-use, reading shown, count persists.
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
  await page.goto(`${base}/dev/arena/`);
  await page.getByTestId("hint-panel").waitFor();
  await page.waitForTimeout(800);
  check(`${name} no compass button when none held`, (await page.getByTestId("compass-btn").count()) === 0);
  // Seed two Compasses while keeping the starter-kit flag the arena just wrote.
  await page.evaluate(() => new Promise((res, rej) => {
    const r = indexedDB.open("algo-clash", 2);
    r.onsuccess = () => {
      const tx = r.result.transaction("core", "readwrite");
      const st = tx.objectStore("core");
      const g = st.get("main");
      g.onsuccess = () => { const c = g.result; c.inventory = { ...(c.inventory ?? {}), "complexity-compass": 2 }; st.put(c, "main"); };
      tx.oncomplete = () => res(); tx.onerror = () => rej(tx.error);
    };
    r.onerror = () => rej(r.error);
  }));
  await page.reload();
  await page.getByTestId("compass-btn").waitFor();
  const btn = page.getByTestId("compass-btn");
  check(`${name} shows count 2`, /\(2\)/.test(await btn.innerText()));
  await btn.click();
  check(`${name} asks to confirm`, /one mastery tier less/.test(await btn.innerText()));
  await btn.click();
  await page.getByTestId("compass-reading").waitFor();
  const reading = await page.getByTestId("compass-reading").innerText();
  check(`${name} reading shows O(...)`, /time\s+O\(.+\).*space\s+O\(.+\)/.test(reading), reading);
  await page.screenshot({ path: `${dir}/compass-${name}.png` });
  check(`${name} no horizontal overflow`, !(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1)));
  await page.reload();
  await page.getByTestId("hint-panel").waitFor();
  await page.waitForTimeout(800);
  await page.getByTestId("compass-btn").waitFor();
  check(`${name} one Compass left after reload`, /\(1\)/.test(await page.getByTestId("compass-btn").innerText()));
  check(`${name} no console errors`, errors.length === 0, errors.join(" | "));
  await ctx.close();
}
await browser.close();
process.exit(bad ? 1 : 0);
