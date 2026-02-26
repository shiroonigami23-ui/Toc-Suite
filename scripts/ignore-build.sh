#!/usr/bin/env bash
# Netlify ignore script
# Exit 0: skip build
# Exit 1: continue with build

set -eu

if [ -z "${CACHED_COMMIT_REF:-}" ] || [ -z "${COMMIT_REF:-}" ]; then
  exit 1
fi

CHANGED="$(git diff --name-only "$CACHED_COMMIT_REF" "$COMMIT_REF" || true)"

if [ -z "$CHANGED" ]; then
  exit 0
fi

# Skip deploys for admin/student content-sync commits only.
# Any core app file change (HTML/JS/CSS/functions/config) still triggers deploy.
ALLOWED='^(Data/|automata/|submissions/|archives/|library\.json$|pda_library\.json$|moore_mealy_library\.json$|tm_library\.json$|CHANGELOG\.md$|PREVIEW\.md$|README\.md$)'

if echo "$CHANGED" | grep -qvE "$ALLOWED"; then
  exit 1
fi

echo "Only data/library/docs sync files changed; skipping Netlify deploy."
exit 0
