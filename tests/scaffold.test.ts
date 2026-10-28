import { describe, expect, it } from "vitest";
import manifest from "@/app/manifest";

describe("scaffold", () => {
  it("manifest is an installable standalone app", () => {
    const m = manifest();
    expect(m.display).toBe("standalone");
    expect(m.icons?.length).toBeGreaterThanOrEqual(2);
    expect(m.start_url).toBe(m.scope);
  });
});
