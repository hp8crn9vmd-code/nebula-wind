#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

CFG="${LHCI_CONFIG:-./lighthouserc.cjs}"
RUNS="${LHCI_RUNS:-1}"

KAGGLE_CHROME="$ROOT/.cache/chrome/chrome-linux64/chrome"
WRAPPER="$ROOT/scripts/chrome-wrapper.sh"

if [[ -x "$KAGGLE_CHROME" ]]; then
  # Kaggle / root: must use wrapper to inject --no-sandbox etc.
  export CHROME_WRAPPER_DEBUG="${CHROME_WRAPPER_DEBUG:-0}"
  export CHROME_PATH="$WRAPPER"
  export LHCI_CHROME_PATH="$WRAPPER"
  export LIGHTHOUSE_CHROMIUM_PATH="$WRAPPER"
  echo "[lhci] Using Kaggle wrapper: $WRAPPER"
else
  # GitHub Actions / local: use system Chrome/Chromium (no Kaggle path available)
  CHROME_BIN="${CHROME_BIN:-}"
  if [[ -z "$CHROME_BIN" ]]; then
    for c in google-chrome google-chrome-stable chromium chromium-browser; do
      if command -v "$c" >/dev/null 2>&1; then
        CHROME_BIN="$c"
        break
      fi
    done
  fi

  if [[ -z "$CHROME_BIN" ]]; then
    echo "❌ No Chrome/Chromium found in PATH on this runner." >&2
    echo "   Set CHROME_BIN explicitly, or install chromium/google-chrome." >&2
    exit 1
  fi

  export CHROME_PATH="$CHROME_BIN"
  export LHCI_CHROME_PATH="$CHROME_BIN"
  export LIGHTHOUSE_CHROMIUM_PATH="$CHROME_BIN"
  echo "[lhci] Using system Chrome: $CHROME_BIN"
fi

npx lhci autorun \
  --config="$CFG" \
  --upload.target=temporary-public-storage \
  --collect.numberOfRuns="$RUNS"
