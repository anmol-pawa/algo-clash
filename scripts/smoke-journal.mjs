// Usage: node scripts/smoke-journal.mjs <baseUrl>. Seeds the journal store, then checks list, search and the two diffs.
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium, devices } = require("playwright");
const base = process.argv[2] ?? "http://localhost:3000";
const dir = process.env.SHOT_DIR ?? ".";
const browser = await chromium.launch();
let bad = 0;
const check = (name, ok, extra = "") => { console.log(ok ? "ok  " : "FAIL", name, extra); if (!ok) bad++; };
const OLD = "class Solution {\npublic:\n    long long totalWeight(vector<int> w) {\n        int total = 0;\n        for (int x : w) total += x;\n        return total;\n    }\n};\n";
const NEW = "class Solution {\npublic:\n    long long totalWeight(vector<int> w) {\n        long long total = 0;\n        for (const int x : w) total += x;\n        return total;\n    }\n};\n";
for (const [name, opts] of [["desktop", { viewport: { width: 1280, height: 800 } }], ["iphone", devices["iPhone 14"]]]) {
  const ctx = await browser.newContext(opts);
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  await page.goto(`${base}/journal/`);
  await page.waitForSelector("[data-testid=journal-empty]");
  check(`${name} empty state`, true);
  await page.evaluate(([oldC, newC]) => new Promise((res, rej) => {
    const r = indexedDB.open("algo-clash", 2);
    r.onsuccess = () => {
      const tx = r.result.transaction("journal", "readwrite");
      const s = tx.objectStore("journal");
      const e = { hintsUsed: 0, assisted: false, patterns: ["syntax"], promptChoice: -1, promptCorrect: false, problemId: "cargo-total" };
      s.add({ ...e, at: Date.UTC(2026, 10, 1, 9, 0), code: oldC, seconds: 300, hintsUsed: 2, assisted: true });
      s.add({ ...e, at: Date.UTC(2026, 10, 4, 9, 30), code: newC, seconds: 150 });
      tx.oncomplete = () => res(); tx.onerror = () => rej(tx.error);
    };
    r.onerror = () => rej(r.error);
  }), [OLD, NEW]);
  await page.reload();
  await page.waitForSelector("[data-testid=journal-list] li");
  check(`${name} two entries`, (await page.locator("[data-testid=journal-list] > li").count()) === 2);
  await page.fill("[data-testid=journal-search]", "nomatchxyz");
  check(`${name} search filters`, (await page.locator("[data-testid=journal-list] > li").count()) === 0);
  await page.fill("[data-testid=journal-search]", "cargo");
  check(`${name} search by title`, (await page.locator("[data-testid=journal-list] > li").count()) === 2);
  await page.locator("[data-testid=journal-list] > li button[aria-expanded]").first().click();
  check(`${name} newest first shows new code`, (await page.textContent("[data-testid=journal-code]")).includes("long long total"));
  await page.getByRole("button", { name: "vs past attempt" }).click();
  const d = await page.textContent("[data-testid=journal-diff]");
  check(`${name} past diff marks change`, d.includes("- ") && d.includes("int total = 0;") && d.includes("+ ") && d.includes("long long total = 0;"));
  await page.screenshot({ path: `${dir}/journal-${name}.png`, fullPage: true });
  await page.getByRole("button", { name: "vs reference" }).click();
  check(`${name} reference diff shown`, (await page.locator("[data-testid=journal-diff]").count()) === 1);
  await page.locator("[data-testid=journal-list] > li button[aria-expanded]").nth(1).click();
  await page.getByRole("button", { name: "vs past attempt" }).click();
  check(`${name} first attempt has no past`, (await page.textContent("[data-testid=journal-diff-note]")).includes("first accepted"));
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  check(`${name} no horizontal overflow`, !overflow);
  check(`${name} no console errors`, errors.length === 0, errors.join("|"));
  await ctx.close();
}
await browser.close();
process.exit(bad ? 1 : 0);
