declare -r source="/Volumes/FUJI/DCIM/"
declare -r dest="/Volumes/external-1/pictures/2026/"

declare -a folders=$(ls "$source")
for folder in "${folders[@]}"; do
  rsync -av --progress "$source/$folder/" "$dest"
done
