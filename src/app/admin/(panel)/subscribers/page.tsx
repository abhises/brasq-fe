'use client';
import { useCallback, useEffect, useState } from 'react';
import { adminApi } from '@/lib/admin-client';
import type { Subscriber } from '@/lib/types';
import { useConfirm } from '@/components/admin/ConfirmDialog';
import { Pagination, usePaging, type Paged } from '@/components/admin/Pagination';

export default function SubscribersPage() {
  const [rows, setRows] = useState<Subscriber[] | null>(null);
  const confirm = useConfirm();
  const { page, pageSize, setPage, setPageSize } = usePaging();
  const [meta, setMeta] = useState<Paged | null>(null);
  const load = useCallback(() => adminApi<{ subscribers: Subscriber[] } & Paged>(`/subscribers?page=${page}&pageSize=${pageSize}`).then((d) => { setRows(d.subscribers); setMeta(d); }), [page, pageSize]);
  useEffect(() => { load(); }, [load]);
  const remove = async (s: Subscriber) => {
    if (!(await confirm({ title: 'Remove subscriber?', message: `${s.email} will be removed from the newsletter list.`, confirmLabel: 'Remove' }))) return;
    await adminApi(`/subscribers/${s.id}`, { method: 'DELETE' }); load();
  };
  return (
    <>
      <div className="ad-head"><h1>Subscribers {meta && <span className="ad-hint">({meta.total})</span>}</h1><a className="ad-btn" href="/api/admin/subscribers?format=csv">Export CSV</a></div>
      {!rows ? <p>Loading…</p> : (
        <table className="ad-table">
          <thead><tr><th>Email</th><th>Source</th><th>Signed up</th><th></th></tr></thead>
          <tbody>
            {rows.map((s) => <tr key={s.id}><td className="ad-cell-main">{s.email}</td><td>{s.source ?? '—'}</td><td>{new Date(s.createdAt).toLocaleString()}</td><td className="ad-cell-end"><button className="ad-btn ad-btn--sm ad-btn--danger" onClick={() => remove(s)}>Remove</button></td></tr>)}
            {rows.length === 0 && <tr><td colSpan={4}>No subscribers yet.</td></tr>}
          </tbody>
        </table>
      )}
      {meta && <Pagination {...meta} onChange={setPage} onPageSizeChange={setPageSize} />}
    </>
  );
}
