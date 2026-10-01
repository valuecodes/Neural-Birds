# AGENTS.md

Guidelines for AI agents and contributors working in this repo.

`CLAUDE.md` is a symlink to this file. Never edit `CLAUDE.md` directly.

---

## Structure

A single Vite + React 19 + TypeScript app. Neural Birds is a neuroevolution
simulator: TensorFlow.js networks learn to play Flappy Bird through a genetic
algorithm, with Chart.js charts of each generation.

| Path                                        | Contents                                                                   |
| ------------------------------------------- | -------------------------------------------------------------------------- |
| `src/context/`                              | React contexts (page/simulation state, options, generation data, bird IO)  |
| `src/components/main-section/simulation/`   | Canvas simulation: game rules, drawing, animation loop, genetic algorithm  |
| `src/components/main-section/simulation/*/` | Option panels, charts and the visual pages (network, bird view, tree, DNA) |
| `src/utils/`                                | Shared small components and image imports                                  |
| `public/`                                   | Static files served as-is (favicon, README screenshots, `_headers`)        |

oxlint bans `../` imports: inside `src/` use the `~/` alias (`src/*`) to go up
the tree. Files are kebab-case, components are arrow functions, and every module
uses named exports collected in one `export { … }` at the bottom.

---

## Commands

**Prerequisites:** Node.js 24.21.0 (`.nvmrc`), pnpm 12.4.2 (`packageManager` in `package.json`).

```bash
pnpm install                     # Install dependencies
pnpm dev                         # Vite dev server (port 3000)

pnpm lint                        # oxlint (type-aware)
pnpm knip                        # unused files, exports and dependencies
pnpm typecheck                   # tsc
pnpm test                        # vitest run
pnpm build                       # vite build into dist/
pnpm preview                     # serve the production build
pnpm run deploy                  # build, then wrangler deploy to Cloudflare
pnpm format                      # prettier --write .
pnpm format:check                # prettier --check . (no writes)
pnpm secrets:scan                # gitleaks over the full git history
pnpm clean                       # remove node_modules, caches and dist
```

oxlint is configured by `.oxlintrc.json` and prints nothing when there are no
findings, so silent output means clean. Knip is configured by `knip.jsonc` and
exits 0 when clean.

There is no post-edit formatting hook: run `pnpm format` yourself before committing.

`secrets:scan` runs gitleaks (`scripts/secrets-scan.sh`, version pinned there)
using a local `gitleaks` v8.19+ if one is on PATH, otherwise the pinned Docker
image. It exits 0 when clean and 1 when it finds a leak.

CI (`.github/workflows/`) runs typecheck, lint, knip, format-check, test, build,
secrets-scan and CodeQL code scanning (`javascript-typescript` and `actions`) on
push to `master` and on PRs.

### Deploy

- Cloudflare static assets: `wrangler.jsonc` serves `dist/`; `public/_headers`
  sets the CSP and cache headers. Deploys are connected in the Cloudflare
  dashboard, not CI (settings in `README.md`).
- Run the script as `pnpm run deploy`: plain `pnpm deploy` is pnpm's built-in
  `deploy` command, not the script.
- `compatibility_date` cannot be newer than the pinned workerd's date
  (`1.YYYYMMDD.x`); bump the two together.

---

## Footguns / Gotchas

1. **CSP is production-only** - `public/_headers` allows only `'self'` plus
   Cloudflare Web Analytics. Anything from another origin works under `vite dev`
   and breaks once deployed, until `_headers` allows it. Check a change with
   `pnpm build && pnpm exec wrangler dev`, which applies `_headers`.

---

## Rules

- Keep diffs tight and focused; no drive-by refactors or new tooling without discussion.
- Never commit secrets, credentials, or `.env` files. All code must be public-safe.
- Pin dependencies exactly (`.npmrc` sets `save-exact`).
- Every install enforces the supply-chain settings in `pnpm-workspace.yaml`
  (`minimumReleaseAge`, `trustPolicy: no-downgrade`) plus pnpm 12's default
  `blockExoticSubdeps`. When one fails, investigate: never disable it, and never
  exclude a whole package to get past it.
- The simulation runs in one `requestAnimationFrame` loop owned by
  `useAnimationLoop`; start and stop it only through that hook.
