'use client';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { SectionPreview } from '@/components/admin/SectionPreview';
import { adminApi } from '@/lib/admin-client';
import type { SectionType } from '@/lib/types';

const SCOPE_LABEL: Record<string, string> = { any: 'Posts and front page', post: 'Posts only', home: 'Front page only' };

export default function SectionsLibraryPage() {
  const [types, setTypes] = useState<SectionType[] | null>(null);
  const [group, setGroup] = useState('All');
  const [q, setQ] = useState('');
  const [error, setError] = useState('');

  useEffect(() => { adminApi<{ types: SectionType[] }>('/section-types?preview=1').then((d) => setTypes(d.types)).catch((e) => setError(e.message)); }, []);

  const groups = useMemo(() => ['All', ...new Set((types ?? []).map((t) => t.group))], [types]);
  const list = (types ?? []).filter((t) => (group === 'All' || t.group === group) && `${t.name} ${t.description} ${t.key}`.toLowerCase().includes(q.toLowerCase()));

  return (
    <>
      <div className="ad-head">
        <div><h1>Sections</h1><p className="ad-hint" style={{ margin: '4px 0 0' }}>The building blocks of posts and the front page. Built-in types are locked; duplicate one to make your own version.</p></div>
        <Link href="/admin/sections/new" className="ad-btn ad-btn--primary">+ New section type</Link>
      </div>
      <div className="ad-filters">
        <input placeholder="Search sections" value={q} onChange={(e) => setQ(e.target.value)} />
        <div className="ad-seg" role="group" aria-label="Group">{groups.map((g) => <button key={g} type="button" aria-pressed={g === group} onClick={() => setGroup(g)}>{g}</button>)}</div>
      </div>
      {error && <p className="ad-error">{error}</p>}
      {!types ? <p>Loading…</p> : (
        <div className="sl-grid">
          {list.map((t) => (
            <Link key={t.key} href={`/admin/sections/${t.key}`} className="sl-card">
              <SectionPreview html={t.previewHtml ?? ''} scale={0.36} width={1000} maxHeight={170} minHeight={170} className="sl-card__thumb" />
              <span className="sl-card__body">
                <strong>{t.name}</strong>
                <span className="sl-card__desc">{t.description}</span>
                <span className="sl-card__meta">
                  <span className={`ad-pill ${t.builtIn ? '' : 'ad-pill--custom'}`}>{t.builtIn ? 'Built-in' : 'Custom'}</span>
                  <span>{t.group}</span>
                  <span>· {t.uses ? `used in ${t.uses} ${t.uses === 1 ? 'page' : 'pages'}` : 'not used yet'}</span>
                </span>
                <span className="sl-card__meta">{SCOPE_LABEL[t.scope]}{t.placement !== 'body' ? ` · ${t.placement === 'top' ? 'top of page' : 'bottom of page'}` : ''}</span>
              </span>
            </Link>
          ))}
          {list.length === 0 && <p>No section types match. <Link href="/admin/sections/new">Create a new one</Link>.</p>}
        </div>
      )}
    </>
  );
}
