// Usage: node scripts/smoke-learn.mjs <baseUrl>. Walks to the Academy door, reads a lesson through to practice, checks progress persists.
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium, devices } = require("playwright");
const base = process.argv[2] ?? "http://localhost:3000";
const dir = process.env.SHOT_DIR ?? ".";
const browser = await chromium.launch();
let bad = 0;
const check = (name, ok, extra = "") => { console.log(ok ? "ok  " : "FAIL", name, extra); if (!ok) bad++; };
const route = ["ArrowDown", "ArrowRight", "ArrowRight", "ArrowUp", "ArrowRight", "ArrowRight", "ArrowRight", "ArrowRight", "ArrowDown", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowLeft", "ArrowUp"];
for (const [name, opts] of [["desktop", { viewport: { width: 1280, height: 800 } }], ["iphone", devices["iPhone 14"]]]) {
  const ctx = await browser.newContext(opts);
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  await page.goto(`${base}/play/`);
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${dir}/learn-map-${name}.png` });
  for (const k of route) { await page.keyboard.down(k); await page.waitForTimeout(80); await page.keyboard.up(k); await page.waitForTimeout(420); }
  await page.waitForTimeout(1200);
  check(`${name} door opens /learn`, page.url().includes("/learn"), page.url());
  if (!page.url().includes("/learn")) { await ctx.close(); continue; }
  await page.waitForSelector("[data-testid=lessons-progress]");
  check(`${name} starts at 0 read`, (await page.textContent("[data-testid=lessons-progress]")).startsWith("0 of"));
  await page.screenshot({ path: `${dir}/learn-list-${name}.png` });
  await page.locator("ul[aria-label=Lessons] button").first().click();
  await page.waitForSelector("[data-testid=lesson-page]");
  await page.screenshot({ path: `${dir}/learn-lesson-${name}.png` });
  for (let i = 0; i < 40 && !(await page.locator("[data-testid=lesson-practice]").count()); i++) {
    await page.getByRole("button", { name: /^(Next|Practice)$/ }).click();
    await page.waitForTimeout(60);
  }
  await page.waitForSelector("[data-testid=lesson-practice]");
  await page.waitForTimeout(500);
  await page.reload();
  await page.waitForSelector("[data-testid=lessons-progress]");
  await page.waitForTimeout(300);
  const t = await page.textContent("[data-testid=lessons-progress]");
  check(`${name} progress persisted`, t.startsWith("1 of"), t);
  await page.screenshot({ path: `${dir}/learn-after-${name}.png` });
  const ov = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  check(`${name} no horizontal overflow`, !ov);
  check(`${name} no console errors`, errors.length === 0, errors.join("|"));
  await ctx.close();
}
await browser.close();
process.exit(bad ? 1 : 0);
