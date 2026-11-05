// Usage: node scripts/smoke-hints.mjs <baseUrl>. Hint ladder smoke on /dev/arena: starter kit of 3 tokens, reveal 3 rungs, tokens persist over reload.
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
  await page.getByTestId("hint-panel").waitFor();
  await page.waitForTimeout(800);
  const panel = page.getByTestId("hint-panel");
  if (!/Hints 0\/3/.test(await panel.innerText())) fail(`${name}: expected Hints 0/3`);
  if (!/3 tokens/.test(await panel.innerText())) fail(`${name}: expected 3 tokens`);
  await panel.getByRole("button", { name: /Hints/ }).click();
  for (const rung of ["Nudge", "Approach", "Key insight"]) {
    await panel.getByRole("button", { name: new RegExp(`Reveal ${rung}`) }).click();
    await panel.getByText(`${rung}.`).waitFor();
  }
  if (!/Hints 3\/3/.test(await panel.innerText()) || !/0 tokens/.test(await panel.innerText())) fail(`${name}: after 3 hints expected 3/3 and 0 tokens`);
  if (!/will not advance your mastery/.test(await panel.innerText()) && !/whole ladder/.test(await panel.innerText())) fail(`${name}: missing ladder end text`);
  if (shots) await page.screenshot({ path: `${shots}/hints-${name}.png` });
  if (await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1)) fail(`${name}: horizontal overflow`);
  await page.reload();
  await page.getByTestId("hint-panel").waitFor();
  await page.waitForTimeout(800);
  if (!/0 tokens/.test(await page.getByTestId("hint-panel").innerText())) fail(`${name}: tokens did not persist`);
  if (errors.length) fail(`${name}: console errors ${errors.join(" | ")}`);
  await ctx.close();
}
await browser.close();
if (failed) process.exit(1);
console.log("hints smoke ok");
