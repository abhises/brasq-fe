import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { connection } from 'next/server';
import { Avatar, GuideListCard } from '@/components/site/Cards';
import { getPublic } from '@/lib/api';
import type { AuthorCard, Category, PostCard } from '@/lib/types';

type Data = { category: Category; guides: PostCard[]; authors: AuthorCard[]; others: { slug: string; name: string }[] };
type Props = { params: Promise<{ slug: string }> };

async function load(props: Props) {
  await connection();
  return getPublic<Data>(`/categories/${encodeURIComponent((await props.params).slug)}`);
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const d = await load(props);
  return d ? { title: `${d.category.name}: buying guides and reviews | BrasQ`, description: d.category.intro } : {};
}

export default async function CategoryPage(props: Props) {
  const d = await load(props);
  if (!d) notFound();
  return (
    <div className="bq-page">
      <div className="bq-stack" style={{ gap: 14 }}>
        <nav className="bq-crumbs" style={{ margin: 0 }}><Link href="/">Home</Link><span>{d.category.name}</span></nav>
        <h1 className="bq-h1 bq-h1--xl">{d.category.name}</h1>
        <p className="bq-lead" style={{ fontSize: 18, maxWidth: 680 }}>{d.category.intro}</p>
      </div>
      <div className="bq-stack" style={{ gap: 20 }}>
        <h2 className="bq-h2 bq-h2--rule" style={{ fontSize: 26 }}>Buying guides</h2>
        {d.guides.length ? d.guides.map((g) => <GuideListCard key={g.id} post={g} />) : <p className="bq-small">No buying guides in this category yet.</p>}
      </div>
      {d.authors.length > 0 && (
        <div className="bq-stack">
          <h2 className="bq-h2 bq-h2--sm">Tested by</h2>
          {d.authors.map((a) => (
            <Link key={a.slug} href={`/author/${a.slug}`} style={{ textDecoration: 'none', display: 'grid', gridTemplateColumns: '56px 1fr', gap: 14, alignItems: 'center', maxWidth: 520 }}>
              <Avatar author={a} size={56} />
              <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}><strong style={{ fontSize: 16 }}>{a.name}</strong><span style={{ fontSize: 14, color: 'var(--muted)' }}>{a.short}</span></span>
            </Link>
          ))}
        </div>
      )}
      <div className="bq-stack-sm" style={{ gap: 12 }}>
        <h2 className="bq-h2 bq-h2--sm">Other categories</h2>
        <div className="bq-pills">{d.others.map((o) => <Link key={o.slug} href={`/category/${o.slug}`}>{o.name}</Link>)}</div>
      </div>
    </div>
  );
}
