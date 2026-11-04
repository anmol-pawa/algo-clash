// Usage: node scripts/tour.mjs <baseUrl>. Screenshot tour of the player-facing screens (SHOT_DIR) at desktop and iPhone 14, reporting console errors and horizontal overflow.
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium, devices } = require("playwright");
const base = process.argv[2] ?? "http://localhost:3000";
const dir = process.env.SHOT_DIR ?? ".";
const routes = ["", "play", "learn", "forge", "gym", "dev/lesson", "dev/cards", "dev/problem", "dev/sprites"];
const browser = await chromium.launch();
let bad = 0;
for (const [name, opts] of [["desktop", { viewport: { width: 1280, height: 800 } }], ["iphone", devices["iPhone 14"]]]) {
  const ctx = await browser.newContext(opts);
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(String(e)));
  for (const r of routes) {
    await page.goto(`${base}/${r}${r ? "/" : ""}`);
    await page.waitForTimeout(1500);
    const ov = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (ov > 1) { console.log(`OVERFLOW ${name} /${r} by ${ov}px`); bad++; }
    await page.screenshot({ path: `${dir}/${name}-${r.replace("/", "_") || "title"}.png` });
  }
  if (errors.length) { console.log(name, "errors:", [...new Set(errors)]); bad++; }
}
await browser.close();
process.exit(bad ? 1 : 0);
