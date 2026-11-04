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
