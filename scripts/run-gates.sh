#!/usr/bin/env bash
set -euo pipefail

echo "[gates] check"
npm run check

echo "[gates] lint"
npm run lint

echo "[gates] build"
npm run build

echo "[gates] lighthouse (kaggle wrapper)"
npm run lhci:kaggle

echo "[gates] ✅ all passed"
