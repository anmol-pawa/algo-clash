import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { arrayAtollGym } from "@/content/gyms/r2";
import { gymConfigs } from "@/content/gyms/registry";
import { problemCatalog } from "@/content/gyms/catalog";
import { startGym } from "@/lib/gym/machine";

describe("Array Atoll gym", () => {
  const def = arrayAtollGym;
  it("has 8 blitz items (6 region + 2 review), each with exactly one answer among 4 distinct options", () => {
    expect(def.blitz).toHaveLength(8);
    expect(def.blitz.filter((b) => b.review)).toHaveLength(2);
    for (const b of def.blitz) {
      expect(b.options).toHaveLength(4);
      expect(new Set(b.options).size).toBe(4);
      expect(b.options.filter((o) => o === b.answer)).toHaveLength(1);
    }
    expect(new Set(def.blitz.map((b) => b.id)).size).toBe(8);
  });
  it("uses a medium core and a hard signature problem that exist in the catalog", () => {
    expect(problemCatalog[def.coreProblemId].meta.difficulty).toBe("M");
    expect(problemCatalog[def.signatureProblemId].meta.difficulty).toBe("H");
  });
  it("is registered with kits for both battle phases and the twist flags", () => {
    const cfg = gymConfigs.find((g) => g.def.id === def.id)!;
    expect(cfg.kits[def.coreProblemId].starter).toContain("countStretches");
    expect(cfg.kits[def.signatureProblemId].starter).toContain("poolVolume");
    expect(cfg.signatureFlags).toContain("-Wconversion");
    expect(cfg.signatureFlags).toContain("-Wno-sign-conversion");
    expect(startGym(def).phase).toBe("blitz");
  });
  it("the door on the atoll map opens this gym", () => {
    expect(readFileSync("lib/overworld/atoll.ts", "utf8")).toContain('href: "/gym/atoll/"');
  });
});
