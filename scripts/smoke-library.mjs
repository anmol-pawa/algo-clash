// Usage: node scripts/smoke-library.mjs <baseUrl>. Drives the Library visualisers; checks stepping, custom input, errors, overflow.
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
  await page.goto(`${base}/library/`);
  await page.waitForSelector("[data-testid=vis-player]");
  check(`${name} starts at step 1`, (await page.textContent("[data-testid=vis-count]")).startsWith("Step 1 of"));
  for (let i = 0; i < 6; i++) await page.click("[data-testid=vis-next]");
  check(`${name} stepped`, (await page.textContent("[data-testid=vis-count]")).startsWith("Step 7 of"));
  await page.screenshot({ path: `${dir}/library-sort-${name}.png`, fullPage: true });
  await page.click("[data-vis=pair]");
  await page.fill("[data-testid=vis-input]", "2 7 11 15 20 31");
  await page.fill("[data-testid=vis-param]", "35");
  for (let i = 0; i < 20; i++) { if (await page.isDisabled("[data-testid=vis-next]")) break; await page.click("[data-testid=vis-next]"); }
  check(`${name} pair found`, (await page.textContent("[data-testid=vis-note]")).includes("Found the pair"), await page.textContent("[data-testid=vis-note]"));
  await page.screenshot({ path: `${dir}/library-pair-${name}.png`, fullPage: true });
  await page.click("[data-vis=distinct]");
  await page.click("[data-testid=vis-play]");
  await page.waitForFunction(() => /Replay/.test(document.querySelector("[data-testid=vis-play]")?.textContent ?? ""), null, { timeout: 15000 });
  check(`${name} autoplay reaches the end`, true);
  await page.fill("[data-testid=vis-input]", "1 two");
  check(`${name} bad input shows error`, !!(await page.$("[data-testid=vis-error]")));
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  check(`${name} no horizontal overflow`, !overflow);
  check(`${name} no console errors`, errors.length === 0, errors.join("|"));
  await ctx.close();
}
await browser.close();
process.exit(bad ? 1 : 0);
