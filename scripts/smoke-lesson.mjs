// Usage: node scripts/smoke-lesson.mjs <baseUrl>. Lesson smoke: read every page of every lesson, then reach the practice cards.
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
  const lessons = await page.getByRole("navigation", { name: "Lessons" }).getByRole("button").all();
  if (lessons.length < 3) fail(`expected 3 lessons, saw ${lessons.length}`);
  for (let li = 0; li < lessons.length; ++li) {
    await page.getByRole("navigation", { name: "Lessons" }).getByRole("button").nth(li).click();
    const sec = page.getByRole("region", { name: "Lesson" });
    await sec.waitFor();
    for (let n = 0; n < 6; ++n) {
      if (shots) await page.screenshot({ path: `${shots}/lesson-${name}-${li}-${n}.png`, fullPage: true });
      const btn = sec.getByRole("button", { name: /^(Next|Practice)$/ });
      const label = await btn.innerText();
      const over = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
      if (over) fail(`${name}: lesson ${li} page ${n} horizontal overflow`);
      await btn.click();
      if (label === "Practice") break;
    }
    await page.getByTestId("lesson-practice").waitFor();
    if (shots) await page.screenshot({ path: `${shots}/lesson-${name}-${li}-practice.png`, fullPage: true });
  }
  // lesson 1 page 0 shows real compiled output
  await page.getByRole("navigation", { name: "Lessons" }).getByRole("button").nth(0).click();
  const out = await page.getByTestId("lesson-output").first().innerText();
  if (!/hello, mainville/.test(out)) fail(`${name}: missing computed output: ${out}`);
  if (errors.length) fail(`${name}: console errors: ${errors.join(" | ")}`);
  await ctx.close();
}
await browser.close();
if (failed) process.exit(1);
console.log("lesson smoke ok");
