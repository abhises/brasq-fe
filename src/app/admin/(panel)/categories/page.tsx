'use client';
import { useCallback, useEffect, useState } from 'react';
import { adminApi } from '@/lib/admin-client';
import type { Category } from '@/lib/types';

type Row = Category & { _count: { posts: number } };
const blank = { id: '', name: '', slug: '', intro: '', sortOrder: 0 };

export default function CategoriesPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [edit, setEdit] = useState<typeof blank | null>(null);
  const [error, setError] = useState('');
  const load = useCallback(() => adminApi<{ categories: Row[] }>('/categories').then((d) => setRows(d.categories)), []);
  useEffect(() => { load(); }, [load]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!edit) return;
    setError('');
    const { id, ...body } = edit;
    try {
      await adminApi(id ? `/categories/${id}` : '/categories', { method: id ? 'PATCH' : 'POST', json: { ...body, sortOrder: Number(body.sortOrder) } });
      setEdit(null); load();
    } catch (err) { setError((err as Error).message); }
  };
  const remove = async (c: Row) => {
    if (!confirm(`Delete category "${c.name}"? Its ${c._count.posts} posts will be left without a category.`)) return;
    await adminApi(`/categories/${c.id}`, { method: 'DELETE' }); load();
  };

  return (
    <>
      <div className="ad-head"><h1>Categories</h1><button className="ad-btn ad-btn--primary" onClick={() => setEdit({ ...blank, sortOrder: rows.length })}>+ New category</button></div>
      {edit && (
        <form className="ad-card ad-form" style={{ marginBottom: 16, maxWidth: 640 }} onSubmit={save}>
          <div className="ad-2">
            <label>Name<input required value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} /></label>
            <label>Slug<input value={edit.slug} placeholder="from name" onChange={(e) => setEdit({ ...edit, slug: e.target.value })} /></label>
          </div>
          <label>Intro<textarea style={{ fontFamily: 'var(--sans)' }} value={edit.intro} onChange={(e) => setEdit({ ...edit, intro: e.target.value })} /></label>
          <label>Sort order<input type="number" value={edit.sortOrder} onChange={(e) => setEdit({ ...edit, sortOrder: Number(e.target.value) })} /></label>
          {error && <p className="ad-error">{error}</p>}
          <div className="ad-savebar"><button className="ad-btn ad-btn--primary">Save</button><button type="button" className="ad-btn" onClick={() => setEdit(null)}>Cancel</button></div>
        </form>
      )}
      <table className="ad-table">
        <thead><tr><th>#</th><th>Name</th><th>Slug</th><th>Posts</th><th></th></tr></thead>
        <tbody>{rows.map((c) => (
          <tr key={c.id}>
            <td className="ad-cell-hide">{c.sortOrder}</td><td className="ad-cell-main"><strong>{c.name}</strong><div className="ad-hint">{c.intro}</div></td><td className="ad-cell-hide">/category/{c.slug}</td><td>{c._count.posts}<span className="ad-sm-only"> posts</span></td>
            <td className="ad-cell-end" style={{ whiteSpace: 'nowrap' }}><button className="ad-btn ad-btn--sm" onClick={() => setEdit({ id: c.id, name: c.name, slug: c.slug, intro: c.intro, sortOrder: c.sortOrder })}>Edit</button> <button className="ad-btn ad-btn--sm ad-btn--danger" onClick={() => remove(c)}>Delete</button></td>
          </tr>
        ))}</tbody>
      </table>
    </>
  );
}
