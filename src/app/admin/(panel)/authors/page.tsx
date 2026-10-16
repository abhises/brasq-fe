'use client';
import { useCallback, useEffect, useState } from 'react';
import { adminApi } from '@/lib/admin-client';
import type { Author } from '@/lib/types';
import { useConfirm } from '@/components/admin/ConfirmDialog';
import { Pagination, usePageParam, type Paged } from '@/components/admin/Pagination';

type Row = Author & { _count: { posts: number } };
type Edit = { id: string; name: string; slug: string; role: string; short: string; bio: string; email: string; avatarUrl: string; facts: string; expertise: string; career: string; sortOrder: number; showOnHome: boolean };

const blank: Edit = { id: '', name: '', slug: '', role: '', short: '', bio: '', email: '', avatarUrl: '', facts: '', expertise: '', career: '', sortOrder: 0, showOnHome: true };
const lines = (s: string) => s.split('\n').map((l) => l.trim()).filter(Boolean);
const pairs = (s: string) => lines(s).map((l) => { const i = l.indexOf('|'); return i < 0 ? [l, ''] : [l.slice(0, i).trim(), l.slice(i + 1).trim()]; });

const toEdit = (a: Author): Edit => ({
  id: a.id, name: a.name, slug: a.slug, role: a.role, short: a.short, bio: a.bio, email: a.email ?? '', avatarUrl: a.avatarUrl ?? '',
  facts: a.facts.map((f) => `${f.value} | ${f.label}`).join('\n'), expertise: a.expertise.join('\n'),
  career: a.career.map((c) => `${c.years} | ${c.text}`).join('\n'), sortOrder: a.sortOrder, showOnHome: a.showOnHome,
});

export default function AuthorsPage() {
  const confirm = useConfirm();
  const [rows, setRows] = useState<Row[]>([]);
  const [edit, setEdit] = useState<Edit | null>(null);
  const [error, setError] = useState('');
  const [page, setPage] = usePageParam();
  const [meta, setMeta] = useState<Paged | null>(null);
  const load = useCallback(() => adminApi<{ authors: Row[] } & Paged>(`/authors?page=${page}`).then((d) => { setRows(d.authors); setMeta(d); }), [page]);
  useEffect(() => { load(); }, [load]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!edit) return;
    setError('');
    const { id, facts, expertise, career, email, avatarUrl, ...rest } = edit;
    const body = {
      ...rest, email: email || null, avatarUrl: avatarUrl || null, sortOrder: Number(rest.sortOrder),
      facts: pairs(facts).map(([value, label]) => ({ value, label })), expertise: lines(expertise),
      career: pairs(career).map(([years, text]) => ({ years, text })),
    };
    try {
      await adminApi(id ? `/authors/${id}` : '/authors', { method: id ? 'PATCH' : 'POST', json: body });
      setEdit(null); load();
    } catch (err) { setError((err as Error).message); }
  };
  const remove = async (a: Row) => {
    if (!(await confirm({ title: `Delete author "${a.name}"?`, message: `Their ${a._count.posts} posts will be left without an author.` }))) return;
    await adminApi(`/authors/${a.id}`, { method: 'DELETE' }); load();
  };
  const f = (k: keyof Edit) => ({ value: edit![k] as string, onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setEdit({ ...edit!, [k]: e.target.value }) });

  return (
    <>
      <div className="ad-head"><h1>Authors</h1><button className="ad-btn ad-btn--primary" onClick={() => setEdit({ ...blank, sortOrder: meta?.total ?? rows.length })}>+ New author</button></div>
      {edit && (
        <form className="ad-card ad-form" style={{ marginBottom: 16, maxWidth: 760 }} onSubmit={save}>
          <div className="ad-2"><label>Name<input required {...f('name')} /></label><label>Slug<input placeholder="from name" {...f('slug')} /></label></div>
          <div className="ad-2"><label>Role<input {...f('role')} /></label><label>Email<input type="email" {...f('email')} /></label></div>
          <label>Avatar URL<input {...f('avatarUrl')} /><span className="ad-hint">Upload in Media, then paste the URL.</span></label>
          <label>Short bio (cards)<input {...f('short')} /></label>
          <label>Bio<textarea style={{ fontFamily: 'var(--sans)' }} {...f('bio')} /></label>
          <label>Facts<textarea placeholder={'9 years | experience as a product tester'} {...f('facts')} /><span className="ad-hint">One per line: value | label</span></label>
          <label>Expertise<textarea placeholder={'Vacuums\nRobot vacuums'} {...f('expertise')} /><span className="ad-hint">One per line</span></label>
          <label>Background<textarea placeholder={'2021 – now | Senior tester, BrasQ'} {...f('career')} /><span className="ad-hint">One per line: years | text</span></label>
          <div className="ad-2">
            <label>Sort order<input type="number" value={edit.sortOrder} onChange={(e) => setEdit({ ...edit, sortOrder: Number(e.target.value) })} /></label>
            <label className="ad-check" style={{ alignSelf: 'end' }}><input type="checkbox" checked={edit.showOnHome} onChange={(e) => setEdit({ ...edit, showOnHome: e.target.checked })} />Show under “Our testers” on the home page</label>
          </div>
          {error && <p className="ad-error">{error}</p>}
          <div className="ad-savebar"><button className="ad-btn ad-btn--primary">Save</button><button type="button" className="ad-btn" onClick={() => setEdit(null)}>Cancel</button></div>
        </form>
      )}
      <table className="ad-table">
        <thead><tr><th></th><th>Name</th><th>Role</th><th>Posts</th><th></th></tr></thead>
        <tbody>{rows.map((a) => (
          <tr key={a.id}>
            <td style={{ width: 52 }}>{a.avatarUrl && <img src={a.avatarUrl} alt="" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />}</td>
            <td className="ad-cell-grow"><strong>{a.name}</strong><div className="ad-hint">/author/{a.slug}</div></td><td className="ad-cell-main">{a.role}</td><td>{a._count.posts}<span className="ad-sm-only"> posts</span></td>
            <td className="ad-cell-end" style={{ whiteSpace: 'nowrap' }}><button className="ad-btn ad-btn--sm" onClick={() => setEdit(toEdit(a))}>Edit</button> <button className="ad-btn ad-btn--sm ad-btn--danger" onClick={() => remove(a)}>Delete</button></td>
          </tr>
        ))}</tbody>
      </table>
      {meta && <Pagination {...meta} onChange={setPage} />}
    </>
  );
}
