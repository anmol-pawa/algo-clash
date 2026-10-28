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
- Added `@yowasp/clang`, `scripts/copy-clang.mjs` (copies the 105 MB runtime to git-ignored `public/judge/clang/` before dev/build/build:pages), a `/dev/judge` page with `public/judge/spike-worker.js` (compile in a worker, run with a minimal WASI shim), `scripts/spike-clang.mjs` (Node variant), `tests/clang-runtime.test.ts` (compiles and runs STL code; asserts exceptions fail to link), `docs/adr/0001-cpp-runtime.md`. The service worker no longer precaches `judge/clang/`; eslint ignores `public/**`.
- Findings (details and numbers in the ADR): works in Chromium with `-std=c++20 -O1 -fno-exceptions`; **`throw` does not link** (libc++abi has no unwinder); **recursion depth caps near 5,000 frames** (host JS stack, not `-z stack-size`); cold compile about 9 s, warm about 3.7 s; about 27 MB gzip; `-O2` is no faster to compile than `-O1`.
- Verified: `npm run lint`, `typecheck`, `test` (3 tests, about 5 s), `build`, `build:pages` all pass. Playwright on the dev server, desktop 1280×800 and iPhone 14 emulation: all runs compile and execute, no console errors; the screenshot shows the result log readable (a dev page). Real iOS Safari is **not** measured.
- Pushed to the designated branch `claude/eloquent-ritchie-26snp0` (session branch rule) rather than `main`.
- CI/Pages deploy confirmation skipped (GitHub Actions quota exhausted until 2026-11-01).
- Known gaps: no real-device iPhone numbers; peak browser memory not measured (Node RSS only); static-export offline caching of the toolchain not exercised; the `/dev/judge` page is a throwaway spike that A3 replaces.
- Next: A3 (judge core: compile/run workers, LC harness, verdicts, friendly clang errors).
