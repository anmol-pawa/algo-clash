# Algo Clash progress

Append a dated entry after every run: what changed, how it was verified (commands, screenshot notes), known gaps, what's next. Newest entries at the bottom.

## 2026-10-28: Project seeded
- Added the design set: `CLAUDE.md` (routine protocol and quality bars), `ROADMAP.md` (phases A–F), `docs/GAME_DESIGN.md`, `docs/CURRICULUM.md` and `docs/ARCHITECTURE.md`.
- Toolchain lead: `@yowasp/clang` ships libc++ headers and `libc++.a` for wasm32-wasip1 (package listing checked; nothing compiled yet). The A2 spike must measure it.
- Next: ROADMAP A1 (scaffold from Query Clash).

## 2026-10-28: A1 scaffold from Query Clash
- Added Next.js 16 + React 19 + Pixi 8 + Tailwind 4 app: title screen (`/`), an empty `/play` with a Pixi stage placeholder, `not-found`, manifest, original pixel icons (generated with a Playwright canvas script), pixel font (Tiny5), `PwaRegister` and `scripts/gen-sw.mjs` (service worker precache, worker-fragment fix kept), `ci.yml` (lint, typecheck, test, build, build:pages) and `pages.yml` (basePath `/algo-clash`), README, `.gitignore`.
- No Query/SQL/PGlite code or assets were carried over. CodeMirror and clang are added in A2/A5 when first used.
- Verified: `npm run lint`, `npm run typecheck`, `npm test` (1 test), `npm run build`, `npm run build:pages` all pass. Playwright on the static export at 1280x800 and iPhone 14: title and `/play` render, Pixi canvas draws, no console errors, no horizontal overflow, START button >= 44 px. Screenshots viewed.
- CI and Pages deploy confirmation skipped: GitHub Actions quota is exhausted until 2026-11-01.
- Note: this run's session was assigned the branch `claude/eloquent-ritchie-lrrzxu`, so work was pushed there rather than `main`. Pages deploys only from `main`, so the owner must merge it (or allow the routine to push to `main`).
- Next: A2 (C++ toolchain spike, `@yowasp/clang`).
