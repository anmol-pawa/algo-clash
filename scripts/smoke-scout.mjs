// Usage: node scripts/smoke-scout.mjs <baseUrl>. Plays a Scout School round; checks grading feedback, persistence, title link.
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
  await page.goto(`${base}/scout/`);
  await page.waitForSelector("[data-testid=scout-start]:not([disabled])");
  check(`${name} starts unseen`, (await page.textContent("[data-testid=scout-progress]")).includes("0 of"));
  await page.click("[data-testid=scout-start]");
  for (let i = 0; i < 10; i++) {
    await page.waitForSelector("[data-testid=scout-question]");
    // alternate: lock in the first option (usually wrong) so feedback covers wrong paths
    await page.locator("button[data-pattern]").first().click();
    await page.click("[data-testid=scout-lock]");
    await page.waitForSelector("[data-testid=scout-feedback]");
    if (i === 0) await page.screenshot({ path: `${dir}/scout-feedback-${name}.png`, fullPage: true });
    await page.click("[data-testid=scout-next]");
  }
  await page.waitForSelector("[data-testid=scout-summary]");
  check(`${name} summary shown`, true);
  await page.screenshot({ path: `${dir}/scout-summary-${name}.png`, fullPage: true });
  await page.reload();
  await page.waitForSelector("[data-testid=scout-start]:not([disabled])");
  await page.waitForFunction(() => /^10 of/.test(document.querySelector("[data-testid=scout-progress]")?.textContent ?? ""));
  check(`${name} 10 statements persisted`, true);
  // a timeout path: wait the 20 s out once
  await page.click("[data-testid=scout-start]");
  await page.waitForSelector("[data-testid=scout-question]");
  await page.waitForSelector("[data-testid=scout-feedback]", { timeout: 25000 });
  check(`${name} timeout locks the question`, (await page.textContent("[data-testid=scout-feedback]")).includes("Missed"));
  await page.goto(`${base}/`);
  check(`${name} title has SCOUT link`, (await page.locator("a[href$='/scout/']").count()) === 1);
  await page.screenshot({ path: `${dir}/title-scout-${name}.png`, fullPage: true });
  check(`${name} no horizontal overflow`, !(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1)));
  check(`${name} no console errors`, errors.length === 0, errors.join("|"));
  await ctx.close();
}
await browser.close();
process.exit(bad ? 1 : 0);
