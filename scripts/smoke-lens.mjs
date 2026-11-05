// Usage: node scripts/smoke-lens.mjs <baseUrl>. Debug Lens on /dev/arena (hidden when none, confirm-then-use, count persists)
// and Rematch Ticket on /rift (a scheduled problem is made due now, ticket consumed).
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium, devices } = require("playwright");
const base = process.argv[2] ?? "http://localhost:3000";
const dir = process.env.SHOT_DIR ?? ".";
const browser = await chromium.launch();
let bad = 0;
const check = (name, ok, extra = "") => { console.log(ok ? "ok  " : "FAIL", name, extra); if (!ok) bad++; };
const patchCore = (page, fn) => page.evaluate(`new Promise((res, rej) => {
  const r = indexedDB.open("algo-clash", 2);
  r.onsuccess = () => {
    const tx = r.result.transaction("core", "readwrite");
    const st = tx.objectStore("core");
    const g = st.get("main");
    g.onsuccess = () => { const c = g.result; (${fn})(c); st.put(c, "main"); };
    tx.oncomplete = () => res(); tx.onerror = () => rej(tx.error);
  };
  r.onerror = () => rej(r.error);
})`);
for (const [name, opts] of [["desktop", { viewport: { width: 1280, height: 800 } }], ["iphone", devices["iPhone 14"]]]) {
  const ctx = await browser.newContext(opts);
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  await page.goto(`${base}/dev/arena/`);
  await page.getByTestId("hint-panel").waitFor();
  await page.waitForTimeout(800);
  check(`${name} no lens button when none held`, (await page.getByTestId("lens-btn").count()) === 0);
  await patchCore(page, `(c) => { c.inventory = { ...(c.inventory ?? {}), "debug-lens": 2, "rematch-ticket": 1 }; c.mastery = { ...(c.mastery ?? {}), "cargo-total": { state: "learned", solves: 1, due: Date.now() + 5 * 86400000, intervalDays: 5, ease: 2.5, lastSolvedAt: Date.now() } }; }`);
  await page.reload();
  await page.getByTestId("lens-btn").waitFor();
  const btn = page.getByTestId("lens-btn");
  check(`${name} shows count 2`, /\(2\)/.test(await btn.innerText()));
  await btn.click();
  check(`${name} asks to confirm`, /count as assisted/.test(await btn.innerText()));
  await btn.click();
  await page.getByTestId("lens-reading").waitFor();
  check(`${name} reading prompts a run`, /Run your code/.test(await page.getByTestId("lens-reading").innerText()));
  await page.screenshot({ path: `${dir}/lens-${name}.png` });
  check(`${name} no horizontal overflow (arena)`, !(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1)));
  await page.reload();
  await page.getByTestId("hint-panel").waitFor();
  await page.waitForTimeout(800);
  await page.getByTestId("lens-btn").waitFor();
  check(`${name} one Lens left after reload`, /\(1\)/.test(await page.getByTestId("lens-btn").innerText()));
  // Rematch Ticket on the Rift.
  await page.goto(`${base}/rift/`);
  await page.waitForSelector("[data-testid=rift-day]");
  await page.getByTestId("rematch").waitFor();
  await page.screenshot({ path: `${dir}/rematch-${name}.png` });
  await page.getByTestId("rematch-cargo-total").click();
  await page.getByTestId("rift-note").waitFor();
  check(`${name} rematch note`, /due now/.test(await page.getByTestId("rift-note").innerText()));
  check(`${name} rematch section gone (no tickets left)`, (await page.getByTestId("rematch").count()) === 0);
  await page.waitForTimeout(400);
  await page.reload();
  await page.waitForSelector("[data-testid=rift-day]");
  await page.waitForTimeout(500);
  check(`${name} ticket spent and persisted`, (await page.getByTestId("rematch").count()) === 0);
  check(`${name} no horizontal overflow (rift)`, !(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1)));
  check(`${name} no console errors`, errors.length === 0, errors.join(" | "));
  await ctx.close();
}
await browser.close();
process.exit(bad ? 1 : 0);
