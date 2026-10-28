# Algo Clash progress

Append a dated entry after every run: what changed, how it was verified (commands, screenshot notes), known gaps, what's next. Newest entries at the bottom.

## 2026-10-28: Project seeded
- Added the design set: `CLAUDE.md` (routine protocol and quality bars), `ROADMAP.md` (phases A–F), `docs/GAME_DESIGN.md`, `docs/CURRICULUM.md` and `docs/ARCHITECTURE.md`.
- Toolchain lead: `@yowasp/clang` ships libc++ headers and `libc++.a` for wasm32-wasip1 (package listing checked; nothing compiled yet). The A2 spike must measure it.
- Next: ROADMAP A1 (scaffold from Query Clash).

## 2026-10-28: A1 Scaffold from Query Clash
- Scaffolded Next.js 16 + React 19 + Pixi 8 + Tailwind 4 + CodeMirror 6 deps, PWA (manifest, `gen-sw.mjs` service worker with the worker-fragment fix, `PwaRegister`), `ci.yml` (lint, typecheck, test, build, build:pages) and `pages.yml` (basePath `/algo-clash`), vitest, eslint, `.gitignore`, README, `.routine/` lock convention.
- No Query/SQL/PGlite references carried over. Added original pixel-brace icons via `scripts/gen-icons.mjs` (dependency-free PNG encoder; `npm run icons`).
- Title screen (`/`) and placeholder `/play` render.
- Verified: `npm run lint`, `typecheck`, `test` (1 test: manifest), `build`, `build:pages` all pass. Playwright (desktop 1280×800 and iPhone 14) on the static export under `/algo-clash/`: no console errors, no horizontal overflow, manifest 200; screenshots show a readable pixel title, panel and a 44px+ START button.
- CI/Pages deploy confirmation skipped (GitHub Actions quota exhausted until 2026-11-01).
- Known gaps: `/play` is a placeholder; CodeMirror/Pixi deps are installed but unused so far; `content:verify` does not exist yet.
- Next: A2 (C++ toolchain spike with `@yowasp/clang`).

## 2026-10-28: A2 C++ toolchain spike
- `/dev/judge` page: edit C++, choose -O0/-O1/-O2, compile in a long-lived worker (`public/judge/compile-worker.mjs`, `@yowasp/clang`) and run in a fresh killable worker (`run-worker.mjs`, `@bjorn3/browser_wasi_shim`, 5 s TLE). Clang diagnostics are captured for compile errors.
- `scripts/copy-judge-assets.mjs` copies the 101 MB toolchain to gitignored `public/judge/` (`prebuild`, `prebuild:pages`, `predev`). `gen-sw.mjs` excludes it from precache and caches it on demand in `algo-clash-toolchain-v1`, which survives app updates.
- Findings recorded in `docs/adr/0001-cpp-runtime.md`: **exceptions do not link** (use `-fno-exceptions`); **recursion limit ≈ 5 000 frames** (JS engine stack, the linker stack flag does not help); ~27 MB gzip download; cold compile ~5.5 s, warm ~3.4 s, CE ~35 ms; 2×10⁸ loop iterations ≈ 160 ms. Decisions: native-only deep-recursion tests, provisional mobile policy (try, then fall back to Paper mode).
- Verified: `npm run lint`, `typecheck`, `test` (2 files, incl. new `tests/judge-assets.test.ts`), `build`, `build:pages` pass. Playwright on the static export under `/algo-clash/dev/judge/`, desktop and iPhone 14 emulation: compile ok (~5.4 s), run prints `0,1 1`, compile error shows the real clang message, no console errors, no horizontal overflow; screenshot readable with a 44px+ button.
- `content:verify` does not exist yet. CI/Pages confirmation skipped (GitHub Actions quota exhausted until 2026-11-01).
- Known gaps: **real iPhone Safari not tested** (emulation shares the desktop engine; memory with a 73 MB wasm module is unknown); no stdin/test-case harness yet; peak browser memory not measured (`performance.memory` unavailable in headless).
- Process note: this session was assigned the branch `claude/eloquent-ritchie-t0kxmq`, so work was pushed there rather than to `main`.
- Next: A3 (judge core: bits/stdc++.h shim, LC harness, verdicts, clang error table).
