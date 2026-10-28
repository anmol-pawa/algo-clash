import { describe, expect, it } from "vitest";
import { BITS_STDCXX, CLANG_FLAGS, SHIM_FILES } from "@/lib/judge/stdcxx";

describe("judge toolchain config", () => {
  it("ships a bits/stdc++.h shim that includes the core containers", () => {
    expect(SHIM_FILES.shim.bits["stdc++.h"]).toBe(BITS_STDCXX);
    for (const h of ["vector", "unordered_map", "queue", "algorithm"]) expect(BITS_STDCXX).toContain(`#include <${h}>`);
  });

  it("builds without exceptions (libc++abi here has no __cxa_throw) and sets the stack size", () => {
    const flags = CLANG_FLAGS(1 << 20);
    expect(flags).toContain("-fno-exceptions");
    expect(flags).not.toContain("-fexceptions");
    expect(flags).toContain("-Wl,-z,stack-size=1048576");
    expect(flags[0]).not.toMatch(/clang/);
  });
});
