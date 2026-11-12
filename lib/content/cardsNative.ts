/** Native (g++) generation and verification of concept cards (GDD §8.2). Node-only; never imported by the app. */
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fillCloze } from "../cards/grade";
import type { Card, Computed, ComputedMap } from "../cards/types";
import { CACHE_DIR } from "./native";

const ENV = { ...process.env, LC_ALL: "C" };

function sourceFile(code: string, tag: string): string {
  const dir = join(CACHE_DIR, "cards");
  mkdirSync(dir, { recursive: true });
  const key = createHash("sha256").update(code).update(tag).digest("hex").slice(0, 20);
  const file = join(dir, `${key}.cpp`);
  if (!existsSync(file)) writeFileSync(file, code);
  return file;
}

export type RunOutcome = { ok: true; stdout: string } | { ok: false; diagnostic: string };

/** Compile with g++ and run; a compile failure returns the first `error:` line as `line N: message`. */
export function runProgram(code: string): RunOutcome | { ok: false; diagnostic: string; runtime: true } {
  const src = sourceFile(code, "run");
  const bin = src.replace(/\.cpp$/, "");
  const c = spawnSync("g++", ["-std=c++20", "-O0", "-Wall", "-Wextra", "-Werror=return-type", src, "-o", bin], { encoding: "utf8", env: ENV });
  if (c.status !== 0) return { ok: false, diagnostic: firstError(c.stderr) };
  const r = spawnSync(bin, [], { encoding: "utf8", timeout: 5000, env: ENV });
  if (r.status !== 0) return { ok: false, diagnostic: `runtime exit ${r.status}`, runtime: true };
  return { ok: true, stdout: r.stdout };
}

export function firstError(stderr: string): string {
  const m = /:(\d+):\d+: error: (.*)$/m.exec(stderr);
  return m ? `line ${m[1]}: ${m[2]}` : stderr.split("\n")[0] || "unknown error";
}

/** The program a card stands for once solved (parsons: ordered lines; cloze: first fillers). */
export function solvedProgram(card: Card): string | null {
  switch (card.kind) {
    case "predict":
    case "trace":
    case "compilerError": return card.code;
    case "parsons": return card.lines.join("\n") + "\n";
    case "cloze": return fillCloze(card.template, card.blanks.map((b) => b[0]));
    default: return null;
  }
}

/** Compute native results for one card; throws a readable message if the card is broken. */
export function computeCard(card: Card): Computed {
  const code = solvedProgram(card);
  if (code === null) return {};
  const r = runProgram(code);
  if (card.kind === "compilerError") {
    if (r.ok) throw new Error(`${card.id}: code compiled but should not`);
    return { diagnostic: r.diagnostic };
  }
  if (!r.ok) throw new Error(`${card.id}: ${r.diagnostic}`);
  return { output: r.stdout };
}

/** Verify structural rules and native results. Returns error strings; with `write` stores fresh results in `generated`. */
export function verifyCards(cards: Card[], generated: ComputedMap, write = false): { errors: string[]; computed: ComputedMap } {
  const errors: string[] = [];
  const computed: ComputedMap = {};
  const ids = new Set<string>();
  for (const c of cards) {
    const e = (m: string) => errors.push(`${c.id}: ${m}`);
    if (ids.has(c.id)) e("duplicate id");
    ids.add(c.id);
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(c.id)) e("id must be kebab-case");
    if (!c.explanation.trim() || !c.prompt.trim()) e("needs prompt and explanation");
    if (c.tags.length === 0) e("needs tags");
    if (c.kind === "mcq" || c.kind === "compilerError") {
      if (c.choices.length < 2 || c.choices.length > 5) e("2-5 choices");
      if (!Number.isInteger(c.answer) || c.answer < 0 || c.answer >= c.choices.length) e("answer out of range");
      if (new Set(c.choices).size !== c.choices.length) e("duplicate choices");
    }
    if (c.kind === "multi") {
      if (c.choices.length < 3) e("needs >= 3 choices");
      if (c.answers.length === 0 || c.answers.some((a) => a < 0 || a >= c.choices.length)) e("answers out of range");
    }
    if (c.kind === "parsons" && c.lines.length < 3) e("needs >= 3 lines");
    if (c.kind === "cloze") {
      const n = (c.template.match(/___/g) ?? []).length;
      if (n === 0 || n !== c.blanks.length) e(`template has ${n} blanks but ${c.blanks.length} answer lists`);
      c.blanks.forEach((b, i) => { if (b.length === 0) e(`blank ${i} has no accepted answers`); });
    }
    try {
      const got = computeCard(c);
      if ((c.kind === "predict" || c.kind === "trace" || c.kind === "parsons" || c.kind === "cloze") && !got.output?.trim()) e("program prints nothing");
      if ((c.kind === "predict" || c.kind === "trace") && got.output !== undefined && got.output.trim().split("\n").length > 6) e("expected output too long for a card");
      if (c.kind === "cloze") {
        // every accepted alternative must produce the same output as the first
        c.blanks.forEach((alts, bi) => alts.slice(1).forEach((alt) => {
          const fills = c.blanks.map((b, j) => (j === bi ? alt : b[0]));
          const r = runProgram(fillCloze(c.template, fills));
          if (!r.ok || r.stdout !== got.output) e(`alternative "${alt}" for blank ${bi} does not behave like "${alts[0]}"`);
        }));
      }
      computed[c.id] = got;
      // Compiler wording varies between g++ patch releases, so compiler-error cards are compared by failing line only.
      const comparable = (v: Computed | null | undefined) =>
        c.kind === "compilerError" && v?.diagnostic !== undefined ? { diagnostic: /^line \d+/.exec(v.diagnostic)?.[0] ?? "" } : v ?? null;
      if (!write && JSON.stringify(comparable(generated[c.id])) !== JSON.stringify(comparable(got))) e("generated.json is stale: run `npm run content:gen`");
    } catch (err) {
      e(err instanceof Error ? err.message : String(err));
    }
  }
  return { errors, computed };
}
