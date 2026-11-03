// Usage: node scripts/smoke-arena.mjs <baseUrl>. Battle layout smoke: desktop split view, mobile tabs, submit flow.
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
  await page.goto(`${base}/dev/arena/`);
  await page.locator("canvas").first().waitFor({ state: "attached" });
  await page.locator(".cm-editor").first().waitFor();
  await page.waitForTimeout(1800);
  if (shots) await page.screenshot({ path: `${shots}/arena-${name}-0.png` });
  const mobile = name === "iphone";
  if (mobile) {
    for (const t of ["Stage", "Problem", "Code"]) {
      await page.getByRole("tab", { name: t }).click();
      await page.waitForTimeout(150);
      if (shots) await page.screenshot({ path: `${shots}/arena-${name}-tab-${t}.png` });
    }
    if (!(await page.locator("#pane-stage").isHidden())) fail("stage pane should be hidden on the Code tab");
  } else {
    const box = await page.locator("canvas").first().boundingBox();
    const ed = await page.locator(".cm-editor").first().boundingBox();
    if (!box || !ed || box.y + box.height > ed.y + 2) fail(`stage not above editor: ${JSON.stringify([box, ed])}`);
    if (box && box.height > 800 * 0.4) fail("stage too tall");
  }
  // wrong submit: starter returns true always
  await page.getByRole("button", { name: /^Submit/ }).click();
  await page.getByTestId("verdict").first().waitFor({ state: "attached", timeout: 90000 });
  await page.waitForTimeout(900);
  if (shots) await page.screenshot({ path: `${shots}/arena-${name}-1-submit.png` });
  if (mobile && (await page.locator("#pane-stage").isHidden())) fail("submit should move to the Stage tab");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  if (overflow) fail(`${name} horizontal overflow`);
  if (errors.length) fail(`${name} console errors: ${errors.join(" | ")}`);
  await ctx.close();
}
await browser.close();
process.exit(failed ? 1 : 0);
