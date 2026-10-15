'use client';

/** Browser-side calls to the admin API (proxied through /api/admin/* which adds the session token). */
export async function adminApi<T = unknown>(path: string, init: RequestInit & { json?: unknown } = {}): Promise<T> {
  const { json, ...rest } = init;
  const res = await fetch(`/api/admin${path}`, {
    ...rest,
    headers: json !== undefined ? { 'Content-Type': 'application/json', ...rest.headers } : rest.headers,
    body: json !== undefined ? JSON.stringify(json) : rest.body,
  });
  if (res.status === 401) {
    window.location.href = `/admin/login?next=${encodeURIComponent(window.location.pathname)}`;
    throw new Error('Session expired');
  }
  if (res.status === 204) return undefined as T;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const issues = (data as { issues?: { path: string[]; message: string }[] }).issues;
    throw new Error(issues?.length ? issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ') : (data as { error?: string }).error || `Request failed (${res.status})`);
  }
  return data as T;
}
