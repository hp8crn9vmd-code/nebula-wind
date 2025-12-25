#!/usr/bin/env bash
set -euo pipefail

detect_playwright_chrome() {
  node - <<'NODE' 2>/dev/null || true
try {
  const { chromium } = require('playwright');
  process.stdout.write(chromium.executablePath() || '');
} catch (e) {}
NODE
}

pick_chrome() {
  local cands=()
  local pw
  pw="$(detect_playwright_chrome)"
  if [ -n "${pw:-}" ]; then cands+=("$pw"); fi

  cands+=("${LHCI_CHROME_PATH:-}")
  cands+=("${LIGHTHOUSE_CHROMIUM_PATH:-}")
  cands+=("${CHROME_PATH:-}")
  cands+=("${CHROME_BIN:-}")

  cands+=("/usr/bin/google-chrome" "/usr/bin/chromium" "/usr/bin/chromium-browser")
  cands+=("/kaggle/working/nebula-wind/.cache/chrome/chrome-linux64/chrome")

  for p in "${cands[@]}"; do
    if [ -n "${p:-}" ] && [ -x "$p" ]; then
      echo "$p"
      return 0
    fi
  done
  return 1
}

CHROME_EXEC="$(pick_chrome || true)"
if [ -z "${CHROME_EXEC:-}" ]; then
  echo "❌ No Chrome executable found." >&2
  exit 1
fi

EXTRA_ARGS=()

# Kaggle runs as root => must use --no-sandbox
if [ "$(id -u)" = "0" ]; then
  EXTRA_ARGS+=("--no-sandbox" "--disable-setuid-sandbox")
fi

# Container-friendly stability flags (safe for Lighthouse)
EXTRA_ARGS+=("--disable-dev-shm-usage")

# Optional debug
if [ -n "${CHROME_WRAPPER_DEBUG:-}" ]; then
  echo "[DEBUG] CHROME_EXEC: $CHROME_EXEC" >&2
  echo "[DEBUG] EXTRA_ARGS: ${EXTRA_ARGS[*]}" >&2
  echo "[DEBUG] USER_ARGS: $*" >&2
fi

exec "$CHROME_EXEC" "${EXTRA_ARGS[@]}" "$@"
