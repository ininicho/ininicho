#!/usr/bin/env python3
"""
Photo upload CLI for ininicho.com portfolio.

Subcommands:
  add <folder>   Scan folder for new JPEGs, append skeleton entries to manifest.json
  push <folder>  Upload images and manifest to Cloudflare R2

Usage:
  python upload.py add /Volumes/external-1/pictures/gallery
  python upload.py push /Volumes/external-1/pictures/gallery
"""

import argparse
import json
import os
import sys
from pathlib import Path
from datetime import datetime

SCRIPT_DIR = Path(__file__).parent
MANIFEST_PATH = SCRIPT_DIR / "manifest.json"
PUBLIC_BASE_URL = "https://public.ininicho.com/gallery"
JPEG_EXTENSIONS = {".jpg", ".jpeg", ".JPG", ".JPEG"}

RATIO_THRESHOLDS = [
    (0.67, "2/3"),
    (0.85, "4/5"),
    (0.95, "3/4"),
    (1.05, "1/1"),
    (1.5, "3/2"),
]
RATIO_FALLBACK = "3/2"


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def load_manifest() -> dict:
    if MANIFEST_PATH.exists():
        with open(MANIFEST_PATH) as f:
            return json.load(f)
    return {"version": "1", "photos": []}


def save_manifest(manifest: dict) -> None:
    with open(MANIFEST_PATH, "w") as f:
        json.dump(manifest, f, indent=2, ensure_ascii=False)
        f.write("\n")


def get_metadata(image_path: Path) -> dict:
    metadata = {
        "ratio": RATIO_FALLBACK,
    }
    try:
        from PIL import Image, ExifTags
        with Image.open(image_path) as img:
            # Timestamp
            exif = { ExifTags.TAGS[k]: v for k, v in img._getexif().items() if k in ExifTags.TAGS }
            timestamp = exif.get("DateTimeOriginal") or exif.get("DateTime")
            if timestamp:
                metadata["date"] = datetime.strptime(timestamp, "%Y:%m:%d %H:%M:%S").strftime("%y/%m/%d")
            
            # Focal length
            focal_length = exif.get("FocalLength")
            if focal_length:
                try:
                    focal_mm = int(focal_length._val)
                    metadata["tags"] = [f"{focal_mm}mm"]
                except Exception:
                    metadata["tags"] = ["35mm"]  # default if we can't parse it

            # Aspect ratio
            w, h = img.size
            r = w / h
            for threshold, ratio in RATIO_THRESHOLDS:
                if r < threshold:
                    metadata["ratio"] = ratio
                    return metadata
            return metadata
    except Exception as e:
        print(f"  warning: could not read dimensions for {image_path.name}: {e}")
        return metadata


def iter_jpegs(folder: Path) -> list[Path]:
    return sorted(
        p for p in folder.iterdir()
        if p.is_file() and p.suffix in JPEG_EXTENSIONS
    )


def make_r2_client():
    try:
        import boto3
        from botocore.config import Config
    except ImportError:
        print("error: boto3 not installed. Run: pip install -r requirements.txt")
        sys.exit(1)

    endpoint = os.environ.get("R2_ENDPOINT_URL")
    key_id = os.environ.get("AWS_ACCESS_KEY_ID")
    secret = os.environ.get("AWS_SECRET_ACCESS_KEY")
    bucket = os.environ.get("R2_BUCKET_NAME")
    region = os.environ.get("R2_REGION", "enam")

    missing = [k for k, v in {
        "R2_ENDPOINT_URL": endpoint,
        "AWS_ACCESS_KEY_ID": key_id,
        "AWS_SECRET_ACCESS_KEY": secret,
        "R2_BUCKET_NAME": bucket,
        "R2_REGION": region,
    }.items() if not v]

    if missing:
        print(f"error: missing environment variables: {', '.join(missing)}")
        print("Copy .env.example to .env and fill in your R2 credentials.")
        sys.exit(1)

    client = boto3.client(
        "s3",
        endpoint_url=endpoint,
        aws_access_key_id=key_id,
        aws_secret_access_key=secret,
        config=Config(signature_version="s3v4"),
        region_name=region
    )
    return client, bucket


