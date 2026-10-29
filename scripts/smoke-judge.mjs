// Browser smoke test for the judge: node scripts/smoke-judge.mjs <baseUrl>, e.g. http://localhost:3000
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = (() => { try { return require("playwright"); } catch { return require(require.resolve("playwright", { paths: [process.env.PLAYWRIGHT_DIR ?? "/opt/node22/lib/node_modules"] })); } })();

const base = process.argv[2] ?? "http://localhost:3000";
const browser = await chromium.launch();
const page = await browser.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));
await page.goto(`${base}/dev/judge/`);

async function verdict(id) {
  await page.click(id);
  await page.waitForFunction(() => /verdict /.test(document.querySelector("#log")?.textContent ?? ""), null, { timeout: 120000 });
  const text = await page.textContent("#log");
  await page.evaluate(() => { document.querySelector("#log").textContent = ""; });
  return text;
}

const ac = await verdict("#judge-ac");
const wa = await verdict("#judge-wa");
const ce = await verdict("#judge-ce");
console.log(ac.split("\n")[0], "|", wa.split("\n")[0], "|", ce.split("\n")[0]);
console.log(ce.split("\n").find((l) => l.startsWith("first error")));
const ok = ac.startsWith("verdict AC") && wa.startsWith("verdict WA failedAt=1") && ce.startsWith("verdict CE") && errors.length === 0;
await browser.close();
if (!ok) { console.error("SMOKE FAILED", errors); process.exit(1); }
console.log("smoke OK");
