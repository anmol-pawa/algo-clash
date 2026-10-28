import { describe, expect, it } from "vitest";
import manifest from "@/app/manifest";

describe("PWA manifest", () => {
  it("is a standalone app named Algo Clash", () => {
    const m = manifest();
    expect(m.name).toContain("Algo Clash");
    expect(m.display).toBe("standalone");
    expect(m.icons?.length).toBeGreaterThanOrEqual(2);
  });
});
