import { describe, expect, it } from "vitest";
import { WASI } from "node:wasi";

// Guards the A2 findings (docs/adr/0001-cpp-runtime.md): the wasm32-wasip1 libc++
// build links only with -fno-exceptions, and compiled programs run under WASI.
const FLAGS = ["-std=c++20", "-O1", "-fno-exceptions", "-Wl,-z,stack-size=67108864"];
const SRC = `#include <iostream>
#include <map>
#include <string>
#include <vector>
int main() {
  std::map<std::string, std::vector<int>> m;
  m["a"].push_back(7);
  std::cout << m["a"][0] << "\\n";
}
`;

describe("@yowasp/clang runtime", () => {
  it("compiles STL code with -fno-exceptions and runs it", async () => {
    const { commands } = await import("@yowasp/clang");
    const files = await commands["clang++"]!([...FLAGS, "main.cpp", "-o", "main.wasm"], { "main.cpp": SRC });
    const wasm = (files as Record<string, Uint8Array>)["main.wasm"];
    expect(wasm.length).toBeGreaterThan(1000);
    const wasi = new WASI({ version: "preview1", returnOnExit: true });
    const inst = await WebAssembly.instantiate(await WebAssembly.compile(new Uint8Array(wasm)), wasi.getImportObject() as WebAssembly.Imports);
    expect(wasi.start(inst)).toBe(0);
  }, 120_000);

  it("rejects code that needs C++ exceptions at link time", async () => {
    const { commands } = await import("@yowasp/clang");
    const stderr: string[] = [];
    const src = `int main() { try { throw 1; } catch (int) { return 1; } }`;
    await expect(
      commands["clang++"]!([...FLAGS.filter((f) => f !== "-fno-exceptions"), "main.cpp", "-o", "main.wasm"], { "main.cpp": src }, {
        stderr: (b) => b && stderr.push(new TextDecoder().decode(b)),
      }),
    ).rejects.toThrow();
    expect(stderr.join("")).toContain("__cxa_throw");
  }, 120_000);
});
