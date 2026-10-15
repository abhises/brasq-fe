import { cookies } from 'next/headers';
import { BACKEND_URL, TOKEN_COOKIE } from '@/lib/api';

/** Forwards /api/admin/* from the admin UI to brasq-be, adding the session token from the httpOnly cookie. */
async function forward(req: Request, ctx: { params: Promise<{ path: string[] }> }) {
  const token = (await cookies()).get(TOKEN_COOKIE)?.value;
  if (!token) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const { path } = await ctx.params;
  const url = `${BACKEND_URL}/api/admin/${path.map(encodeURIComponent).join('/')}${new URL(req.url).search}`;
  const headers = new Headers({ Authorization: `Bearer ${token}` });
  const type = req.headers.get('content-type');
  if (type) headers.set('content-type', type);
  const hasBody = req.method !== 'GET' && req.method !== 'HEAD';
  const res = await fetch(url, {
    method: req.method,
    headers,
    body: hasBody ? req.body : undefined,
    // @ts-expect-error duplex is required by Node's fetch when streaming a request body
    duplex: hasBody ? 'half' : undefined,
  });
  const out = new Headers();
  for (const h of ['content-type', 'content-disposition']) { const v = res.headers.get(h); if (v) out.set(h, v); }
  return new Response(res.status === 204 ? null : res.body, { status: res.status, headers: out });
}

export { forward as GET, forward as POST, forward as PUT, forward as PATCH, forward as DELETE };
