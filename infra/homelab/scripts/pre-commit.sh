#!/usr/bin/env bash
# Pre-commit hook — runs local lint checks before any commit.
#
# Install:
#   ln -sf ../../infra/homelab/scripts/pre-commit.sh .git/hooks/pre-commit
#
# What it checks:
#   1. YAML autofix on staged manifests (yamlfix), re-staged after fixing

set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel)"
cd "$REPO_ROOT"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

pass() { echo -e "${GREEN}✓${NC} $1"; }
fail() { echo -e "${RED}✗${NC} $1"; }
skip() { echo -e "${YELLOW}~${NC} $1 (skipped — not installed)"; }

echo "── pre-commit checks ────────────────────────────────"

FAILED=0

# ── 1. YAML autofix ──────────────────────────────────────
STAGED_YAML=$(git diff --cached --name-only --diff-filter=ACM -- '*.yaml' '*.yml')
if [[ -n "$STAGED_YAML" ]]; then
  if command -v yamlfix &>/dev/null; then
    echo "Running yamlfix..."
    yamlfix $STAGED_YAML
    git add $STAGED_YAML
    pass "yamlfix"
  else
    skip "yamlfix  (install: pip install yamlfix)"
  fi
fi

echo "─────────────────────────────────────────────────────"

if [[ $FAILED -ne 0 ]]; then
  echo -e "${RED}Pre-commit checks failed. Commit aborted.${NC}"
  echo "To commit anyway (not recommended): git commit --no-verify"
  exit 1
fi

pass "All checks passed"
