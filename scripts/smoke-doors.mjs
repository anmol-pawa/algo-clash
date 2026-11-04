// Usage: node scripts/smoke-doors.mjs <baseUrl>. Walks Mainville's doors and checks they open the Forge and the Gym.
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium, devices } = require("playwright");
const base = process.argv[2] ?? "http://localhost:3000";
const dir = process.env.SHOT_DIR ?? ".";
const browser = await chromium.launch();
let bad = 0;
for (const [name, opts] of [["desktop", { viewport: { width: 1280, height: 800 } }], ["iphone", devices["iPhone 14"]]]) {
  for (const [door, keys, path] of [["forge", ["ArrowUp"], "/forge"], ["gym", ["ArrowDown", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowLeft", "ArrowLeft", "ArrowUp"], "/gym"]]) {
    const ctx = await browser.newContext(opts);
    const page = await ctx.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(String(e)));
    await page.goto(`${base}/play/`);
    await page.waitForTimeout(1500);
    if (door === "gym") await page.screenshot({ path: `${dir}/doors-${name}.png` });
    for (const k of keys) { await page.keyboard.down(k); await page.waitForTimeout(80); await page.keyboard.up(k); await page.waitForTimeout(420); }
    await page.waitForTimeout(1200);
    const ok = page.url().includes(path);
    console.log(name, door, ok ? "ok" : "FAIL " + page.url(), errors.length ? errors : "");
    if (!ok || errors.length) bad++;
    await ctx.close();
  }
}
await browser.close();
process.exit(bad ? 1 : 0);
