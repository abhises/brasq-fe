'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

const link: React.CSSProperties = { textDecoration: 'none', color: '#fff', padding: '14px 0', whiteSpace: 'nowrap' };

export function NavLinks({ categories }: { categories: { slug: string; name: string }[] }) {
  const path = usePathname();
  const strip = useRef<HTMLDivElement>(null);
  // On phones the strip scrolls sideways; keep the current category visible
  useEffect(() => {
    const el = strip.current?.querySelector<HTMLElement>('[aria-current="page"]');
    if (el && strip.current) strip.current.scrollLeft = el.offsetLeft - 16;
  }, [path]);
  return (
    <div ref={strip} className="bq-container" style={{ display: 'flex', gap: 24, overflowX: 'auto', fontSize: 14, fontWeight: 700, scrollbarWidth: 'none' }}>
      {categories.map((c) => (
        <Link key={c.slug} href={`/category/${c.slug}`} aria-current={path === `/category/${c.slug}` ? 'page' : undefined} style={{ ...link, boxShadow: path === `/category/${c.slug}` ? 'inset 0 -4px 0 var(--orange)' : 'none' }}>{c.name}</Link>
      ))}
      <Link href="/deals" style={{ ...link, color: 'var(--yellow)' }}>Deals</Link>
      <Link href="/how-we-test" style={{ ...link, color: 'var(--on-dark-2)', marginLeft: 'auto', fontWeight: 500 }}>How we test</Link>
    </div>
  );
}
