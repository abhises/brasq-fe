import { BACKEND_URL } from '@/lib/api';

export async function POST(req: Request) {
  const res = await fetch(`${BACKEND_URL}/api/public/subscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: await req.text(),
  });
  return new Response(await res.text(), { status: res.status, headers: { 'Content-Type': 'application/json' } });
}
