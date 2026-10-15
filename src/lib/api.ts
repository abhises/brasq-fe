import 'server-only';
import { cookies } from 'next/headers';

export const BACKEND_URL = (process.env.BACKEND_URL ?? 'http://localhost:4000').replace(/\/$/, '');
export const SITE_URL = (process.env.SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '');
export const TOKEN_COOKIE = 'bq_token';

export class NotFound extends Error {}

/** Server-side GET against brasq-be's public API. Returns null on 404. */
export async function getPublic<T>(path: string, opts: { auth?: boolean } = {}): Promise<T | null> {
  const headers: Record<string, string> = {};
  if (opts.auth) {
    const token = (await cookies()).get(TOKEN_COOKIE)?.value;
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  const res = await fetch(`${BACKEND_URL}/api/public${path}`, { headers, cache: 'no-store' });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`brasq-be ${path} failed: ${res.status}`);
  return res.json() as Promise<T>;
}
