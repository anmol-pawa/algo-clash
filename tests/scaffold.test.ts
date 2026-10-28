import { describe, expect, it } from "vitest";
import manifest from "@/app/manifest";

describe("scaffold", () => {
  it("exposes an installable PWA manifest", () => {
    const m = manifest();
    expect(m.display).toBe("standalone");
    expect(m.name).toMatch(/Algo Clash/);
    expect(m.icons?.length).toBeGreaterThanOrEqual(2);
  });
});
