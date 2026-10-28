# ADR 0001: In-browser C++ runtime

Status: accepted (2026-10-28, ROADMAP A2). Spike code: `scripts/spike/node-compile.mjs`, `/dev/judge`, `lib/judge/`.

## Decision
Use **`@yowasp/clang` 22.0.0** (Clang/LLD for wasm32-wasip1 with libc++) in a long-lived **module worker**, and run the produced WASI module in a **fresh worker per run** with an in-repo minimal WASI host (`lib/judge/wasi.ts`). The toolchain is copied by `scripts/copy-toolchain.mjs` into `public/toolchain/` (gitignored) next to `compile-worker.js`, so the package's `new URL("./x", import.meta.url)` asset lookups work with no bundler involvement. It is **not precached**; the service worker caches it on demand in a cache (`algo-clash-toolchain-v1`) that survives deploys.

## Measurements (this container, Chromium via Playwright; Node 22 numbers are within 10%)
| Item | Result |
|---|---|
| Package on disk | `llvm.core.wasm` 75.5 MB + `llvm-resources.tar` (libc++ headers/libs) 29.7 MB |
| Over the wire (gzip -9) | 22.7 MB + 4.2 MB ≈ **27 MB** (GitHub Pages serves gzip) |
| Cold compile (download from localhost excluded, module compile included) | 10.3–12.9 s |
| Warm compile (same worker, 60-line STL program, `-O2`) | **5.8 s** (`-O1`: 6.0 s, no real gain) |
| Output size | about 0.6 MB wasm; instantiate under 15 ms; run under 10 ms |
| Memory | Node RSS about 530 MB while the compiler is resident; JS heap in the page stays about 10 MB |
| iPhone 14 | Only Chromium *emulation* was run (same timings, so it proves layout and API compatibility, not Safari memory). **Real Safari memory is unmeasured**: ~0.5 GB resident is a risk; see the mobile policy below. |

## Findings that shape the design
- **Exceptions do not work.** `-fexceptions` compiles but fails to link (`undefined symbol: __cxa_allocate_exception / __cxa_throw`). The judge builds with `-fno-exceptions`. User code that uses `throw`/`try` gets a CE with a friendly note; the harness must never rely on exceptions, and `stoi` on bad input aborts.
- **`bits/stdc++.h` needs a shim** (`lib/judge/stdcxx.ts`, passed as `-isystem shim`). It works.
- **Stack:** `-Wl,-z,stack-size=N` takes effect (64 KB gives `memory access out of bounds`, which the judge maps to RE "stack overflow"). But a 1M-deep recursion with a 64 MB shadow stack still fails with V8 `RangeError: Maximum call stack size exceeded`: the *engine* call stack is the real limit, and it is fixed by the browser. The max safe recursion depth in a worker is still to be measured (A3), and problems must keep their recursion depth within it (or content must say "recursion depth ≤ N").
- `-O2` is kept (the same compile time as `-O1`, and runtime speed matters for TLE calibration).
- The compiler optimises simple recursion into loops, so stack tests need `volatile` locals.
- The README's `runClang` is not exported in this version; use `commands["clang++"](args, files, opts)` with **no** leading program name in `args`.

## Mobile policy (provisional)
Compile on every device, but the first compile downloads ~27 MB and takes ~10 s; show a progress bar and cache it. If real-Safari testing shows the page being killed (memory), fall back to ARCH §2.1 (a): on mobile, concept cards, Parsons and cloze stay fully playable, and coding battles use "Paper mode". A3 adds a timer-based `navigator.deviceMemory`/crash-flag check.

## Consequences / follow-ups
- A3 must build the harness without exceptions, measure max recursion depth, and calibrate time limits against ~5 s warm compile (the compile time does not count against the judge time limit; show it as "Compiling…").
- Precompiling a harness object or PCH to cut the 5.8 s warm compile is the first optimisation to try.
