export const dynamic = 'force-dynamic';

/** Liveness check used by the deploy script before traffic is switched to a new release. */
export function GET() {
  return Response.json({ ok: true });
}
