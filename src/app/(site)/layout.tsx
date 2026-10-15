import Link from 'next/link';
import { connection } from 'next/server';
import { SiteFooter } from '@/components/site/SiteFooter';
import { SiteHeader } from '@/components/site/SiteHeader';
import { getPublic } from '@/lib/api';
import type { Category } from '@/lib/types';

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  await connection();
  const site = await getPublic<{ categories: Category[] }>('/site');
  const categories = site?.categories ?? [];
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: 'var(--yellow)', color: 'var(--ink)', fontSize: 13, padding: '8px 16px', textAlign: 'center', lineHeight: 1.4, fontWeight: 500 }}>
        We test independently. When you buy through our links, we may earn a commission.{' '}
        <Link href="/how-we-make-money" style={{ fontWeight: 700, textDecorationColor: 'var(--ink)' }}>How we make money</Link>
      </div>
      <SiteHeader categories={categories} />
      <main style={{ flex: 1 }}>{children}</main>
      <SiteFooter categories={categories} />
    </div>
  );
}