def r2_key_exists(client, bucket: str, key: str) -> bool:
    try:
        client.head_object(Bucket=bucket, Key=key)
        return True
    except Exception:
        return False


# ---------------------------------------------------------------------------
# Commands
# ---------------------------------------------------------------------------

def cmd_add(folder: Path) -> None:
    if not folder.is_dir():
        print(f"error: {folder} is not a directory")
        sys.exit(1)

    manifest = load_manifest()
    photos = manifest["photos"]
    existing_filenames = {p["filename"] for p in photos}

    new_files = [f for f in iter_jpegs(folder) if f.name not in existing_filenames]

    if not new_files:
        print("No new photos found.")
        return

    print(f"Found {len(new_files)} new photo(s):")
    for image_path in new_files:
        metadata = get_metadata(image_path)
        next_id = str(len(photos) + 1).zfill(3)
        entry = {
            "id": next_id,
            "filename": image_path.name,
            "caption": "",
            "place": "",
            "date": metadata["date"] if "date" in metadata else "",
            "ratio": metadata["ratio"],
            "tags": metadata["tags"],
            "src": f"{PUBLIC_BASE_URL}/{image_path.name}",
        }
        photos.append(entry)
        print(f"  [{next_id}] {image_path.name}")

    save_manifest(manifest)
    print(f"\nmanifest.json updated — {len(new_files)} entries added.")
    print("Edit manifest.json to fill in caption, place, date, and tags, then run 'push'.")


def cmd_push(folder: Path) -> None:
    if not folder.is_dir():
        print(f"error: {folder} is not a directory")
        sys.exit(1)

    if not MANIFEST_PATH.exists():
        print("error: manifest.json not found. Run 'add' first.")
        sys.exit(1)

    # Load .env if present
    env_file = SCRIPT_DIR / ".env"
    if env_file.exists():
        try:
            from dotenv import load_dotenv
            load_dotenv(env_file)
        except ImportError:
            # Manual .env parsing fallback
            with open(env_file) as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith("#") and "=" in line:
                        k, _, v = line.partition("=")
                        os.environ.setdefault(k.strip(), v.strip())

    client, bucket = make_r2_client()
    manifest = load_manifest()
    photos = manifest["photos"]

    uploaded = 0
    skipped = 0

    for entry in photos:
        filename = entry["filename"]
        local_path = folder / filename
        r2_key = f"gallery/{filename}"

        if not local_path.exists():
            print(f"  skip (not in folder): {filename}")
            skipped += 1
            continue

        if r2_key_exists(client, bucket, r2_key):
            print(f"  skip (already in R2): {filename}")
            skipped += 1
            continue

        print(f"  uploading: {filename}")
        client.upload_file(
            str(local_path),
            bucket,
            r2_key,
            ExtraArgs={"ContentType": "image/jpeg"},
        )
        uploaded += 1

    # Always push the latest manifest
    print("  uploading: manifest.json")
    client.put_object(
        Bucket=bucket,
        Key="gallery/manifest.json",
        Body=MANIFEST_PATH.read_bytes(),
        ContentType="application/json",
        CacheControl="no-cache, no-store",
    )

    print(f"\nDone. {uploaded} image(s) uploaded, {skipped} skipped, manifest pushed.")


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

def main() -> None:
    parser = argparse.ArgumentParser(
        description="Manage portfolio photos in Cloudflare R2.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    sub = parser.add_subparsers(dest="command", required=True)

    p_add = sub.add_parser("add", help="Scan folder and add new photos to manifest.json")
    p_add.add_argument("folder", type=Path, help="Local folder containing JPEGs")

    p_push = sub.add_parser("push", help="Upload images and manifest to R2")
    p_push.add_argument("folder", type=Path, help="Local folder containing JPEGs")

    args = parser.parse_args()

    if args.command == "add":
        cmd_add(args.folder)
    elif args.command == "push":
        cmd_push(args.folder)


if __name__ == "__main__":
    main()
