#!/usr/bin/env bash
# Pre-push hook — runs local CI checks before any push.
#
# Install:
#   ln -sf ../../infra/homelab/scripts/pre-push.sh .git/hooks/pre-push
#
# What it checks:
#   1. Python tests (pytest tests/)
#   2. YAML lint on homelab manifests (yamllint)
#
# kubectl dry-run is skipped locally — it runs in GitHub Actions instead.

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

echo "── pre-push checks ──────────────────────────────────"

FAILED=0

# ── 1. Python tests ─────────────────────────────────────
if command -v pytest &>/dev/null || command -v python3 &>/dev/null; then
  echo "Running pytest..."
  if python3 -m pytest tests/ -q 2>&1; then
    pass "pytest"
  else
    fail "pytest — fix failing tests before pushing"
    FAILED=1
  fi
else
  skip "pytest"
fi

# ── 2. YAML lint ─────────────────────────────────────────
if command -v yamllint &>/dev/null; then
  echo "Running yamllint..."
  # Exclude secrets/ — SealedSecret encrypted values are inherently long base64 lines
  if yamllint infra/homelab/apps/ infra/homelab/argocd/ \
              infra/homelab/infrastructure/storage/ \
              infra/homelab/infrastructure/sealed-secrets/ \
              infra/homelab/infrastructure/kustomization.yaml 2>&1; then
    pass "yamllint"
  else
    fail "yamllint — fix YAML errors before pushing"
    FAILED=1
  fi
else
  skip "yamllint  (install: pip install yamllint)"
fi

echo "─────────────────────────────────────────────────────"

if [[ $FAILED -ne 0 ]]; then
  echo -e "${RED}Pre-push checks failed. Push aborted.${NC}"
  echo "To push anyway (not recommended): git push --no-verify"
  exit 1
fi

pass "All checks passed"
