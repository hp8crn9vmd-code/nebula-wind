# NebulaWind — Full Repo Audit vs Master Plan

- Generated: 2025-12-25T07:39:01+00:00
- Branch: `main`
- Commit: `d934b172dbf68c43f2ce6a7c40f55b1e687a6545` (tag: `v0.2.0`)
- Node: `v20.19.0`
- npm: `10.8.2`

## 1) Quick Snapshot

### Top-level listing
```
total 644
drwxr-xr-x  16 root root   4096 Dec 25 07:33 .
drwxr-xr-x   4 root root   4096 Dec 25 07:31 ..
drwxr-xr-x   3 root root   4096 Dec 25 07:35 .astro
-rw-r--r--   1 root root    910 Dec 25 07:31 astro.config.mjs
-rw-r--r--   1 root root    310 Dec 25 07:31 CHANGELOG.md
-rw-r--r--   1 root root    286 Dec 25 07:31 CODE_OF_CONDUCT.md
drwxr-xr-x   2 root root   4096 Dec 25 07:31 content
-rw-r--r--   1 root root    347 Dec 25 07:31 CONTRIBUTING.md
drwxr-xr-x   9 root root   4096 Dec 25 07:35 dist
drwxr-xr-x   2 root root   4096 Dec 25 07:31 docs
-rw-r--r--   1 root root    188 Dec 25 07:31 .editorconfig
-rw-r--r--   1 root root     69 Dec 25 07:31 .env.example
-rw-r--r--   1 root root    799 Dec 25 07:31 eslint.config.mjs
-rw-r--r--   1 root root     51 Dec 25 07:31 .eslintignore.disabled.20251224-135820
drwxr-xr-x   8 root root   4096 Dec 25 07:31 .git
drwxr-xr-x   3 root root   4096 Dec 25 07:31 .github
-rw-r--r--   1 root root    461 Dec 25 07:31 .gitignore
drwxr-xr-x   2 root root   4096 Dec 25 07:39 .kaggle_backups
-rw-r--r--   1 root root   1056 Dec 25 07:31 LICENSE
drwxr-xr-x   2 root root   4096 Dec 25 07:36 .lighthouseci
-rw-r--r--   1 root root   1253 Dec 25 07:31 lighthouserc.cjs
drwxr-xr-x 702 root root  24576 Dec 25 07:35 node_modules
-rw-r--r--   1 root root     42 Dec 25 07:31 .npmrc
-rw-r--r--   1 root root   1918 Dec 25 07:31 package.json
-rw-r--r--   1 root root 484678 Dec 25 07:31 package-lock.json
-rw-r--r--   1 root root     81 Dec 25 07:31 postcss.config.cjs
-rw-r--r--   1 root root     36 Dec 25 07:31 .prettierignore
-rw-r--r--   1 root root    232 Dec 25 07:31 .prettierrc.cjs
-rw-r--r--   1 root root    419 Dec 25 07:31 PROJECT_STATUS.md
drwxr-xr-x   2 root root   4096 Dec 25 07:31 public
-rw-r--r--   1 root root   1479 Dec 25 07:31 README.md
drwxr-xr-x   2 root root   4096 Dec 25 07:31 scripts
drwxr-xr-x   9 root root   4096 Dec 25 07:31 src
-rw-r--r--   1 root root    619 Dec 25 07:31 tailwind.config.mjs
drwxr-xr-x   2 root root   4096 Dec 25 07:31 tests
-rw-r--r--   1 root root    322 Dec 25 07:31 tsconfig.json
drwxr-xr-x   2 root root   4096 Dec 25 07:31 .vscode
```

### package.json scripts
```
build: astro build && pagefind --site dist --silent
check: astro check
ci: npm run check && npm run lint && npm run build && npm run lhci:ci
ci:all: npm run check && npm run lint && npm run build && npm run lhci:autorun
dev: astro dev --host 0.0.0.0 --port 8000
format: prettier . --write
format:check: prettier . --check
gates: bash ./scripts/run-gates.sh
lhci:autorun: lhci autorun --upload.target=temporary-public-storage
lhci:ci: npx lhci autorun --config=./lighthouserc.cjs --upload.target=temporary-public-storage --collect.numberOfRuns=1 --chromeFlags="--no-sandbox --disable-dev-shm-usage --headless=new --disable-gpu"
lhci:kaggle: CHROME_WRAPPER_DEBUG=0 CHROME_PATH=./scripts/chrome-wrapper.sh LHCI_CHROME_PATH=./scripts/chrome-wrapper.sh LIGHTHOUSE_CHROMIUM_PATH=./scripts/chrome-wrapper.sh npx lhci autorun --config=./lighthouserc.cjs --upload.target=temporary-public-storage --collect.numberOfRuns=1
lint: eslint .
preview: astro preview --host 0.0.0.0 --port 8000
typecheck: tsc -p tsconfig.json --noEmit
```

## 2) Master Plan Checklist (weighted)

| Item | Weight | Done? |
|---|---:|:---:|
| Phase 0 — Repo bootstrap (package.json + astro config + tsconfig) | 10 | yes |
| Phase 0 — README + LICENSE + .gitignore | 5 | yes |
| Phase 1 — GitHub Actions present (.github/workflows) | 10 | yes |
| Phase 1 — CI sets up Node (setup-node) | 5 | yes |
| Phase 1 — gates script exists (npm run gates) | 10 | yes |
| Phase 2 — Docs present (src/content/docs) OR Starlight dependency | 10 | yes |
| Phase 2 — Lighthouse CI config present (lighthouserc.*) | 10 | yes |
| Phase 2 — Lint + typecheck/check scripts exist | 10 | yes |
| Phase 2 — Basic test scaffold (test script) | 5 | no |
| Phase 3 — Content collections present (src/content + config.ts/js) | 10 | yes |
| Phase 3 — Adapters layer present (src/content/adapters) | 10 | no |
| Phase 4 — Pagefind integrated | 10 | yes |
| Phase 5 — Playwright/E2E present (playwright.config.ts OR e2e dir) | 5 | no |
| Phase 5 — a11y tooling hinted (axe/pa11y/playwright) | 5 | no |
| Phase 6 — Changelog + Security + Contributing | 5 | no |

## 3) Progress Score
- Weighted completion: **90/120 = 75%**

## 4) Next Steps (as steps)
1) Close **Phase 3 (Content Layer)** بالكامل (schemas + adapters + DTO correctness + type tests).
2) Add **Pagefind** (build index + UI search + docs).
3) Add **Playwright E2E** smoke (routes critical) + a11y smoke.
4) Strengthen release discipline: CHANGELOG/SECURITY/CONTRIBUTING + v0.3.0 tag.
5) Make gates Kaggle-stable (Chrome/LHCI deterministic).
