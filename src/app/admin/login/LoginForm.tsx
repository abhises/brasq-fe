'use client';
import { useActionState } from 'react';
import { login } from '../actions';

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(login, null);
  return (
    <form action={action} className="ad-form">
      <input type="hidden" name="next" value={next} />
      <label>Email<input name="email" type="email" required autoComplete="username" /></label>
      <label>Password<input name="password" type="password" required autoComplete="current-password" /></label>
      {state?.error && <p className="ad-error">{state.error}</p>}
      <button className="ad-btn ad-btn--primary" disabled={pending}>{pending ? 'Signing in…' : 'Sign in'}</button>
    </form>
  );
}
