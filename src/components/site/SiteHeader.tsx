import Link from 'next/link';
import type { Category } from '@/lib/types';
import { NavLinks } from './NavLinks';

export function SiteHeader({ categories }: { categories: Category[] }) {
  return (
    <header style={{ background: 'var(--paper)' }}>
      <div className="bq-container" style={{ paddingTop: 16, paddingBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontWeight: 900, fontSize: 28, letterSpacing: '-0.04em', color: 'var(--ink)' }}>Bras<span style={{ color: 'var(--orange-mid)' }}>Q</span></span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: '1 1 300px', justifyContent: 'flex-end', maxWidth: 520 }}>
          <Link href="/search" style={{ flex: '1 1 auto', minWidth: 0, border: '2px solid var(--ink)', background: '#fff', padding: '10px 14px', fontSize: 14, color: 'var(--muted-2)', textDecoration: 'none', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Search a product or buying guide</Link>
          <Link href="/newsletter" style={{ fontSize: 14, fontWeight: 700, textDecoration: 'none', background: 'var(--ink)', color: '#fff', padding: '12px 16px', whiteSpace: 'nowrap' }}>Newsletter</Link>
        </div>
      </div>
      <nav className="bq-catnav" style={{ background: 'var(--ink)' }}>
        <NavLinks categories={categories.map((c) => ({ slug: c.slug, name: c.name }))} />
      </nav>
    </header>
  );
}
