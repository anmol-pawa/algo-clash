# Algo Clash progress

Append a dated entry after every run: what changed, how it was verified (commands, screenshot notes), known gaps, what's next. Newest entries at the bottom.

## 2026-10-28: Project seeded
- Added the design set: `CLAUDE.md` (routine protocol and quality bars), `ROADMAP.md` (phases A–F), `docs/GAME_DESIGN.md`, `docs/CURRICULUM.md` and `docs/ARCHITECTURE.md`.
- Toolchain lead: `@yowasp/clang` ships libc++ headers and `libc++.a` for wasm32-wasip1 (package listing checked; nothing compiled yet). The A2 spike must measure it.
- Next: ROADMAP A1 (scaffold from Query Clash).

## 2026-10-28: A1 scaffold
- Scaffolded from Query Clash: Next.js 16 + React 19 + Pixi 8 + Tailwind 4 config, PWA (`PwaRegister`, `scripts/gen-sw.mjs` with the worker-fragment fix), `ci.yml` + `pages.yml` (basePath `/algo-clash`), pixel font setup, manifest, `.gitignore`, README. No Query/SQL/PGlite code was carried over.
- New title screen (`/`) and an empty `/play` placeholder, plus a manifest smoke test.
- Verified: `npm run lint`, `typecheck`, `test` (1 passing), `build`, `build:pages` (sw.js precaches 59 files). Playwright at desktop 1280x800 and iPhone 14: both pages render, no console errors, no horizontal overflow; screenshots looked right (pixel title, panel, tap-sized START button).
- CI and Pages deploy confirmation skipped: GitHub Actions quota is exhausted until 2026-11-01.
- Known gaps: app icons (`icon.png`, `apple-icon.png`, `public/icon-*.png`) are still Query Clash's placeholders and need original Algo Clash art; no pixel sprite engine yet.
- Next: A2 (C++ toolchain spike with `@yowasp/clang`).
