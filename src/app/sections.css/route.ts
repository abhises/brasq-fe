import { createHash } from 'node:crypto';
import { BACKEND_URL } from '@/lib/api';

export const dynamic = 'force-dynamic';

/**
 * CSS of the section types made in the admin (scoped per section by the backend). Linked from the root layout.
 * Browsers revalidate on every page view (cheap 304 via ETag), so a new or edited section type shows at once.
 */
export async function GET(req: Request) {
  let css = '';
  try {
    const res = await fetch(`${BACKEND_URL}/api/public/sections.css`, { cache: 'no-store' });
    if (res.ok) css = await res.text();
  } catch { css = '/* section CSS unavailable */'; }
  const etag = `"${createHash('sha1').update(css).digest('base64url').slice(0, 16)}"`;
  const headers = { 'Content-Type': 'text/css; charset=utf-8', 'Cache-Control': 'no-cache', ETag: etag };
  if (req.headers.get('if-none-match') === etag) return new Response(null, { status: 304, headers });
  return new Response(css, { headers });
}
