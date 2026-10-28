import { describe, expect, it } from "vitest";
import { asset } from "@/lib/paths";

describe("asset", () => {
  it("normalises a leading slash", () => {
    expect(asset("icon.png")).toBe(asset("/icon.png"));
  });
});
