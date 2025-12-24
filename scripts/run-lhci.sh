#!/usr/bin/env bash
set -euo pipefail

# Always run from repo root
cd "$(dirname "$0")/.."

# Kaggle usually runs as root, so use wrapper + no-sandbox
if [[ "${KAGGLE_KERNEL_RUN_TYPE:-}" != "" || "$(id -u)" == "0" ]]; then
  export CHROME_PATH=./scripts/chrome-wrapper.sh
  export LHCI_CHROME_PATH=./scripts/chrome-wrapper.sh
  export LIGHTHOUSE_CHROMIUM_PATH=./scripts/chrome-wrapper.sh
else
  # On GitHub Actions, Chrome typically exists as google-chrome
  export CHROME_PATH="${CHROME_PATH:-google-chrome}"
fi

npx lhci autorun --config=./lighthouserc.cjs --upload.target=temporary-public-storage --collect.numberOfRuns=1
