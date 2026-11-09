// Usage: node scripts/smoke-modes.mjs <baseUrl>. Scaffolding-mode smoke on /dev/arena: picker, Guided free hints, Interview hides hints and locks the picker after a Run.
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
  const picker = page.getByTestId("mode-picker");
  await picker.waitFor();
  if ((await picker.getByRole("radio", { checked: true }).innerText()) !== "Standard") fail(`${name}: default mode not Standard`);
  await picker.getByRole("radio", { name: "Guided" }).click();
  await page.getByTestId("hint-panel").getByText("free").waitFor();
  if (shots) await page.screenshot({ path: `${shots}/modes-guided-${name}.png` });
  await picker.getByRole("radio", { name: "Interview" }).click();
  if (await page.getByTestId("hint-panel").count()) fail(`${name}: hints visible in Interview`);
  if (!/6 runs/.test(await page.getByTestId("mode-blurb").innerText())) fail(`${name}: Interview blurb`);
  await page.getByRole("button", { name: /Run \(6 left\)/ }).waitFor();
  if (shots) await page.screenshot({ path: `${shots}/modes-interview-${name}.png` });
  await page.reload();
  await page.getByTestId("mode-picker").waitFor();
  await page.waitForTimeout(300);
  if ((await page.getByTestId("mode-picker").getByRole("radio", { checked: true }).innerText()) !== "Interview") fail(`${name}: mode did not persist`);
  if (await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1)) fail(`${name}: horizontal overflow`);
  if (errors.length) fail(`${name}: console errors ${errors.join(" | ")}`);
  await ctx.close();
}
await browser.close();
if (failed) process.exit(1);
console.log("modes smoke ok");
