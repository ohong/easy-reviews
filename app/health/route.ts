// Liveness probe for the Docker healthcheck (docker-compose.yml) and nginx
// upstream checks. Intentionally does no DB or network work — it answers the
// single question "is the HTTP server up?". If migrations fail on boot the
// process throws and never reaches here, so the container is reported unhealthy.
export const dynamic = "force-dynamic";

export function GET() {
  return new Response("ok", {
    status: 200,
    headers: { "content-type": "text/plain", "cache-control": "no-store" },
  });
}
