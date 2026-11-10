// Usage: node scripts/smoke-card.mjs <baseUrl>. Seeds attempts + mastery, checks the Trainer Card renders them.
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
  await page.goto(`${base}/card/`);
  await page.waitForSelector("[data-testid=card-summary]");
  check(`${name} empty card: next action is Scout`, (await page.textContent("[data-testid=next-action]")).includes("Scout School"));
  await page.evaluate(() => new Promise((res, rej) => {
    const r = indexedDB.open("algo-clash", 2);
    r.onsuccess = () => {
      const tx = r.result.transaction(["attempts"], "readwrite");
      const st = tx.objectStore("attempts");
      const now = Date.now();
      st.add({ problemId: "calm-window", at: now, verdict: "WA", seconds: 300, hintsUsed: 0, mode: "practice" });
      st.add({ problemId: "calm-window", at: now + 1, verdict: "AC", seconds: 900, hintsUsed: 0, mode: "practice" });
      st.add({ problemId: "crate-brackets", at: now + 2, verdict: "TLE", seconds: 200, hintsUsed: 0, mode: "interview" });
      tx.oncomplete = () => res(); tx.onerror = () => rej(tx.error);
    };
    r.onerror = () => rej(r.error);
  }));
  await page.reload();
  await page.waitForSelector("[data-testid=causes] li");
  const causes = await page.textContent("[data-testid=causes]");
  check(`${name} cause histogram lists WA and TLE`, causes.includes("WA") && causes.includes("TLE"), causes.slice(0, 80));
  check(`${name} accepted 1 of 3`, (await page.textContent("[data-testid=card-summary]")).includes("1 accepted of 3"));
  check(`${name} five gates`, (await page.locator("[data-testid^=gate-]").count()) === 5);
  check(`${name} radar drawn`, (await page.locator("[data-testid=radar]").count()) === 1);
  await page.screenshot({ path: `${dir}/card-${name}.png`, fullPage: true });
  await page.goto(`${base}/`);
  check(`${name} title has CARD link`, (await page.locator("a[href$='/card/']").count()) === 1);
  check(`${name} no horizontal overflow`, !(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1)));
  check(`${name} no console errors`, errors.length === 0, errors.join("|"));
  await ctx.close();
}
await browser.close();
process.exit(bad ? 1 : 0);
