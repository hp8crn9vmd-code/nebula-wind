#!/usr/bin/env bash
set -euo pipefail

echo "[gates] check"
npm run check

echo "[gates] lint"
npm run lint

echo "[gates] build"
npm run build

echo "[gates] lighthouse (kaggle wrapper)"
if [ "${GITHUB_ACTIONS:-}" = "true" ] || [ "${CI:-}" = "true" ]; then
  echo "[gates] lighthouse (ci)";
  npm run lhci:ci;
else
  echo "[gates] lighthouse (kaggle wrapper)";
  npm run lhci:kaggle;
fi

echo "[gates] ✅ all passed"
