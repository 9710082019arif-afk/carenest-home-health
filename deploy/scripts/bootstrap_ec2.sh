#!/usr/bin/env bash
# Deprecated standalone bootstrap — use deploy/install.sh
# Kept as a thin alias so older docs still work.
set -euo pipefail
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
exec bash "${DIR}/install.sh" "$@"
