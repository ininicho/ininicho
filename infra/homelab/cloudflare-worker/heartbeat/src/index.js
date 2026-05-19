export default {
  async scheduled(event, env, ctx) {
    let isDown = false;

    try {
      const response = await fetch(env.PI_HEALTH_URL, {
        signal: AbortSignal.timeout(5000),
      });
      isDown = response.status !== 200;
    } catch {
      isDown = true;
    }

    if (isDown) {
      await fetch(`https://ntfy.sh/${env.NTFY_FALLBACK_TOPIC}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.NTFY_FALLBACK_TOKEN}`,
          Title: "⚠️ Pi appears to be offline",
          Priority: "urgent",
          Tags: "warning,computer",
        },
        body: "The Pi heartbeat check failed. ntfy.ininicho.com did not respond.",
      });
    }
  },
};
