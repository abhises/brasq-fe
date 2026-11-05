import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { connection } from 'next/server';
import { Photo } from '@/components/site/Cards';
import { getPublic } from '@/lib/api';
import { longDate, postUrl, typeLabel } from '@/lib/format';
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
  const social = [a.linkedinUrl && { href: a.linkedinUrl, label: 'LinkedIn', icon: LINKEDIN }, a.youtubeUrl && { href: a.youtubeUrl, label: 'YouTube', icon: YOUTUBE }]
    .filter((x): x is { href: string; label: string; icon: string } => !!x);
  // Person schema: sameAs ties the author to their profiles for search engines
  const ld = { '@context': 'https://schema.org', '@type': 'Person', name: a.name, jobTitle: a.role || undefined, description: a.short || undefined, image: a.avatarUrl || undefined, sameAs: social.length ? social.map((x) => x.href) : undefined };
  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, '\\u003c') }} />
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
              {social.map((x) => (
                <a key={x.label} href={x.href} target="_blank" rel="me noopener noreferrer" style={{ color: '#fff', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d={x.icon} /></svg>{x.label}
                </a>
              ))}
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
                <span className="bq-eyebrow">{typeLabel(p.type)}</span>
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

const LINKEDIN = 'M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5M3 9.75h4V21H3zM9.5 9.75h3.8v1.6h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-4.9c0-1.17-.02-2.68-1.63-2.68-1.64 0-1.89 1.28-1.89 2.6V21h-4z';
const YOUTUBE = 'M23.5 6.5a3 3 0 0 0-2.1-2.1C19.5 4 12 4 12 4s-7.5 0-9.4.4A3 3 0 0 0 .5 6.5C0 8.4 0 12 0 12s0 3.6.5 5.5a3 3 0 0 0 2.1 2.1c1.9.4 9.4.4 9.4.4s7.5 0 9.4-.4a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.5.5-5.5s0-3.6-.5-5.5M9.6 15.6V8.4l6.3 3.6z';
