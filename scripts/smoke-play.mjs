// Usage: node scripts/smoke-play.mjs <baseUrl>. Overworld smoke: talk to Iota, walk through the south warp, tap-to-move.
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium, devices } = require("playwright");
const base = process.argv[2] ?? "http://localhost:3000";
const shots = process.env.SHOT_DIR;
const browser = await chromium.launch();
let failed = false;
for (const [name, opts] of [["desktop", { viewport: { width: 1280, height: 800 } }], ["iphone", devices["iPhone 14"]]]) {
  const ctx = await browser.newContext(opts);
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(`${base}/play/`);
  await page.locator("canvas").waitFor();
  await page.waitForTimeout(500);
  if (shots) await page.screenshot({ path: `${shots}/play-${name}-1-start.png` });
  // Face Iota (right of spawn) and talk.
  await page.keyboard.down("ArrowRight"); await page.waitForTimeout(150); await page.keyboard.up("ArrowRight");
  await page.keyboard.press("z");
  const talked = await page.getByRole("dialog").getByText("Prof. Iota").isVisible();
  if (shots) await page.screenshot({ path: `${shots}/play-${name}-2-talk.png` });
  await page.waitForTimeout(300);
  if (shots) await page.screenshot({ path: `${shots}/play-${name}-2a-typing.png` });
  await page.keyboard.press("z"); await page.waitForTimeout(120); // completes the typewriter
  await page.keyboard.press("z"); await page.waitForTimeout(120); // second page
  await page.keyboard.press("z"); await page.waitForTimeout(120); // completes page two
  await page.getByRole("button", { name: "Let's begin." }).click();
  // Flag was saved: after a reload Iota greets us as a returning trainer.
  await page.waitForTimeout(300);
  await page.reload();
  await page.locator("canvas").waitFor();
  await page.waitForTimeout(500);
  await page.keyboard.down("ArrowRight"); await page.waitForTimeout(150); await page.keyboard.up("ArrowRight");
  await page.keyboard.press("z");
  await page.waitForTimeout(1500);
  const returning = await page.getByText("Back already?").isVisible();
  if (shots) await page.screenshot({ path: `${shots}/play-${name}-2b-returning.png` });
  await page.keyboard.press("z"); await page.waitForTimeout(150); // closes the one-page greeting
  // Walk south through the warp via the d-pad hold (pointer events) or keys.
  await page.keyboard.down("ArrowDown"); await page.waitForTimeout(1900); await page.keyboard.up("ArrowDown");
  const onRoute = await page.getByText("Route 1", { exact: true }).isVisible().catch(() => false);
  if (shots) await page.screenshot({ path: `${shots}/play-${name}-3-route.png` });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  console.log(name, { talked, returning, onRoute, overflow, errors });
  if (!talked || !returning || !onRoute || overflow || errors.length) failed = true;
  await ctx.close();
}
await browser.close();
process.exit(failed ? 1 : 0);
