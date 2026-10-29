import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("C++ toolchain shim", () => {
  const shim = readFileSync("public/judge/stdc++.h", "utf8");
  const headers = [...shim.matchAll(/#include <(\w+)>/g)].map((m) => m[1]);

  it("includes only headers that the bundled libc++ ships", () => {
    const listing = execFileSync("tar", ["tf", "node_modules/@yowasp/clang/gen/llvm-resources.tar"], { maxBuffer: 1 << 28 }).toString().split("\n");
    const have = new Set(listing.filter((l) => l.startsWith("include/c++/v1/")).map((l) => l.slice("include/c++/v1/".length)));
    const missing = headers.filter((h) => !have.has(h));
    expect(missing).toEqual([]);
  });

  it("covers the headers interview solutions use", () => {
    for (const h of ["vector", "unordered_map", "map", "set", "queue", "algorithm", "numeric", "string", "iostream", "functional", "bitset", "cstdint"]) {
      expect(headers).toContain(h);
    }
  });
});
