'use client';
import { useActionState, useState } from 'react';
import { login } from '../actions';

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(login, null);
  const [show, setShow] = useState(false);
  return (
    <form action={action} className="ad-form">
      <input type="hidden" name="next" value={next} />
      <label>Email<input name="email" type="email" required autoComplete="username" /></label>
      <label htmlFor="ad-pass">Password</label>
      <div className="ad-pass">
        <input id="ad-pass" name="password" type={show ? 'text' : 'password'} required autoComplete="current-password" />
        <button type="button" className="ad-pass__toggle" onClick={() => setShow((v) => !v)} aria-label={show ? 'Hide password' : 'Show password'} aria-pressed={show}>
          <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M1.5 10S4.5 4 10 4s8.5 6 8.5 6-3 6-8.5 6-8.5-6-8.5-6z" /><circle cx="10" cy="10" r="2.5" />
            {show && <path d="M3 3l14 14" />}
          </svg>
        </button>
      </div>
      {state?.error && <p className="ad-error">{state.error}</p>}
      <button className="ad-btn ad-btn--primary" disabled={pending}>{pending ? 'Signing in…' : 'Sign in'}</button>
    </form>
  );
}
