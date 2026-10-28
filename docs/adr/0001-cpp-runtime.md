# ADR 0001: C++ runtime in the browser

Status: accepted (2026-10-28, ROADMAP A2). Spike page: `/dev/judge`; Node spike: `scripts/spike-clang.mjs`; guard test: `tests/clang-runtime.test.ts`.

## Decision
Compile and judge player code with **`@yowasp/clang` 22.0.0-git20542-10** (Clang + LLD for `wasm32-wasip1`, libc++ included), inside a long-lived compile worker; run the produced WASI module in a fresh run worker. No fallback was needed on desktop Chromium.

Required flags: `-std=c++20 -O1 -fno-exceptions -Wl,-z,stack-size=67108864`.

## Measurements
Chromium (Playwright, headless) on the cloud builder, static files from localhost. Numbers vary by machine, so treat them as orders of magnitude.

| Item | Result |
| --- | --- |
| Runtime on disk | 105 MB: `llvm.core.wasm` 73 MB, `llvm-resources.tar` (libc++ headers + libs) 29 MB |
| Over the wire (gzip -9) | about 27 MB (wasm 22.7 MB + resources 4.2 MB). GitHub Pages serves gzip |
| Cold first compile (load + instantiate + compile) | about 9.1–9.8 s desktop, about 9.1 s in iPhone 14 *emulation* (still desktop Chromium) |
| Warm compile, 60-line STL program (vector, unordered_map, priority_queue, structured bindings) | about 3.5–3.8 s at `-O1`, about 3.9–4.5 s at `-O2` |
| Output size | about 0.6 MB wasm. Run time of the sample: under 10 ms |
| Peak memory | the Node process reached about 520–560 MB RSS while compiling. Not yet measured on a real iPhone |

`-O1` and `-O2` cost about the same to compile and produce similar sizes. Use **`-O1`** for the judge (a little faster, fewer surprises). Revisit with perf-group data in A4.

## Findings that shape the design
1. **C++ exceptions do not link.** This libc++abi has no working unwinder: `throw` fails with `undefined symbol: __cxa_throw / __cxa_allocate_exception`, and libc++ headers also reference it unless compiled with `-fno-exceptions`. With `-fno-exceptions`, library errors (`vector::at`, `stoi` on bad input, `bad_alloc`) abort the program. Consequences:
   - the harness never relies on exceptions
   - `try/catch` in player code is a compile error (friendly message planned in A3: "this judge builds without exceptions; return a status instead")
   - the curriculum should teach error handling through return values here, and mention exceptions only in a concept card (CUR §2)
2. **Recursion depth is limited by the host JS stack, not by `-z stack-size`.** WebAssembly calls use the engine's native stack. In Chromium workers a non-tail-recursive function with a small frame survives about 5,000 frames and overflows (`RangeError: Maximum call stack size exceeded`) by 10,000, whatever `-z stack-size` says. (Node 24 segfaults instead of throwing at 200,000.) Consequences:
   - the run worker maps this `RangeError` to RE "stack overflow"
   - hidden tests for recursive problems keep depth at or below about 4,000 (`gen.ts` must respect it, and `content:verify` should check the reference's depth natively)
   - editorials for DFS-style problems on 10⁵ nodes teach the **iterative** version with an explicit stack
   - `-z stack-size` is still set (64 MB) because the shadow stack in linear memory holds arrays and locals
   - worth testing later: running on the main thread, or a worker with a larger stack on Safari
3. **Optimiser caveat for tests:** clang turns simple recursion into loops at `-O1`, so a stack-depth test must defeat that (see the `volatile` guard in the spike page).
4. **Linear memory:** the sample ran with 1025 pages (64 MB) after the stack-size flag. `--max-memory=1073741824` is accepted. Per-problem memory limits come in A3.
5. **Offline:** the 105 MB toolchain is **not** precached by the service worker (`scripts/gen-sw.mjs` skips `judge/clang/`); the runtime fetch handler caches it on first use. Install-time download of the toolchain stays opt-in ("Download C++ compiler for offline play").
6. **Hosting:** `scripts/copy-clang.mjs` copies the package files to `public/judge/clang/` (git-ignored) before `dev`, `build` and `build:pages`. The biggest file (73 MB) is under GitHub's 100 MB limit.

## Mobile policy
Not yet verified on real iOS Safari. The emulated run only proves the page and worker work at a phone viewport. Policy until measured on a device:
- compiled battles are enabled on every device
- if compile fails with an out-of-memory error on a device, show "this device can't build C++: switch to Paper mode" (write the code, then self-grade against the reference with a diff view)
- a real-device check is listed as a known gap and goes in the ROADMAP polish phase

## Alternatives considered
- Wasmer clang package or binji's wasm-clang: not needed, since YoWASP worked first try after the flag fixes.
- A C++ interpreter: rejected (no real STL semantics, see ARCH §2.1).
