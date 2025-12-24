# NebulaWind

A clean-room, production-ready starter built from scratch.

> Inspired by AstroWind (attribution-only; no code/assets reused).

## Status
Generated on: 2025-12-24 11:15:49 UTC  
This repository skeleton is created inside Kaggle at: `/kaggle/working/nebula-wind`

## Goals
- Design system with tokens + theming
- Type-safe content layer + adapters
- Local search (Pagefind)
- Docs-ready (Starlight or alternative)
- Quality gates (lint/typecheck/tests/e2e/Lighthouse CI)
- Advanced SEO & A11y
- Rich widget library

## Quick Start (later steps)
This skeleton will be turned into a fully runnable Astro + Tailwind project in upcoming steps.

## Attribution
Inspired by AstroWind: https://github.com/arthelokyo/astrowind

## Lighthouse CI (Performance/A11y/SEO)
- In Kaggle: LHCI may fail because **Chrome is not installed** in the runtime image.
- In GitHub Actions: CI installs Chrome and runs Lighthouse CI automatically via `npm run ci:all`.

## Kaggle Lighthouse CI

Kaggle runs as `root`, so Chrome must be launched with `--no-sandbox`.
This repo includes a small wrapper used by the `lhci:kaggle` script:

- `scripts/chrome-wrapper.sh` ensures `--no-sandbox` and `--disable-dev-shm-usage`
- Optional debug logging:
  - `CHROME_WRAPPER_DEBUG=1 npm run lhci:kaggle`
  - Logs: `/tmp/chrome-wrapper-args.log`

### The three commands (in order)

```bash
npm run check
npm run lint
npm run gates
```

- `npm run gates` runs: check → lint → build → lhci:kaggle.
