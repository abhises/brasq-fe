'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect } from 'react';

/** Response shape of a paged admin list (`?page=` sent). */
export type Paged = { page: number; pageSize: number; total: number };

/** Current `?page=` (1-based) and a setter that pushes a history entry, so Back returns to the previous page. */
export function usePageParam() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const page = Math.max(1, Math.floor(Number(params.get('page'))) || 1);
  const setPage = useCallback((p: number) => {
    const q = new URLSearchParams(params);
    if (p > 1) q.set('page', String(p)); else q.delete('page');
    router.push(q.size ? `${pathname}?${q}` : pathname);
  }, [params, router, pathname]);
  return [page, setPage] as const;
}

/** 1 … 4 5 [6] 7 8 … 20 — always the first and last page, two either side of the current one. */
function pageList(page: number, pages: number): (number | '…')[] {
  const out: (number | '…')[] = [];
  for (let p = 1; p <= pages; p++) {
    if (p === 1 || p === pages || Math.abs(p - page) <= 2) out.push(p);
    else if (out[out.length - 1] !== '…') out.push('…');
  }
  return out;
}

export function Pagination({ page, pageSize, total, onChange }: Paged & { onChange: (page: number) => void }) {
  const pages = Math.max(1, Math.ceil(total / pageSize));

  // e.g. the last item on the last page was deleted: fall back to the new last page
  useEffect(() => { if (total > 0 && page > pages) onChange(pages); }, [page, pages, total, onChange]);

  if (!total || !pageSize || total <= pageSize) return null; // also covers a backend without paging (no total)
  const go = (p: number) => { onChange(p); window.scrollTo({ top: 0 }); };
  const from = (page - 1) * pageSize + 1;
  return (
    <nav className="ad-pager" aria-label="Pagination">
      <div className="ad-pager__pages">
        <button className="ad-btn ad-btn--sm" disabled={page <= 1} onClick={() => go(page - 1)} aria-label="Previous page">‹ Prev</button>
        {pageList(page, pages).map((p, i) => p === '…'
          ? <span key={`gap${i}`} className="ad-pager__gap">…</span>
          : <button key={p} className={`ad-btn ad-btn--sm${p === page ? ' ad-btn--primary' : ''}`} aria-current={p === page ? 'page' : undefined} onClick={() => go(p)}>{p}</button>)}
        <button className="ad-btn ad-btn--sm" disabled={page >= pages} onClick={() => go(page + 1)} aria-label="Next page">Next ›</button>
      </div>
      <span className="ad-hint">Showing {from}–{Math.min(page * pageSize, total)} of {total}</span>
    </nav>
  );
}
