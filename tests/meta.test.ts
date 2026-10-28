import { describe, expect, it } from "vitest";
import { GAME } from "@/lib/meta";

describe("GAME", () => {
  it("has the three-step loop", () => {
    expect(GAME.name).toBe("Algo Clash");
    expect(GAME.steps).toHaveLength(3);
  });
});
