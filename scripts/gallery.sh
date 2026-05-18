#!/usr/bin/env bash
set -euo pipefail

declare -r SD="/Volumes/FUJI/DCIM/"
declare -r SSD="/Volumes/external-1/pictures/$(date +%Y)/"
declare -r GALLERY="/Volumes/external-1/pictures/gallery/"
declare -r UPLOAD="$(dirname "$0")/gallery/upload.py"

cmd_sync() {
  if [[ ! -d "$SSD" ]]; then
    echo "SSD not mounted: $SSD — exiting."
    exit 1
  fi

  if [[ ! -d "$SD" ]]; then
    echo "SD card not mounted: $SD — skipping."
    return
  fi

  mkdir -p "$SSD"
  echo "Syncing $SD → $SSD"
  for folder in "$SD"*/; do
    [[ -d "$folder" ]] || continue
    rsync -av --progress "$folder" "$SSD"
  done
  echo "Sync complete."
}

cmd_add() {
  if [[ ! -d "$GALLERY" ]]; then
    echo "Gallery not mounted: $GALLERY — exiting."
    exit 1
  fi

  echo "Updating manifest..."
  python "$UPLOAD" add "$GALLERY"
}

cmd_push() {
  if [[ ! -d "$GALLERY" ]]; then
    echo "Gallery not mounted: $GALLERY — exiting."
    exit 1
  fi

  echo "Pushing to R2..."
  python "$UPLOAD" push "$GALLERY"
}

case "${1:-}" in
sync) cmd_sync ;;
add) cmd_add ;;
push) cmd_push ;;
*)
  echo "Usage: gallery <sync|add|push>"
  echo ""
  echo "  sync  Copy new photos from SD card to SSD"
  echo "  add   Scan gallery folder and update local manifest"
  echo "  push  Upload images and manifest to R2"
  exit 1
  ;;
esac
