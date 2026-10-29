# ADR 0001: In-browser C++ runtime

Status: accepted (2026-10-29, roadmap A2). Measured with the spike at `/dev/judge`.

## Context
The judge must compile and run real C++20 with real STL semantics in the browser (ARCH §2.1). Candidate: `@yowasp/clang` 22.0.0 (Clang/LLD as WebAssembly, libc++ for `wasm32-wasip1`).

## Measurements
Headless Chromium 1243 on a Linux container, static build served over localhost. Playwright's `devices["iPhone 14"]` is viewport/UA emulation only: it does **not** reproduce Safari's memory limits, so real-iPhone numbers are still unmeasured.

| Item | Result |
|---|---|
| Download | `llvm.core.wasm` 75.5 MB raw, **22.8 MB gzip**; `llvm-resources.tar` (libc++ headers + libs) 29.7 MB raw, **4.3 MB gzip**. About 27 MB over the wire with gzip (GitHub Pages serves gzip; brotli not measured). Loaded lazily, never precached. |
| Cold start (module load + first compile) | about 8.4 s on localhost (no network time) |
| Warm compile, `<bits/stdc++.h>` shim, 25-line solution | about 4.9 s at `-O2`, 5.3 s at `-O1`, 8.3 s at `-O0` (`-O0` is slowest because the output is larger). |
| Run | 6 to 18 ms for the sample, including worker start. `.wasm` output about 610 KB. |
| Exceptions | **Not supported.** `-fexceptions` fails at link time (`__cxa_throw` undefined): the bundled libc++abi has no exception support. Compile with `-fno-exceptions`; libc++ then aborts (`std::vector::at`, `stoi` on bad input become traps = RE). Harness and references must not rely on `throw`/`catch`. |
| Stack | `-Wl,-z,stack-size=64MB` links fine, but wasm call frames live on the **host** stack. In a Chromium worker, recursion of about 5,000 simple frames passes and 10,000 raises `RangeError: Maximum call stack size exceeded` (mapped to RE "stack overflow"). The flag does not help. |
| `<bits/stdc++.h>` | Missing from libc++. A shim at `public/judge/stdc++.h` (passed as a virtual `-isystem`) works; a test checks every header it names exists in the bundled libc++. |
| Memory | linear memory 1,025 pages (64 MB) for the sample. Peak browser memory for the compile worker not measured (no reliable API in headless); to measure on a real iPhone. |

## Decision
1. Use `@yowasp/clang` in a long-lived compile worker. Run each program in a fresh one-shot worker with an in-repo minimal WASI shim (stdin/stdout buffers, `proc_exit`, clocks, `random_get`), terminated on timeout.
2. Flags: `-std=c++20 -fno-exceptions -O2 -isystem <shim>`.
3. **Recursion budget:** problems must keep reference recursion depth under about 4,000 frames (or provide iterative references), and the editorial must say so when a recursive solution is natural. Test inputs for recursive problems (DFS, tree depth) are capped accordingly; hidden-test generators enforce it. Stack overflow is reported as RE with a friendly message.
4. **Mobile policy (provisional):** allow compile on iPhone behind an explicit "download about 27 MB" prompt, and fall back to ARCH §2.1 fallback (a) (cards, Parsons, cloze and Paper mode) if the module fails to instantiate. Needs a real-device check; record the result here.
5. The toolchain is copied to `public/toolchain/` by `scripts/copy-toolchain.mjs` (gitignored, run by `prebuild`, `predev` and `build:pages`) and excluded from the service-worker precache; it is cached on first use.

## Consequences
- About 5 s per compile means the Run button needs a progress state; A3 should try a precompiled header or lighter shim includes to cut warm compile time, and cache the harness.
- No exceptions: lessons about `try/catch` are taught as read-only concept cards, not judged exercises.
- Static hosting carries 105 MB of toolchain files in the Pages artifact (well under the 1 GB limit).
