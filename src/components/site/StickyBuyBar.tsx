'use client';
import { useEffect, useState } from 'react';
import type { StickyBar } from '@/lib/types';

export function StickyBuyBar({ bar }: { bar: StickyBar }) {
  const [visible, setVisible] = useState(false);
  const [closed, setClosed] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 900);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  if (!visible || closed) return null;
  return (
    <div style={{ position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 40, background: 'var(--ink)', color: '#fff', borderTop: '3px solid var(--yellow)' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 14 }}>
        {bar.image && <div className="bq-photo" style={{ width: 52, height: 52, flexShrink: 0, background: '#2a2a27' }}><img src={bar.image} alt="" /></div>}
        <div style={{ flex: '1 1 auto', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--yellow)' }}>Our pick{bar.score ? ` · test score ${bar.score}` : ''}</span>
          <strong style={{ fontSize: 16, fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {bar.name} {bar.price && <span style={{ fontWeight: 500, color: 'var(--on-dark-2)' }}>from {bar.price}</span>}
          </strong>
        </div>
        <a href={bar.url} rel="sponsored nofollow" target="_blank" className="bq-btn bq-btn--buy bq-btn--sm" style={{ whiteSpace: 'nowrap' }}>View at {bar.shop || 'store'}</a>
        <button onClick={() => setClosed(true)} aria-label="Close bar" style={{ background: 'transparent', border: 0, color: 'var(--on-dark-2)', fontSize: 22, lineHeight: 1, cursor: 'pointer', padding: 6 }}>×</button>
      </div>
    </div>
  );
}
