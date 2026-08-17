#!/usr/bin/env bash
#
# disk_usage_top_macos.sh — find the folders eating the most space on a drive
# (macOS / BSD du + BSD sort compatible version)
#
# Usage:
#   ./disk_usage_top_macos.sh /path/to/mount [depth] [top_n]
#
# Examples:
#   ./disk_usage_top_macos.sh /Volumes/MyDrive
#   ./disk_usage_top_macos.sh /Volumes/MyDrive 2 30
#
# Arguments:
#   $1  path        - required. Root folder/mount point to scan.
#   $2  depth       - optional. How many levels deep to break down (default: 1)
#   $3  top_n       - optional. How many results to show (default: 20)
#
# Notes:
#   macOS ships BSD du/sort, which don't support --max-depth or `sort -h`.
#   This version uses `du -d` for depth and converts sizes to bytes internally
#   for accurate sorting, then prints them back out in human-readable form.

set -euo pipefail

TARGET="${1:-}"
DEPTH="${2:-1}"
TOP_N="${3:-20}"

if [[ -z "$TARGET" ]]; then
  echo "Usage: $0 /path/to/drive [depth] [top_n]"
  echo "Example: $0 /Volumes/MyExternalDrive 1 20"
  exit 1
fi

if [[ ! -d "$TARGET" ]]; then
  echo "Error: '$TARGET' is not a directory (or isn't mounted)."
  exit 1
fi

echo "Scanning: $TARGET"
echo "Depth: $DEPTH | Showing top $TOP_N by size"
echo "------------------------------------------------------------"

# -x stays on one filesystem, -d sets depth (BSD du equivalent of --max-depth)
# We get raw byte sizes (no -h) so sorting is accurate, then convert to human-readable.
du -x -d "$DEPTH" -k "$TARGET" 2>/dev/null |
  sort -rn |
  head -n "$TOP_N" |
  awk '{
      size_kb = $1;
      $1 = "";
      path = $0;
      sub(/^ /, "", path);

      if (size_kb >= 1073741824) { printf "%-8s %s\n", sprintf("%.1fT", size_kb/1073741824), path }
      else if (size_kb >= 1048576) { printf "%-8s %s\n", sprintf("%.1fG", size_kb/1048576), path }
      else if (size_kb >= 1024) { printf "%-8s %s\n", sprintf("%.1fM", size_kb/1024), path }
      else { printf "%-8s %s\n", size_kb "K", path }
    }'

echo "------------------------------------------------------------"
echo "Done. Tip: increase depth (e.g. depth=2) to drill into subfolders of the biggest hits."
