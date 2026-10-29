// Browser smoke test for the judge: node scripts/smoke-judge.mjs <baseUrl> (static export served at /algo-clash/).
// Judges the two-sum sample on /dev/judge in desktop Chromium and iPhone 14 emulation.
import { createRequire } from "node:module";
import { execSync } from "node:child_process";

// Playwright is preinstalled globally (never `playwright install`), not a repo dependency.
const require = createRequire(import.meta.url);
const { chromium, devices } = require(require.resolve("playwright", { paths: [process.cwd(), execSync("npm root -g").toString().trim()] }));

const base = process.argv[2] ?? "http://localhost:4173/algo-clash";
const GOOD = `class Solution { public: vector<int> twoSum(vector<int>& nums, int target) { unordered_map<int,int> m; for (int i = 0; i < (int)nums.size(); ++i) { auto it = m.find(target - nums[i]); if (it != m.end()) return {it->second, i}; m[nums[i]] = i; } return {}; } };`;
const BAD = GOOD.replace("m[nums[i]] = i;", ""); // never remembers anything: returns {}
const BROKEN = GOOD.replace("return {};", "return nope;");
const CASES = [[GOOD, /verdict AC/], [BAD, /verdict WA/], [BROKEN, /verdict CE[\s\S]*first error/]];
let failed = false;

for (const [name, ctx] of [["desktop", {}], ["iphone14", devices["iPhone 14"]]]) {
  const browser = await chromium.launch();
  const page = await (await browser.newContext(ctx)).newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await page.goto(`${base}/dev/judge/`);
  for (const [i, [code, want]] of CASES.entries()) {
    if (name === "iphone14" && i > 0) break; // one compile is enough for the mobile check
    await page.getByLabel("source").fill(code);
    await page.locator("#judge").click();
    await page.waitForFunction(() => /^verdict/.test(document.querySelector("#log")?.textContent ?? ""), null, { timeout: 120000 });
    const log = await page.locator("#log").textContent();
    const ok = want.test(log);
    console.log(`${name} case ${i}: ${ok ? "ok" : "FAIL"}\n${log}`);
    if (!ok) failed = true;
  }
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
  if (overflow) { console.log(`${name}: horizontal overflow`); failed = true; }
  if (errors.length) { console.log(`${name}: console errors`, errors); failed = true; }
  await page.screenshot({ path: process.env.SHOT_DIR ? `${process.env.SHOT_DIR}/judge-${name}.png` : undefined });
  await browser.close();
}
process.exit(failed ? 1 : 0);
