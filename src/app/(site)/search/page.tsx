import type { Metadata } from 'next';
import Link from 'next/link';
import { connection } from 'next/server';
import { SearchInput } from '@/components/site/SearchInput';
import { getPublic } from '@/lib/api';
import { postUrl, typeLabel } from '@/lib/format';
import type { AuthorCard, Category, PostCard } from '@/lib/types';

export const metadata: Metadata = { title: 'Search | BrasQ', robots: { index: false } };

type Data = { q: string; posts: PostCard[]; authors: AuthorCard[]; categories: Category[] };

function searchMeta(p: PostCard) {
  const cat = p.category?.name ?? '';
  if (p.type === 'guide') return `${cat}${p.testedCount ? ` · ${p.testedCount} models tested` : ''}`;
  if (p.type === 'comparison') return `${cat}${p.testedCount ? ` · ${p.testedCount} products compared` : ''}`;
  if (p.type === 'informational') return `${cat}${cat && p.excerpt ? ' · ' : ''}${p.excerpt}`;
  return `${p.topPick ?? ''}${p.category ? ` · ${p.category.name}` : ''}`;
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  await connection();
  const q = ((await searchParams).q ?? '').trim();
  const d = (await getPublic<Data>(`/search?q=${encodeURIComponent(q)}`))!;
  const rows = [
    ...d.posts.map((p) => ({ key: p.id, type: typeLabel(p.type), title: p.title, meta: searchMeta(p), href: postUrl(p) })),
    ...d.authors.map((a) => ({ key: a.slug, type: 'Editorial team', title: a.name, meta: a.role, href: `/author/${a.slug}` })),
    ...d.categories.map((c) => ({ key: c.slug, type: 'Category', title: c.name, meta: c.intro, href: `/category/${c.slug}` })),
  ];
  return (
    <div className="bq-page bq-page--narrow">
      <h1 className="bq-h1" style={{ fontSize: 'clamp(36px,5vw,56px)' }}>Search</h1>
      <SearchInput initial={q} />
      <span style={{ fontSize: 14, color: 'var(--muted)' }}>{q ? `${rows.length} results for "${q}"` : `All ${rows.length} buying guides`}</span>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {rows.map((r) => (
          <Link key={r.type + r.key} href={r.href} className="bq-result-row">
            <span className="bq-eyebrow">{r.type}</span><strong>{r.title}</strong><span>{r.meta}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
