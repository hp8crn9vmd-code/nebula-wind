#!/usr/bin/env bash
set -euo pipefail
REAL_CHROME="/kaggle/working/nebula-wind/.cache/chrome/chrome-linux64/chrome"
LOG="/tmp/chrome-wrapper-args.log"
DEBUG_LOG="${CHROME_WRAPPER_DEBUG:-0}"
REQ_FLAGS=(--no-sandbox --disable-dev-shm-usage)

append_unique() {
  local x="$1"
  for y in "${FINAL_ARGS[@]}"; do
    [[ "$y" == "$x" ]] && return 0
  done
  FINAL_ARGS+=("$x")
}

CLEANED=()
for a in "$@"; do
  # fix broken headless token
  if [[ "$a" == --headless=* && "$a" == *","* ]]; then
    a="${a%%,*}"
  fi

  # split only comma-bundled flags (contains ,--)
  if [[ "$a" == --* && "$a" == *",--"* ]]; then
    IFS=',' read -r -a parts <<< "$a"
    for p in "${parts[@]}"; do
      [[ "$p" == --* ]] && CLEANED+=("$p")
    done
  else
    CLEANED+=("$a")
  fi
done

FINAL_ARGS=()
for f in "${REQ_FLAGS[@]}"; do
  append_unique "$f"
done

for a in "${CLEANED[@]}"; do
  case "$a" in
    --no-sandbox|--disable-dev-shm-usage) ;;
    *) append_unique "$a" ;;
  esac
done

if [[ -n "${CHROME_WRAPPER_EXTRA_FLAGS:-}" ]]; then
  # shellcheck disable=SC2206
  EXTRA_ARR=(${CHROME_WRAPPER_EXTRA_FLAGS})
  for a in "${EXTRA_ARR[@]}"; do
    append_unique "$a"
  done
fi

if [[ "$DEBUG_LOG" == "1" ]]; then
  {
    echo "---- $(date -Is) ----"
    echo "UID=$(id -u) GID=$(id -g) PWD=$(pwd)"
    echo "REAL=$REAL_CHROME"
    echo "ORIG: $0 $*"
    echo "FINAL: $REAL_CHROME ${FINAL_ARGS[*]}"
    echo
  } >> "$LOG"
fi

exec "$REAL_CHROME" "${FINAL_ARGS[@]}"
