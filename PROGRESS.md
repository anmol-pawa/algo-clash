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
