import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { problemCatalog } from "../content/gyms/catalog";
import { starterFor } from "../lib/judge/starter";

const root = join(process.cwd(), "content", "problems");
const onDisk = readdirSync(root).flatMap((region) => readdirSync(join(root, region)).map((id) => ({ region, id })));

describe("problem catalog", () => {
  it("covers every problem package (run `npm run catalog:gen` if this fails)", () => {
    expect(Object.keys(problemCatalog).sort()).toEqual(onDisk.map((p) => p.id).sort());
  });
  it("embeds each statement verbatim and matches the folder region", () => {
    for (const { region, id } of onDisk) {
      expect(problemCatalog[id].statement).toBe(readFileSync(join(root, region, id, "problem.md"), "utf8"));
      expect(problemCatalog[id].meta.region).toBe(region);
    }
  });
  it("generates a starter naming the entry point for every spec", () => {
    for (const { meta } of Object.values(problemCatalog)) {
      const s = starterFor(meta.spec);
      expect(s).toContain("// TODO");
      if (meta.spec.kind === "function") expect(s).toContain(`${meta.spec.name}(`);
      else for (const m of meta.spec.methods) expect(s).toContain(`${m.name}(`);
    }
  });
  it("loads lazy tests", async () => {
    expect((await problemCatalog["run-squash"].loadTests()).length).toBeGreaterThan(5);
  });
});

describe("catalog debrief content", () => {
  it("embeds each editorial and reference verbatim, and editorials parse into house sections", async () => {
    const { parseEditorial, EDITORIAL_TITLES } = await import("../lib/journal/editorial");
    for (const { region, id } of onDisk) {
      expect(problemCatalog[id].editorial).toBe(readFileSync(join(root, region, id, "editorial.md"), "utf8"));
      expect(problemCatalog[id].reference).toBe(readFileSync(join(root, region, id, "solution.cpp"), "utf8"));
      expect(parseEditorial(problemCatalog[id].editorial).map((s) => s.title)).toEqual([...EDITORIAL_TITLES]);
    }
  });
  it("every elaborative prompt has a valid answer index and a single correct option", () => {
    for (const p of Object.values(problemCatalog)) {
      if (!p.prompt) continue;
      expect(p.prompt.options.length).toBeGreaterThanOrEqual(2);
      expect(p.prompt.answer).toBeGreaterThanOrEqual(0);
      expect(p.prompt.answer).toBeLessThan(p.prompt.options.length);
      expect(new Set(p.prompt.options).size).toBe(p.prompt.options.length);
      expect(p.prompt.explanation.length).toBeGreaterThan(10);
    }
    expect(problemCatalog["cargo-total"].prompt).toBeDefined();
  });
});
