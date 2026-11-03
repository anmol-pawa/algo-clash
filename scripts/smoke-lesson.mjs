// Usage: node scripts/smoke-lesson.mjs <baseUrl>. Lesson smoke: Next is locked until the recall check is solved; walk all screens.
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
  await page.goto(`${base}/dev/lesson/`);
  await page.getByRole("article").waitFor();
  const next = page.getByRole("button", { name: /^(Next|Finish lesson)$/ });
  const answers = [1, 2, 2, 1, 1, 1];
  for (let i = 0; i < answers.length; ++i) {
    if (!(await next.isDisabled())) fail(`${name}: screen ${i} Next should be locked`);
    const radios = page.getByTestId("recall").getByRole("radio");
    await radios.nth((answers[i] + 1) % 4).click(); // wrong first
    await page.getByTestId("recall-wrong").waitFor();
    if (!(await next.isDisabled())) fail(`${name}: wrong answer unlocked Next`);
    await radios.nth(answers[i]).click();
    await page.getByTestId("recall-right").waitFor();
    if (shots) await page.screenshot({ path: `${shots}/lesson-${name}-${i}.png`, fullPage: true });
    if (i === 2 && !(await page.getByTestId("run-output").innerText()).includes("1e+09")) fail("missing computed output");
    await next.click();
  }
  await page.getByTestId("lesson-done").waitFor();
  const over = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  if (over) fail(`${name}: horizontal overflow`);
  if (errors.length) fail(`${name}: console errors ${errors.join("; ")}`);
  await ctx.close();
}
await browser.close();
if (failed) process.exit(1);
console.log("lesson smoke ok");
