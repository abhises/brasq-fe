'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Pagination, usePageParam, type Paged } from '@/components/admin/Pagination';
import { adminApi } from '@/lib/admin-client';
import { postUrl } from '@/lib/format';
import type { PostCard, PostStatus } from '@/lib/types';

type Row = PostCard & { status: PostStatus; featured: boolean };

export default function PostsPage() {
  const [posts, setPosts] = useState<Row[] | null>(null);
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');
  const [q, setQ] = useState('');
  const [error, setError] = useState('');
  const [page, setPage] = usePageParam();
  const [meta, setMeta] = useState<Paged | null>(null);
  // a new filter starts again at page 1
  const filter = (fn: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => { fn(e.target.value); if (page > 1) setPage(1); };

  useEffect(() => {
    const t = setTimeout(() => {
      const sp = new URLSearchParams({ page: String(page) });
      if (type) sp.set('type', type);
      if (status) sp.set('status', status);
      if (q) sp.set('q', q);
      adminApi<{ posts: Row[] } & Paged>(`/posts?${sp}`).then((d) => { setPosts(d.posts); setMeta(d); }).catch((e) => setError(e.message));
    }, 200);
    return () => clearTimeout(t);
  }, [type, status, q, page]);

  return (
    <>
      <div className="ad-head">
        <h1>Posts &amp; pages</h1>
        <Link href="/admin/posts/new" className="ad-btn ad-btn--primary">+ New post</Link>
      </div>
      <div className="ad-filters">
        <input placeholder="Search title or slug" value={q} onChange={filter(setQ)} />
        <select value={type} onChange={filter(setType)}>
          <option value="">All types</option><option value="guide">Buying guides</option><option value="review">Reviews</option><option value="page">Pages</option>
        </select>
        <select value={status} onChange={filter(setStatus)}>
          <option value="">Any status</option><option value="published">Published</option><option value="draft">Draft</option>
        </select>
      </div>
      {error && <p className="ad-error">{error}</p>}
      {!posts ? <p>Loading…</p> : (
        <table className="ad-table">
          <thead><tr><th>Title</th><th>Type</th><th>Status</th><th>Category</th><th>Author</th><th>Updated</th><th></th></tr></thead>
          <tbody>
            {posts.map((p) => (
              <tr key={p.id}>
                <td className="ad-cell-main"><Link href={`/admin/posts/${p.id}`}>{p.title}</Link>{p.featured && <span className="ad-pill" style={{ marginLeft: 6 }}>Home hero</span>}<div className="ad-hint">{postUrl(p)}</div></td>
                <td>{p.type}</td>
                <td><span className={`ad-pill ad-pill--${p.status}`}>{p.status}</span></td>
                <td>{p.category?.name ?? '—'}</td>
                <td>{p.author?.name ?? '—'}</td>
                <td className="ad-cell-hide">{new Date(p.updatedAt).toLocaleDateString()}</td>
                <td className="ad-cell-corner"><a className="ad-btn ad-btn--sm" href={postUrl(p) + (p.status === 'draft' ? '?preview=1' : '')} target="_blank">View ↗</a></td>
              </tr>
            ))}
            {posts.length === 0 && <tr><td colSpan={7}>No posts found.</td></tr>}
          </tbody>
        </table>
      )}
      {meta && <Pagination {...meta} onChange={setPage} />}
    </>
  );
}
