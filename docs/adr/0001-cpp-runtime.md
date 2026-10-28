# ADR 0001: In-browser C++ runtime

Status: accepted (2026-10-28). Spike: ROADMAP A2, `/dev/judge`.

## Context
The game judges hand-written C++ against hidden tests in the browser (ARCH §2). The candidate is `@yowasp/clang` 22.0.0-git20542-10 (Clang/LLD as WASM, target `wasm32-wasip1`, libc++ included) plus a WASI shim (`@bjorn3/browser_wasi_shim`) to run the produced module.

## Measurements
Headless Chromium (Playwright), static export served locally, desktop 1280×800 and `devices["iPhone 14"]` (an emulation: the same desktop engine, so timings and memory are **not** an iPhone measurement). Program: ~25-line STL solution (`vector`, `unordered_map`, `map`, `string`, `sort`, `iostream`), `-std=c++20 -fno-exceptions`.

| Item | Result |
|---|---|
| Toolchain on disk | 101 MB in `out/judge/` (`llvm.core.wasm` 73 MB, `llvm-resources.tar` 29 MB incl. libc++ headers and `libc++.a`) |
| Over the wire | gzip -9: ≈ 22.7 MB (core wasm) + 4.2 MB (resources) ≈ **27 MB**. GitHub Pages serves gzip; no brotli |
| Cold compile (incl. fetch from localhost, wasm compile) | 5.4–6.0 s |
| Warm compile, `-O2` / `-O1` | ≈ 3.4 s / ≈ 3.0 s |
| Syntax error (CE) | ≈ 35 ms, full clang diagnostics captured |
| Output module | ≈ 0.6 MB |
| Run, 2×10⁸ simple loop iterations at `-O2` | ≈ 160 ms |
| Node peak RSS during a compile | ≈ 500–590 MB |
| Exceptions | **Do not work.** `-fexceptions` fails to link (`__cxa_allocate_exception`, `__cxa_throw` undefined: no libc++abi exception runtime for wasip1). Compile with `-fno-exceptions`; `throw`/`try` in user code is a CE-style failure; `vector::at` out of range aborts instead of throwing |
| `-Wl,-z,stack-size=64M` | Accepted by the linker, but **the effective limit is the JS engine call stack**, not the linear-memory stack. Recursion trapped with `RangeError: Maximum call stack size exceeded` between depth 5 000 and 8 000 (a frame with a 64-byte local array, `-O2`) in a Chromium worker |
| `<bits/stdc++.h>` | Absent from libc++; the A3 shim must provide it |

## Decision
1. Use `@yowasp/clang` + `@bjorn3/browser_wasi_shim`. Assets are copied to `public/judge/` by `scripts/copy-judge-assets.mjs` (generated, gitignored), loaded as plain static module workers, excluded from the service-worker precache, and cached on demand in a separate `algo-clash-toolchain-v1` cache that survives app updates (offline play after first use).
2. A long-lived **compile worker** (clang kept warm) and a **fresh run worker per run**, killed with `terminate()` on timeout.
3. User code is always compiled with `-fno-exceptions`. The harness must never rely on exceptions. The learner-facing curriculum covers exceptions as a lesson/card topic only (predict-output cards are generated natively with g++); judged problems never require `try/catch`.
4. Default `-O2`: the compile time barely differs from `-O1`, and run speed matters for the perf group.
5. **Recursion depth budget in the browser is about 5 000 frames.** Hidden tests that need deeper recursion (e.g. a 10⁵-node chain tree with a recursive DFS) cannot be judged in the browser. Rule for A3/A4: each problem's hidden tests carry a `maxRecursionDepth`; tests are generated so the *reference* stays within ~3 000 frames in browser mode, and deep-chain variants are marked `native-only` (verified by `content:verify`, and used in the editorial as "why iterative / why this matters"). Re-measure if we find a way to raise the stack (e.g. a Worker with a larger stack, or JSPI-based stack switching).
6. Time limits follow ARCH §2.2 (`max(1000, 3 × reference WASM time)`); with ~3.4 s warm compile, the UI must show a compile progress state and "Run" on visible tests should reuse the compiled module for all test inputs (one compile per attempt).

## Mobile policy (provisional)
Real iPhone Safari is **unverified**: a 73 MB wasm module plus ~500 MB working memory may exceed Safari's tab limits. A3 must feature-detect failure (instantiate error or worker crash) and fall back to ARCH §2.1 fallback (a) "Paper mode" (write code, self-grade against the reference), with cards/Parsons/cloze unaffected. The owner should test `/dev/judge` on a physical iPhone and report the result; until then mobile is "try, then degrade gracefully".

## Consequences
- ~27 MB first-use download on the first compiled battle; show it plainly and cache.
- Compile ≈ 3–6 s per attempt: battles are turn-based, so acceptable, but the "Judge" animation should cover it.
- No exception semantics in judged code; a curriculum note (CUR §2) must say so.
- Fallback b (another WASM clang) was not needed.
