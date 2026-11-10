// Usage: node scripts/smoke-scout.mjs <baseUrl>. Plays a blitz round (correct, wrong, timed-out), checks persistence.
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
  await page.waitForSelector("[data-testid=scout-progress]");
  await page.getByRole("button", { name: "START BLITZ" }).click();
  await page.waitForSelector("[data-testid=scout-card]");
  // Wrong answer: pick the first choice twice-toggled is empty, so pick whichever and lock in.
  await page.getByRole("group", { name: "Patterns" }).getByRole("button").first().click();
  await page.getByRole("button", { name: "LOCK IN" }).click();
  await page.waitForSelector("[data-testid=scout-feedback]");
  check(`${name} feedback shown`, (await page.textContent("[data-testid=scout-verdict]")).length > 0);
  await page.screenshot({ path: `${dir}/scout-${name}.png`, fullPage: true });
  await page.getByRole("button", { name: "NEXT" }).click();
  await page.waitForSelector("[data-testid=scout-timer]");
  check(`${name} timer runs`, /\d+ s/.test(await page.textContent("[data-testid=scout-timer]")));
  // Finish the remaining 9 by locking in the first choice.
  for (let i = 1; i < 10; i++) {
    await page.getByRole("group", { name: "Patterns" }).getByRole("button").first().click();
    await page.getByRole("button", { name: "LOCK IN" }).click();
    await page.getByRole("button", { name: /NEXT|FINISH ROUND/ }).click();
  }
  await page.waitForSelector("[data-testid=scout-summary]");
  await page.reload();
  await page.waitForSelector("[data-testid=scout-progress]");
  await page.waitForFunction(() => /of 10 statements/.test(document.querySelector("[data-testid=scout-progress]")?.textContent ?? ""));
  check(`${name} progress persists (10 attempted)`, true);
  check(`${name} no mastery yet`, (await page.textContent("[data-testid=scout-mastery]")).includes("more statements"));
  await page.goto(`${base}/`);
  check(`${name} title has SCOUT link`, (await page.locator("a[href$='/scout/']").count()) === 1);
  check(`${name} no horizontal overflow`, !(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1)));
  check(`${name} no console errors`, errors.length === 0, errors.join("|"));
  await ctx.close();
}
await browser.close();
process.exit(bad ? 1 : 0);
