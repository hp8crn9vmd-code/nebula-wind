#!/usr/bin/env bash
set -euo pipefail

# NebulaWind Chrome wrapper for LHCI/CI:
# - Only split comma-joined FLAGS when pattern contains ",--"
#   (e.g. "--no-sandbox,--disable-dev-shm-usage")
# - DO NOT split regular comma usage (e.g. "--disable-features=A,B,C")
# - Strip positional target "about:blank" if present (defensive)

sanitize_argv() {
  local out=() a
  for a in "$@"; do
    # Defensive: drop about:blank if LHCI passes it as a positional target
    if [[ "$a" == "about:blank" ]]; then
      continue
    fi

    # Split only comma-joined flags (contains ,--)
    if [[ "$a" == --* && "$a" == *",--"* ]]; then
      # turn commas into spaces then split
      # shellcheck disable=SC2206
      local parts=( ${a//,/ } )
      out+=( "${parts[@]}" )
    else
      out+=( "$a" )
    fi
  done
  printf "%s\n" "${out[@]}"
}

detect_chrome() {
  # Prefer Playwright chromium
  if command -v node >/dev/null 2>&1; then
    node - <<'NODE' 2>/dev/null && exit 0 || true
try {
  const p = require('playwright');
  const exe = p.chromium.executablePath();
  if (exe && typeof exe === 'string') {
    process.stdout.write(exe);
    process.exit(0);
  }
} catch (e) {}
process.exit(1);
NODE
  fi

  for c in google-chrome-stable google-chrome chromium-browser chromium chrome; do
    if command -v "$c" >/dev/null 2>&1; then
      command -v "$c"
      exit 0
    fi
  done
  return 1
}

CHROME_BIN="${CHROME_BIN:-}"
if [[ -z "${CHROME_BIN}" ]]; then
  if ! CHROME_BIN="$(detect_chrome)"; then
    echo "❌ Could not detect a Chrome/Chromium binary." >&2
    exit 127
  fi
fi

mapfile -t NW_ARGS < <(sanitize_argv "$@")

if [[ "${CHROME_WRAPPER_DEBUG:-0}" == "1" ]]; then
  echo "[chrome-wrapper] CHROME_BIN=$CHROME_BIN" >&2
  echo "[chrome-wrapper] argv (${#NW_ARGS[@]}):" >&2
  for a in "${NW_ARGS[@]}"; do echo "  $a" >&2; done
fi

exec "$CHROME_BIN" "${NW_ARGS[@]}"
