'use client';
import { useActionState, useState } from 'react';
import { login } from '../actions';

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(login, null);
  const [show, setShow] = useState(false);
  return (
    <form action={action} className="lg-form">
      <input type="hidden" name="next" value={next} />
      <label className="lg-field">
        <span>Email</span>
        <input name="email" type="email" required autoComplete="username" placeholder="you@brasq.com" />
      </label>
      <div className="lg-field">
        <label htmlFor="lg-pass">Password</label>
        <div className="lg-pass">
          <input id="lg-pass" name="password" type={show ? 'text' : 'password'} required autoComplete="current-password" placeholder="Your password" />
          <button type="button" className="lg-pass__toggle" onClick={() => setShow((v) => !v)} aria-label={show ? 'Hide password' : 'Show password'} aria-pressed={show} title={show ? 'Hide password' : 'Show password'}>
            <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M1.5 10S4.5 4 10 4s8.5 6 8.5 6-3 6-8.5 6-8.5-6-8.5-6z" /><circle cx="10" cy="10" r="2.5" />
              {show && <path d="M3 3l14 14" />}
            </svg>
          </button>
        </div>
      </div>
      {state?.error && <p className="lg-error" role="alert">{state.error}</p>}
      <button className="lg-submit" disabled={pending}>
        {pending && <span className="lg-spin" aria-hidden="true" />}
        {pending ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}
