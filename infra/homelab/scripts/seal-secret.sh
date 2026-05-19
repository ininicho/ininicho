#!/usr/bin/env bash
# Usage: bash seal-secret.sh <namespace> <secret-name> <key>=<value> [<key>=<value> ...]
# Example: bash seal-secret.sh ntfy ntfy-auth NTFY_PUBLISH_TOKEN=abc123 NTFY_ADMIN_PASSWORD=hunter2
set -euo pipefail

NAMESPACE="${1:?Usage: seal-secret.sh <namespace> <secret-name> <key=value>...}"
SECRET_NAME="${2:?Missing secret name}"
shift 2

LITERALS=""
for kv in "$@"; do
  LITERALS="$LITERALS --from-literal=$kv"
done

kubectl create secret generic "$SECRET_NAME" \
  --namespace "$NAMESPACE" \
  --dry-run=client \
  $LITERALS \
  -o yaml | \
  kubeseal \
    --controller-name sealed-secrets-controller \
    --controller-namespace kube-system \
    --format yaml

echo "" >&2
echo "# Pipe the above output to a file:" >&2
echo "# bash seal-secret.sh $NAMESPACE $SECRET_NAME ... > infra/homelab/infrastructure/secrets/$SECRET_NAME.yaml" >&2
