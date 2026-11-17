// Usage: node scripts/smoke-spire-world.mjs <baseUrl>. Starts at the atoll's west shore, walks into Stackspire, screenshots it, walks back.
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium, devices } = require("playwright");
const base = process.argv[2] ?? "http://localhost:3000";
const dir = process.env.SHOT_DIR ?? ".";
const browser = await chromium.launch();
let bad = 0;
const step = async (page, k) => { await page.keyboard.down(k); await page.waitForTimeout(80); await page.keyboard.up(k); await page.waitForTimeout(450); };
for (const [name, opts] of [["desktop", { viewport: { width: 1280, height: 800 } }], ["iphone", devices["iPhone 14"]]]) {
  const ctx = await browser.newContext(opts);
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.addInitScript(() => sessionStorage.setItem("algo-clash.world", JSON.stringify({ map: "array-atoll", x: 1, y: 8 })));
  await page.goto(`${base}/play/`);
  await page.waitForTimeout(1200);
  await step(page, "ArrowLeft");
  await page.waitForTimeout(900);
  const inSpire = (await page.locator("body").innerText()).includes("Stackspire");
  await page.screenshot({ path: `${dir}/spire-world-${name}.png` });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  console.log(name, "spire", inSpire ? "ok" : "FAIL", "overflow", overflow, errors.length ? errors : "");
  if (!inSpire || overflow || errors.length) bad++;
  await step(page, "ArrowLeft");
  await page.waitForTimeout(900);
  const back = (await page.locator("body").innerText()).includes("Array Atoll");
  console.log(name, "back to atoll", back ? "ok" : "FAIL");
  if (!back) bad++;
  await ctx.close();
}
await browser.close();
process.exit(bad ? 1 : 0);
