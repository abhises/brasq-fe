import Link from 'next/link';
import type { Category } from '@/lib/types';

const col: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14 };
const a: React.CSSProperties = { color: 'var(--on-dark-2)', textDecoration: 'none' };

export function SiteFooter({ categories }: { categories: Category[] }) {
  return (
    <footer style={{ background: 'var(--ink)', color: 'var(--on-dark-2)', marginTop: 'auto' }}>
      <div className="bq-container" style={{ paddingTop: 44, paddingBottom: 28, display: 'flex', flexDirection: 'column', gap: 32 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,170px),1fr))', gap: 28 }}>
          <div style={{ ...col, maxWidth: 380 }}>
            <span style={{ fontWeight: 900, fontSize: 26, letterSpacing: '-0.04em', color: '#fff' }}>Bras<span style={{ color: 'var(--orange)' }}>Q</span></span>
            <p style={{ margin: 0, lineHeight: 1.6 }}>Independent buying guides, tested in a real home. Published by BrasQ Media LLC, Columbus, Ohio.</p>
          </div>
          <div style={col}>
            <strong style={{ color: '#fff' }}>Categories</strong>
            {categories.slice(0, 4).map((c) => <Link key={c.slug} href={`/category/${c.slug}`} style={a}>{c.name}</Link>)}
          </div>
          <div style={col}>
            <strong style={{ color: '#fff' }}>About us</strong>
            <Link href="/team" style={a}>Editorial team</Link>
            <Link href="/how-we-test" style={a}>How we test</Link>
            <Link href="/editorial-guidelines" style={a}>Editorial guidelines</Link>
            <Link href="/contact" style={a}>Contact</Link>
          </div>
          <div style={col}>
            <strong style={{ color: '#fff' }}>Transparency</strong>
            <Link href="/how-we-make-money" style={a}>How we make money</Link>
            <Link href="/corrections-policy" style={a}>Corrections policy</Link>
            <Link href="/privacy" style={a}>Privacy &amp; cookies</Link>
            <Link href="/terms" style={a}>Terms of use</Link>
          </div>
        </div>
        <div style={{ borderTop: '1px solid #34342f', paddingTop: 18, fontSize: 12, display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <span>© {new Date().getFullYear()} BrasQ Media LLC</span><span>Prices and availability are subject to change.</span>
        </div>
      </div>
    </footer>
  );
}
