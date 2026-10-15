import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { connection } from 'next/server';
import { Photo } from '@/components/site/Cards';
import { getPublic } from '@/lib/api';
import { longDate, postUrl } from '@/lib/format';
import type { Author, PostCard } from '@/lib/types';

type Props = { params: Promise<{ slug: string }> };

async function load(props: Props) {
  await connection();
  return getPublic<{ author: Author; posts: PostCard[] }>(`/authors/${encodeURIComponent((await props.params).slug)}`);
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const d = await load(props);
  return d ? { title: `${d.author.name}, ${d.author.role} | BrasQ`, description: d.author.short } : {};
}

export default async function AuthorPage(props: Props) {
  const d = await load(props);
  if (!d) notFound();
  const { author: a, posts } = d;
  const first = a.name.split(' ')[0];
  return (
    <div>
      <section className="bq-band-dark">
        <div className="bq-container" style={{ paddingTop: 44, paddingBottom: 44, display: 'flex', flexWrap: 'wrap', gap: 36, alignItems: 'center' }}>
          <Photo src={a.avatarUrl} alt={a.name} className="bq-photo--1" style={{ flex: '0 1 280px', maxWidth: 300, width: '100%', background: 'repeating-linear-gradient(135deg,#2a2a27 0 10px,#232320 10px 20px)' }} />
          <div style={{ flex: '2 1 400px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Link href="/team" className="bq-tag bq-tag--yellow">Editorial team</Link>
            <h1 className="bq-h1">{a.name}</h1>
            <p style={{ margin: 0, fontSize: 18, color: 'var(--orange-light)', fontWeight: 700 }}>{a.role}</p>
            <p style={{ margin: 0, fontSize: 17, lineHeight: 1.65, color: '#e6e6df', maxWidth: 640 }}>{a.bio}</p>
            <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', fontSize: 14, fontWeight: 700 }}>
              {a.email && <a href={`mailto:${a.email}`} style={{ color: '#fff' }}>{a.email}</a>}
              <Link href="/contact" style={{ color: '#fff' }}>Contact the editors</Link>
            </div>
          </div>
        </div>
      </section>
      {a.facts.length > 0 && (
        <section className="bq-container">
          <div className="bq-facts bq-facts--light" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,200px),1fr))' }}>
            {a.facts.map((f) => <div key={f.label}><strong>{f.value}</strong><span>{f.label}</span></div>)}
          </div>
        </section>
      )}
      <section className="bq-container" style={{ paddingTop: 44, paddingBottom: 64, display: 'flex', flexWrap: 'wrap', gap: 48, alignItems: 'flex-start' }}>
        <div style={{ flex: '1 1 280px', display: 'flex', flexDirection: 'column', gap: 24 }}>
          {a.expertise.length > 0 && (
            <div className="bq-stack-sm">
              <h2 className="bq-h2 bq-h2--sm">Expertise</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>{a.expertise.map((e) => <span key={e} className="bq-chip">{e}</span>)}</div>
            </div>
          )}
          {a.career.length > 0 && (
            <div className="bq-stack-sm">
              <h2 className="bq-h2 bq-h2--sm">Background</h2>
              {a.career.map((c) => (
                <div key={c.years + c.text} style={{ display: 'grid', gridTemplateColumns: '96px 1fr', gap: 10, fontSize: 14, lineHeight: 1.5, borderTop: '1px solid var(--line)', paddingTop: 10 }}>
                  <span className="bq-mono" style={{ fontSize: 12, color: 'var(--muted)', paddingTop: 2 }}>{c.years}</span><span>{c.text}</span>
                </div>
              ))}
            </div>
          )}
          <div style={{ background: 'var(--yellow)', padding: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <strong style={{ fontSize: 16, fontWeight: 900 }}>Independence</strong>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55 }}>{first} has no financial ties to manufacturers or retailers, accepts no gifts and returns loaned test units.</p>
            <Link href="/editorial-guidelines" className="bq-link-strong" style={{ textDecorationColor: 'var(--ink)' }}>Editorial guidelines</Link>
          </div>
        </div>
        <div style={{ flex: '2 1 460px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <h2 className="bq-h2 bq-h2--rule">Articles by {first}</h2>
          {posts.length === 0 && <p className="bq-small">No published articles yet.</p>}
          {posts.map((p) => (
            <Link key={p.id} href={postUrl(p)} className="bq-article-row">
              <Photo src={p.coverImage} className="bq-photo--32" />
              <div>
                <span className="bq-eyebrow">{p.type === 'guide' ? 'Buying guide' : 'Review'}</span>
                <strong>{p.title}</strong>
                <span>Updated {longDate(p.updatedAt)}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
