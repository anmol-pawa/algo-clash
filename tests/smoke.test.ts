import { describe, expect, it } from "vitest";
import manifest from "@/app/manifest";

describe("manifest", () => {
  it("is a standalone Algo Clash app", () => {
    const m = manifest();
    expect(m.short_name).toBe("Algo Clash");
    expect(m.display).toBe("standalone");
  });
});
