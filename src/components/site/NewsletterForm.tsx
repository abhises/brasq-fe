'use client';
import { useState } from 'react';
import { subscribe, THANKS } from '@/lib/subscribe';

export function NewsletterForm({ source, button = 'Subscribe', variant = 'inline', doneClass = 'bq-form-done' }: {
  source: string; button?: string; variant?: 'inline' | 'boxed' | 'stacked'; doneClass?: string;
}) {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  if (done) return <p className={doneClass}>{THANKS}</p>;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try { await subscribe(email, source); setDone(true); } catch (err) { setError((err as Error).message); }
  };

  if (variant === 'stacked') {
    return (
      <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <input type="email" aria-label="Email address" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ border: '2px solid var(--ink)', padding: '13px 14px', font: "15px 'Archivo',sans-serif", minWidth: 0 }} />
        <button type="submit" className="bq-btn bq-btn--buy" style={{ border: '2px solid var(--ink)', fontSize: 16 }}>{button}</button>
        {error && <p style={{ margin: 0, fontSize: 13, color: 'var(--red)' }}>{error}</p>}
      </form>
    );
  }
  return (
    <form onSubmit={onSubmit} className={`bq-form${variant === 'boxed' ? ' bq-form--boxed' : ''}`}>
      <input type="email" aria-label="Email address" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <button type="submit">{button}</button>
      {error && <p className="bq-form-error">{error}</p>}
    </form>
  );
}
