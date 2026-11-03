// Usage: node scripts/smoke-cards.mjs <baseUrl>. Concept cards smoke: answer every card kind, wrong then right, no overflow.
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium, devices } = require("playwright");
const base = process.argv[2] ?? "http://localhost:3000";
const shots = process.env.SHOT_DIR;
const browser = await chromium.launch();
let failed = false;
const fail = (m) => { console.error("FAIL", m); failed = true; };
const SOLVED = ["#include <iostream>", "#include <vector>", "int main() {", "    std::vector<int> v = {4, 8, 15, 16};", "    long long sum = 0;", "    for (int x : v) sum += x;", '    std::cout << sum << "\\n";', "}"];
for (const [name, opts] of [["desktop", { viewport: { width: 1280, height: 800 } }], ["iphone", devices["iPhone 14"]]]) {
  const ctx = await browser.newContext(opts);
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(`${base}/dev/cards/`);
  await page.getByRole("region", { name: "Concept card" }).waitFor();
  let wrongOnce = false;
  for (let n = 0; n < 8; ++n) {
    const prompt = await page.locator("h2").first().innerText();
    const sec = page.getByRole("region", { name: "Concept card" });
    if (shots) await page.screenshot({ path: `${shots}/cards-${name}-${n}.png`, fullPage: true });
    const radios = sec.getByRole("radio");
    if (await radios.count()) {
      if (/compiler rejects|not compile/i.test(prompt) && !(await page.getByTestId("diagnostic").count())) fail("compiler card lacks diagnostic");
      // first mcq: pick a wrong one (index 0 is wrong for the header card, choice 3 never right)
      await radios.nth(wrongOnce ? 1 : 3).click();
      wrongOnce = true;
    } else if (await sec.getByRole("checkbox").count()) {
      for (const i of [0, 1, 4]) await sec.getByRole("checkbox").nth(i).click();
    } else if (await sec.locator("textarea").count()) {
      await sec.locator("textarea").fill(/Two lines/.test(prompt) ? "3\n2" : "22");
    } else if (await sec.getByLabel("blank 1").count()) {
      await sec.getByLabel("blank 1").fill("0");
      await sec.getByLabel("blank 2").fill("<");
    } else {
      for (const l of SOLVED) await sec.locator("div.grid button:not([disabled])", { hasText: l, has: page.locator(":scope") }).filter({ hasText: l }).first().click();
    }
    await sec.getByRole("button", { name: "Check" }).click();
    await page.getByTestId("feedback").waitFor();
    if (shots && n === 4) await page.screenshot({ path: `${shots}/cards-${name}-feedback.png`, fullPage: true });
    await sec.getByRole("button", { name: /Next|Finish/ }).click();
  }
  await page.getByTestId("card-results").waitFor();
  const txt = await page.getByTestId("card-results").innerText();
  if (!/\/ 8 correct/.test(txt)) fail(`unexpected results: ${txt}`);
  if (shots) await page.screenshot({ path: `${shots}/cards-${name}-results.png` });
  const over = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  if (over) fail(`${name}: horizontal overflow`);
  if (errors.length) fail(`${name}: console errors ${errors.join("|")}`);
  console.log(name, txt.replace(/\n/g, " "));
  await ctx.close();
}
await browser.close();
process.exit(failed ? 1 : 0);
