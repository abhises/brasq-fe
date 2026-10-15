'use server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { BACKEND_URL, SITE_URL, TOKEN_COOKIE } from '@/lib/api';

export async function login(_prev: { error: string } | null, form: FormData) {
  const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: form.get('email'), password: form.get('password') }),
  }).catch(() => null);
  if (!res) return { error: 'Cannot reach the backend. Is brasq-be running?' };
  if (!res.ok) return { error: 'Invalid email or password' };
  const { token } = (await res.json()) as { token: string };
  (await cookies()).set(TOKEN_COOKIE, token, {
    httpOnly: true, sameSite: 'lax', secure: SITE_URL.startsWith('https://'), path: '/', maxAge: 60 * 60 * 24 * 7,
  });
  const next = String(form.get('next') || '/admin');
  redirect(next.startsWith('/admin') ? next : '/admin');
}

export async function logout() {
  (await cookies()).delete(TOKEN_COOKIE);
  redirect('/admin/login');
}
