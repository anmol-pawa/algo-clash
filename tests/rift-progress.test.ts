import { describe, expect, it } from "vitest";
import { applyRiftProblem, applyRoomClear, clearedRooms, planRift, riftComplete, type RiftCatalog } from "@/lib/rift";
import { newCoreSave } from "@/lib/save/schema";

const T0 = Date.parse("2026-11-04T12:00:00Z");
const catalog: RiftCatalog = {
  problems: [{ id: "a", region: "R0", difficulty: "E", prerequisites: [] }],
  cards: [...Array.from({ length: 6 }, (_, i) => ({ id: `c${i}`, region: "R0" })), { id: "bug", region: "R0", debug: true }],
};

describe("rift progress", () => {
  const plan = planRift("2026-11-04", {}, catalog, T0); // reviews and bonus empty; blitz, fresh, debug playable
  it("pays once per room, completes and advances the streak once", () => {
    let core = newCoreSave(T0);
    core = applyRoomClear(core, plan, 1);
    expect(clearedRooms(core, plan.day)).toEqual([1]);
    expect(core.profile.bits).toBe(10);
    expect(applyRoomClear(core, plan, 1)).toEqual(core);
    core = applyRoomClear(applyRoomClear(core, plan, 2), plan, 3);
    expect(riftComplete(plan, clearedRooms(core, plan.day))).toBe(true);
    expect(core.profile.streakDays).toBe(1);
    expect(core.profile.bits).toBe(10 + 25 + 15 + 25); // rooms + full-clear bonus
    expect(core.profile.xp).toBe(core.profile.bits * 2);
    const again = applyRoomClear(core, plan, 3);
    expect(again.profile).toEqual(core.profile);
  });
  it("ignores empty rooms and unknown indexes", () => {
    const core = newCoreSave(T0);
    expect(applyRoomClear(core, plan, 0)).toBe(core);
    expect(applyRoomClear(core, plan, 9)).toBe(core);
  });
  it("records problem attempts in the SRS", () => {
    const core = applyRiftProblem(newCoreSave(T0), "a", true, T0, 100, 600);
    expect(core.mastery.a.solves).toBe(1);
  });
});
