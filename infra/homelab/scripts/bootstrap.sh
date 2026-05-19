#!/usr/bin/env bash
set -euo pipefail

echo "=== Pi Homelab Bootstrap ==="

if [[ "${1:-}" == "--cloudflared" ]]; then
  curl -fsSL https://pkg.cloudflare.com/cloudflare-main.gpg | sudo tee /usr/share/keyrings/cloudflare-main.gpg > /dev/null
  echo 'deb [signed-by=/usr/share/keyrings/cloudflare-main.gpg] https://pkg.cloudflare.com/cloudflared bookworm main' | \
    sudo tee /etc/apt/sources.list.d/cloudflared.list
  sudo apt-get update && sudo apt-get install -y cloudflared
  echo ""
  echo "Now authenticate and create a tunnel:"
  echo "  cloudflared tunnel login"
  echo "  cloudflared tunnel create pi-tunnel"
  echo "  cloudflared tunnel route dns pi-tunnel '*.ininicho.com'"
  echo ""
  echo "Then configure ~/.cloudflared/config.yml — see infra/homelab/scripts/cloudflared-config.yml.example"
  exit 0
fi

# 1. Disable swap (required for k3s)
sudo dphys-swapfile swapoff
sudo dphys-swapfile uninstall
sudo systemctl disable dphys-swapfile

# 2. Enable cgroups (required for k3s on Raspberry Pi OS)
CMDLINE=/boot/firmware/cmdline.txt
if ! grep -q "cgroup_enable=cpuset" "$CMDLINE"; then
  sudo sed -i 's/$/ cgroup_enable=cpuset cgroup_enable=memory cgroup_memory=1/' "$CMDLINE"
  echo "cgroups enabled — reboot required before continuing"
  echo "After reboot, re-run this script with: bash bootstrap.sh --post-reboot"
  exit 0
elif [[ "${1:-}" != "--post-reboot" ]]; then
  echo "cgroups already set. Pass --post-reboot to continue with k3s installation."
  exit 0
fi

# 3. Uninstall existing k3s if present
if command -v k3s-uninstall.sh &>/dev/null; then
  echo "Uninstalling existing k3s..."
  k3s-uninstall.sh
fi

# 4. Install k3s
curl -sfL https://get.k3s.io | sh -

# Wait for k3s to be ready
echo "Waiting for k3s to be ready..."
until kubectl get nodes 2>/dev/null | grep -q "Ready"; do sleep 5; done
echo "k3s is ready"

# 5. Set up kubeconfig for non-root user
mkdir -p ~/.kube
sudo cp /etc/rancher/k3s/k3s.yaml ~/.kube/config
sudo chown "$USER:$USER" ~/.kube/config
export KUBECONFIG=~/.kube/config

# 6. Install Sealed Secrets operator
kubectl apply -f https://github.com/bitnami-labs/sealed-secrets/releases/latest/download/controller.yaml

# 7. Install ArgoCD
kubectl create namespace argocd --dry-run=client -o yaml | kubectl apply -f -
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

echo ""
echo "=== Bootstrap complete ==="
echo "Next steps:"
echo "  1. Install cloudflared: bash bootstrap.sh --cloudflared"
echo "  2. Apply the root ArgoCD app: kubectl apply -f infra/homelab/argocd/root-app.yaml"
