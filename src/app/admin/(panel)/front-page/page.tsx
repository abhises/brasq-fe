'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useConfirm } from '@/components/admin/ConfirmDialog';
import { SectionsEditor } from '@/components/admin/SectionsEditor';
import { adminApi } from '@/lib/admin-client';
import type { SectionsDoc, SectionType } from '@/lib/types';

type State = { draft: SectionsDoc; isLive: boolean; publishedAt: string | null; hasUnpublishedChanges: boolean };
const FONTS = 'https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800;900&family=IBM+Plex+Mono:wght@400;500;600&display=swap';

export default function FrontPageEditor() {
  const confirm = useConfirm();
  const [state, setState] = useState<State | null>(null);
  const [types, setTypes] = useState<SectionType[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  const [html, setHtml] = useState('');
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const frame = useRef<HTMLIFrameElement>(null);
  const scroll = useRef(0);

  const load = () => adminApi<State>('/front-page').then((s) => { setState(s); setDirty(false); }).catch((e) => setMsg({ ok: false, text: e.message }));
  useEffect(() => { load(); adminApi<{ types: SectionType[] }>('/section-types').then((d) => setTypes(d.types)); }, []);

  // live preview of the draft
  useEffect(() => {
    if (!state) return;
    const t = setTimeout(() => {
      adminApi<{ html: string }>('/front-page/preview', { method: 'POST', json: { sections: state.draft } }).then((r) => {
        scroll.current = frame.current?.contentWindow?.scrollY ?? scroll.current; setHtml(r.html);
      }).catch((e) => setMsg({ ok: false, text: e.message }));
    }, 350);
    return () => clearTimeout(t);
  }, [state]);

  const mark = useCallback((doScroll: boolean) => {
    const d = frame.current?.contentDocument; if (!d) return;
    d.querySelectorAll('.bq-sec.is-selected').forEach((el) => el.classList.remove('is-selected'));
    const el = selected ? d.querySelector(`[data-section="${CSS.escape(selected)}"]`) : null;
    if (el) { el.classList.add('is-selected'); if (doScroll) el.scrollIntoView({ block: 'start', behavior: 'smooth' }); }
  }, [selected]);
  useEffect(() => { mark(true); }, [mark]);

  const saveDraft = useCallback(async () => {
    if (!state) return false;
    setBusy(true);
    try { await adminApi('/front-page/draft', { method: 'PUT', json: { sections: state.draft } }); setDirty(false); setMsg({ ok: true, text: `Draft saved ${new Date().toLocaleTimeString()}` }); setState((s) => (s ? { ...s, hasUnpublishedChanges: true } : s)); return true; }
    catch (e) { setMsg({ ok: false, text: (e as Error).message }); return false; }
    finally { setBusy(false); }
  }, [state]);

  const publish = async () => {
    if (!(await confirm({ title: 'Publish the front page?', message: 'Visitors see this version from now on.', confirmLabel: 'Publish' }))) return;
    if (dirty && !(await saveDraft())) return;
    setBusy(true);
    try { await adminApi('/front-page/publish', { method: 'POST' }); setMsg({ ok: true, text: 'Published. The front page is live.' }); await load(); }
    catch (e) { setMsg({ ok: false, text: (e as Error).message }); } finally { setBusy(false); }
  };
  const discard = async () => {
    if (!(await confirm({ title: 'Discard the draft?', message: state?.isLive ? 'The draft goes back to the live version.' : 'The draft goes back to the original front page.', confirmLabel: 'Discard' }))) return;
    await adminApi('/front-page/discard', { method: 'POST' }); setSelected(null); setMsg({ ok: true, text: 'Draft discarded.' }); await load();
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); saveDraft(); } };
    const onLeave = (e: BeforeUnloadEvent) => { if (dirty) e.preventDefault(); };
    window.addEventListener('keydown', onKey); window.addEventListener('beforeunload', onLeave);
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('beforeunload', onLeave); };
  }, [saveDraft, dirty]);

  if (!state) return <p>{msg?.text ?? 'Loading…'}</p>;
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const doc = `<!doctype html><html><head><meta charset="utf-8"><base href="${origin}/" target="_blank"><link href="${FONTS}" rel="stylesheet"><link rel="stylesheet" href="${origin}/brasq.css"><link rel="stylesheet" href="${origin}/sections.css"><style>body{margin:0;background:var(--paper)}.bq-sec.is-selected{outline:3px dashed var(--orange);outline-offset:-3px}</style></head><body>${html}</body></html>`;
  const status = !state.isLive ? 'Not published yet: visitors still see the original front page.' : state.hasUnpublishedChanges || dirty ? 'Live, with unpublished changes.' : `Live${state.publishedAt ? ` since ${new Date(state.publishedAt).toLocaleString()}` : ''}.`;

  return (
    <>
      <div className="ad-head">
        <div><h1>Front page</h1><p className="ad-hint" style={{ margin: '4px 0 0' }}>{status}</p></div>
        <div className="ad-savebar">
          {msg && <span className={msg.ok ? 'ad-ok' : 'ad-error'}>{msg.text}</span>}
          {dirty && !msg && <span className="ad-hint">Unsaved changes</span>}
          <a className="ad-btn" href="/?preview=1" target="_blank" onClick={async (e) => { if (dirty) { e.preventDefault(); if (await saveDraft()) window.open('/?preview=1', '_blank'); } }}>Preview on site ↗</a>
          {(state.hasUnpublishedChanges || dirty) && <button className="ad-btn" disabled={busy} onClick={discard}>Discard draft</button>}
          <button className="ad-btn" disabled={busy} onClick={saveDraft}>Save draft</button>
          <button className="ad-btn ad-btn--primary" disabled={busy} onClick={publish}>Publish</button>
        </div>
      </div>
      <div className="fp-editor">
        <SectionsEditor scope="home" doc={state.draft} onChange={(d) => { setState({ ...state, draft: d }); setDirty(true); setMsg(null); }} selected={selected} onSelect={setSelected} types={types} />
        <div className="ad-preview fp-preview"><iframe ref={frame} title="Front page preview" srcDoc={doc} sandbox="allow-same-origin allow-popups" onLoad={() => { frame.current?.contentWindow?.scrollTo(0, scroll.current); mark(false); }} /></div>
      </div>
    </>
  );
}
