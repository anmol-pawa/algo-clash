// Usage: node scripts/smoke-play.mjs <baseUrl> [shotDir]. Drives /play: walk, warp, tap-to-move; screenshots at desktop and iPhone 14.
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium, devices } = require("playwright");
const base = process.argv[2] ?? "http://localhost:3000";
const shots = process.argv[3];
const browser = await chromium.launch();
let failed = false;
for (const [name, opts] of [["desktop", { viewport: { width: 1280, height: 800 } }], ["iphone", devices["iPhone 14"]]]) {
  const ctx = await browser.newContext(opts);
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(`${base}/play/`);
  await page.getByTestId("overworld-canvas").waitFor();
  await page.waitForFunction(() => window.__world);
  const pos = () => page.evaluate(() => ({ ...window.__world.player, map: window.__world.map.id }));
  const start = await pos();
  if (shots) await page.screenshot({ path: `${shots}/play-${name}-1.png` });
  // Walk left via the d-pad on mobile, keyboard on desktop.
  if (name === "iphone") {
    const b = page.getByRole("button", { name: "◀" });
    const box = await b.boundingBox();
    await page.mouse.move(box.x + 10, box.y + 10);
    await page.mouse.down();
    await page.waitForTimeout(700);
    await page.mouse.up();
  } else {
    await page.keyboard.down("ArrowLeft");
    await page.waitForTimeout(700);
    await page.keyboard.up("ArrowLeft");
  }
  const moved = await pos();
  // Tap-to-move to the sign via the world API path (tap a tile on the canvas).
  const cv = page.getByTestId("overworld-canvas");
  const cb = await cv.boundingBox();
  await page.mouse.click(cb.x + cb.width * 0.5, cb.y + cb.height * 0.8);
  await page.waitForTimeout(1500);
  const tapped = await pos();
  // Warp: teleport next to the exit and walk through.
  await page.evaluate(() => { const w = window.__world; w.player = { x: 8, y: 9, facing: "down" }; w.walk = null; w.path = []; });
  await page.keyboard.down("ArrowDown");
  await page.waitForTimeout(1000);
  await page.keyboard.up("ArrowDown");
  const warped = await pos();
  const label = await page.getByTestId("map-name").innerText();
  if (shots) await page.screenshot({ path: `${shots}/play-${name}-2.png` });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  console.log(name, { start, moved, tapped, warped, label, overflow, errors });
  if (moved.x >= start.x || tapped.x === moved.x && tapped.y === moved.y || warped.map !== "route-1" || label !== "Route 1" || overflow || errors.length) failed = true;
  await ctx.close();
}
await browser.close();
process.exit(failed ? 1 : 0);
