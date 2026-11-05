'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/admin-client';
import { adminTypeLabel } from '@/lib/format';

type Stats = {
  counts: Record<'guide' | 'review' | 'comparison' | 'informational' | 'page' | 'drafts' | 'media' | 'categories' | 'authors' | 'subscribers', number | undefined>;
  recentPosts: { id: string; title: string; type: string; status: string; updatedAt: string }[];
  recentSubscribers: { id: string; email: string; source: string | null; createdAt: string }[];
  storage: 'local' | 's3';
};

const GLANCE: [keyof Stats['counts'], string, string][] = [
  ['guide', 'Buying guides', '/admin/posts'],
  ['review', 'Reviews', '/admin/posts'],
  ['comparison', 'Comparisons', '/admin/posts'],
  ['informational', 'Info posts', '/admin/posts'],
  ['page', 'Pages', '/admin/posts'],
  ['drafts', 'Drafts', '/admin/posts'],
  ['media', 'Media files', '/admin/media'],
  ['categories', 'Categories', '/admin/categories'],
  ['authors', 'Authors', '/admin/authors'],
  ['subscribers', 'Subscribers', '/admin/subscribers'],
];

const when = (d: string) =>
  new Date(d).toLocaleString(undefined, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    adminApi<Stats>('/stats').then(setStats).catch((e) => setError(e.message));
  }, []);

  return (
    <>
      <div className="ad-head">
        <h1>Dashboard</h1>
      </div>
      {error && <p className="ad-error">{error}</p>}
      <div className="ad-dash">
        <section className="ad-panel">
          <h2>At a glance</h2>
          {!stats ? <p className="ad-hint">Loading…</p> : (
            <ul className="ad-glance">
              {GLANCE.map(([key, label, href]) => (
                <li key={key}><Link href={href}><b>{stats.counts[key] ?? 0}</b> {label}</Link></li>
              ))}
            </ul>
          )}
          {stats && <p className="ad-hint">Uploads are stored {stats.storage === 's3' ? 'in the S3 bucket' : "on the server's disk"}.</p>}
        </section>

        <section className="ad-panel">
          <h2>Create</h2>
          <div className="ad-quick">
            <Link className="ad-btn ad-btn--primary" href="/admin/posts/new">+ New post</Link>
            <Link className="ad-btn" href="/admin/front-page">Edit front page</Link>
            <Link className="ad-btn" href="/admin/categories">+ Category</Link>
            <Link className="ad-btn" href="/admin/authors">+ Author</Link>
            <Link className="ad-btn" href="/admin/media">Upload media</Link>
          </div>
          <p className="ad-hint">Pick the post type (guide, review, comparison, info post or page) on the new post screen.</p>
        </section>

        <section className="ad-panel">
          <h2>Recently updated posts</h2>
          {!stats ? <p className="ad-hint">Loading…</p> : stats.recentPosts.length === 0 ? (
            <p className="ad-hint">Nothing yet. <Link href="/admin/posts/new">Write your first post</Link>.</p>
          ) : (
            <ul className="ad-activity">
              {stats.recentPosts.map((p) => (
                <li key={p.id}>
                  <span className="ad-hint">{when(p.updatedAt)}</span>
                  <span>
                    <Link href={`/admin/posts/${p.id}`}>{p.title}</Link>{' '}
                    <span className="ad-hint">· {adminTypeLabel(p.type)}{p.status === 'draft' ? ' · draft' : ''}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
          <Link href="/admin/posts" className="ad-more">All posts &amp; pages →</Link>
        </section>

        <section className="ad-panel">
          <h2>New subscribers</h2>
          {!stats ? <p className="ad-hint">Loading…</p> : stats.recentSubscribers.length === 0 ? (
            <p className="ad-hint">No subscribers yet.</p>
          ) : (
            <ul className="ad-activity">
              {stats.recentSubscribers.map((s) => (
                <li key={s.id}><span className="ad-hint">{when(s.createdAt)}</span><span>{s.email}</span></li>
              ))}
            </ul>
          )}
          <Link href="/admin/subscribers" className="ad-more">All subscribers →</Link>
        </section>
      </div>
    </>
  );
}
