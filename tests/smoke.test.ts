import { describe, expect, it } from "vitest";
import manifest from "@/app/manifest";

describe("scaffold", () => {
  it("manifest is a standalone app named Algo Clash", () => {
    const m = manifest();
    expect(m.short_name).toBe("Algo Clash");
    expect(m.display).toBe("standalone");
  });
});
