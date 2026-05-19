import os
import subprocess
import threading
import requests
from flask import Flask, request, jsonify

app = Flask(__name__)

BEARER_TOKEN = os.environ["COMMAND_RUNNER_TOKEN"]
NTFY_URL = os.environ.get("NTFY_URL", "http://ntfy.ntfy.svc.cluster.local")
NTFY_TOPIC = os.environ.get("NTFY_COMMANDS_TOPIC", "commands")
NTFY_PUBLISH_TOKEN = os.environ.get("NTFY_PUBLISH_TOKEN", "")

COMMANDS = {
    "status": None,
    "list-commands": None,
}


def ntfy_push(title: str, message: str) -> None:
    try:
        requests.post(
            f"{NTFY_URL}/{NTFY_TOPIC}",
            data=message.encode(),
            headers={
                "Title": title,
                "Authorization": f"Bearer {NTFY_PUBLISH_TOKEN}",
            },
            timeout=5,
        )
    except Exception:
        pass


def run_command_async(command: str) -> None:
    cmd = COMMANDS[command]
    result = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
    if result.returncode == 0:
        ntfy_push(f"✅ {command}", result.stdout.strip() or "Done")
    else:
        ntfy_push(f"❌ {command} failed", result.stderr.strip() or "Unknown error")


@app.post("/run")
def run():
    auth = request.headers.get("Authorization", "")
    if auth != f"Bearer {BEARER_TOKEN}":
        return jsonify({"error": "unauthorized"}), 401

    body = request.get_json(silent=True) or {}
    command = body.get("command", "")

    if command not in COMMANDS:
        return jsonify({"error": f"unknown command: {command}", "available": list(COMMANDS)}), 400

    if command == "list-commands":
        return jsonify({"commands": list(COMMANDS)}), 200

    if command == "status":
        result = subprocess.run(
            ["sh", "-c", "echo CPU: $(top -bn1 | grep Cpu | awk '{print $2}')% && free -h | grep Mem && df -h /"],
            capture_output=True, text=True, timeout=10,
        )
        ntfy_push("📊 Pi Status", result.stdout.strip())
        return jsonify({"status": "sent"}), 200

    threading.Thread(target=run_command_async, args=(command,), daemon=True).start()
    return jsonify({"status": "accepted", "command": command}), 202


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
