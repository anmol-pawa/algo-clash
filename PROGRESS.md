# Algo Clash progress

Append a dated entry after every run: what changed, how it was verified (commands, screenshot notes), known gaps, what's next. Newest entries at the bottom.

## 2026-10-28: Project seeded
- Added the design set: `CLAUDE.md` (routine protocol and quality bars), `ROADMAP.md` (phases A–F), `docs/GAME_DESIGN.md`, `docs/CURRICULUM.md` and `docs/ARCHITECTURE.md`.
- Toolchain lead: `@yowasp/clang` ships libc++ headers and `libc++.a` for wasm32-wasip1 (package listing checked; nothing compiled yet). The A2 spike must measure it.
- Next: ROADMAP A1 (scaffold from Query Clash).

## 2026-10-28: A1 scaffold
- Scaffolded Next.js 16 + React 19 + Pixi 8 + Tailwind 4 from Query Clash: PWA (manifest, `gen-sw.mjs` service worker, worker-fragment fix), `ci.yml` + `pages.yml`, basePath `/algo-clash`, eslint/vitest config, `.gitignore`. All Query/SQL/PGlite references removed.
- Title screen (`/`) and placeholder `/play` (Mainville). Pixel font + `.panel` / `.btn-pixel` (48px) UI primitives. One unit test.
- Verified: `npm run lint`, `typecheck`, `test`, `build`, `build:pages` all pass. Playwright desktop + iPhone 14: no horizontal overflow on `/` or `/play`; title screenshot looks right. The only console 404s came from my testing the static (basePath) build with `next start`, not from the app.
- Gaps: app/PWA icons are still the Query Clash placeholders (replace in B1); CI/Pages confirmation skipped (Actions quota exhausted). Pushed to the session branch `claude/eloquent-ritchie-y4zxs3` rather than `main`, as the session required, so the Pages deploy will not run until it is merged to `main`.
- Next: A2 (C++ toolchain spike).
