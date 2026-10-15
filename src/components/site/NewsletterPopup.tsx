'use client';
import { useEffect, useState } from 'react';
import { NewsletterForm } from './NewsletterForm';

const KEY = 'bq-nl-popup';

/** Opens once per session after the reader scrolls 35% down the page. */
export function NewsletterPopup({ image, source }: { image?: string | null; source: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let seen = false;
    try { seen = sessionStorage.getItem(KEY) === '1'; } catch {}
    if (seen) return;
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      if (h > 0 && window.scrollY / h > 0.35) { setOpen(true); window.removeEventListener('scroll', onScroll); }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  function close() {
    try { sessionStorage.setItem(KEY, '1'); } catch {}
    setOpen(false);
  }

  if (!open) return null;
  return (
    <div onClick={close} style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(17,17,16,0.35)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Sign up for the newsletter" style={{ position: 'relative', width: '100%', maxWidth: 680, background: '#fff', border: '3px solid var(--ink)', boxShadow: '10px 10px 0 var(--ink)', display: 'flex', flexWrap: 'wrap', maxHeight: 'calc(100vh - 40px)', overflow: 'auto' }}>
        <div className="bq-photo" style={{ flex: '1 1 220px', minHeight: 200 }}>{image && <img src={image} alt="" />}</div>
        <div style={{ flex: '2 1 320px', padding: '30px 26px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <button onClick={close} aria-label="Close" style={{ position: 'absolute', top: 10, right: 10, width: 36, height: 36, border: '2px solid var(--ink)', background: '#fff', font: "900 18px 'Archivo',sans-serif", cursor: 'pointer', lineHeight: 1 }}>×</button>
          <span className="bq-tag bq-tag--yellow bq-tag--sm">Free newsletter</span>
          <h2 style={{ fontSize: 32, margin: 0, fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.02 }}>Never overpay again</h2>
          <p style={{ margin: 0, fontSize: 15, lineHeight: 1.55, color: 'var(--text-2)' }}>Every Friday, our latest tests and the best deals, compared against the price over the past 90 days.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 14 }}>
            {['Price alerts for products in our buying guides', 'New test results in your inbox first', 'One email a week, unsubscribe in one click'].map((t) => (
              <span key={t} style={{ display: 'flex', gap: 8 }}><strong style={{ color: 'var(--green)' }}>✓</strong>{t}</span>
            ))}
          </div>
          <NewsletterForm source={source} variant="stacked" doneClass="bq-form-done" />
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: 'var(--muted-2)' }}>We never share your email address. <a href="/privacy" style={{ color: 'var(--muted-2)' }}>Privacy</a></span>
            <button onClick={close} style={{ background: 'none', border: 0, padding: 0, font: "600 13px 'Archivo',sans-serif", color: 'var(--muted)', textDecoration: 'underline', cursor: 'pointer' }}>No, thanks</button>
          </div>
        </div>
      </div>
    </div>
  );
}
