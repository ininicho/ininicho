import os
import tempfile
import threading
from datetime import date

import requests
from flask import Flask, request, jsonify

from categorizer import categorize
from db import (
    get_card_id, get_category_id, insert_transaction,
    get_monthly_totals, get_monthly_total, get_budget,
)
from minio_client import download_object
from parsers import get_parser, detect_slug

app = Flask(__name__)

BEARER_TOKEN = os.environ["COMMAND_CENTER_TOKEN"]
NTFY_URL = os.environ.get("NTFY_URL", "http://ntfy.ntfy.svc.cluster.local")
NTFY_TOPIC = os.environ.get("NTFY_TOPIC", "alerts")
NTFY_PUBLISH_TOKEN = os.environ.get("NTFY_PUBLISH_TOKEN", "")


# ── helpers ──────────────────────────────────────────────────────────────────

def ntfy_push(title: str, message: str, priority: str = "default") -> None:
    try:
        requests.post(
            f"{NTFY_URL}/{NTFY_TOPIC}",
            data=message.encode(),
            headers={
                "Title": title,
                "Priority": priority,
                "Authorization": f"Bearer {NTFY_PUBLISH_TOKEN}",
            },
            timeout=5,
        )
    except Exception:
        pass


def _require_auth():
    auth = request.headers.get("Authorization", "")
    if auth != f"Bearer {BEARER_TOKEN}":
        return jsonify({"error": "unauthorized"}), 401
    return None


def _current_month() -> str:
    return date.today().strftime("%Y-%m")


# ── statement webhook ─────────────────────────────────────────────────────────

def _process_statement(bucket: str, object_key: str) -> None:
    filename = object_key.split("/")[-1]
    slug = detect_slug(filename)
    if not slug:
        ntfy_push("⚠️ Statement parse failed", f"Could not detect card from filename: {filename}")
        return

    parser = get_parser(slug)
    card_id = get_card_id(slug)
    if not card_id:
        ntfy_push("⚠️ Statement parse failed", f"Card slug not found in DB: {slug}")
        return

    with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as tmp:
        tmp_path = tmp.name

    try:
        download_object(bucket, object_key, tmp_path)
        transactions = parser.parse(tmp_path)
    finally:
        os.unlink(tmp_path)

    imported = 0
    for txn in transactions:
        category_name = categorize(txn["merchant"])
        category_id = get_category_id(category_name)
        result = insert_transaction(
            date=txn["date"],
            merchant=txn["merchant"],
            amount=txn["amount"],
            card_id=card_id,
            category_id=category_id,
            source="statement",
            statement_file=filename,
            raw_description=txn.get("raw"),
        )
        if result:
            imported += 1

    ntfy_push(
        "✅ Statement imported",
        f"{filename}: {imported} transactions imported ({len(transactions) - imported} duplicates skipped)",
    )


@app.post("/webhook/statement")
def webhook_statement():
    payload = request.get_json(silent=True) or {}
    records = payload.get("Records", [])
    for record in records:
        bucket = record.get("s3", {}).get("bucket", {}).get("name", "")
        key = record.get("s3", {}).get("object", {}).get("key", "")
        if bucket and key:
            threading.Thread(
                target=_process_statement, args=(bucket, key), daemon=True
            ).start()
    return jsonify({"status": "accepted"}), 202


# ── reports ───────────────────────────────────────────────────────────────────

def _build_digest(month: str) -> str:
    totals = get_monthly_totals(month)
    total_spent = get_monthly_total(month)
    budget = get_budget(month)

    lines = [f"📊 Expense digest for {month}\n"]
    for row in totals:
        lines.append(f"  {row['category']}: ${row['total']:.2f}")
    lines.append(f"\nTotal: ${total_spent:.2f}")
    if budget:
        remaining = budget - total_spent
        pct = (total_spent / budget) * 100
        lines.append(f"Budget: ${budget:.2f} ({pct:.0f}% used, ${remaining:.2f} remaining)")
    return "\n".join(lines)


# ── /run endpoint ─────────────────────────────────────────────────────────────

COMMANDS = {
    "status": None,
    "digest": None,
    "report": None,
    "list-commands": None,
}


@app.post("/run")
def run():
    err = _require_auth()
    if err:
        return err

    body = request.get_json(silent=True) or {}
    command = body.get("command", "")
    month = body.get("month", _current_month())

    if command not in COMMANDS:
        return jsonify({"error": f"unknown command: {command}", "available": list(COMMANDS)}), 400

    if command == "list-commands":
        return jsonify({"commands": list(COMMANDS)}), 200

    if command == "status":
        import subprocess
        result = subprocess.run(
            ["sh", "-c", "free -h | grep Mem && df -h /"],
            capture_output=True, text=True, timeout=10,
        )
        ntfy_push("📊 Pi Status", result.stdout.strip())
        return jsonify({"status": "sent"}), 200

    if command == "digest":
        message = _build_digest(month)
        ntfy_push(f"📊 Weekly digest — {month}", message)
        return jsonify({"status": "sent", "month": month}), 200

    if command == "report":
        message = _build_digest(month)
        ntfy_push(f"📋 Monthly report — {month}", message)
        return jsonify({"status": "sent", "month": month}), 200

    return jsonify({"error": "unhandled command"}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
