'use client';
import { css as cssLang } from '@codemirror/lang-css';
import { html as htmlLang } from '@codemirror/lang-html';
import { json as jsonLang } from '@codemirror/lang-json';
import type { EditorView } from '@codemirror/view';
import CodeMirror from '@uiw/react-codemirror';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { adminApi } from '@/lib/admin-client';
import { postUrl } from '@/lib/format';
import type { Author, Category, Media, Post, PostStatus, PostType, StickyBar } from '@/lib/types';
import { MediaPicker } from './MediaPicker';

type Form = {
  type: PostType; status: PostStatus; slug: string; title: string; excerpt: string; html: string; css: string;
  coverImage: string; seoTitle: string; seoDescription: string; jsonLd: string;
  testedCount: string; testWeeks: string; topPick: string; newsletterPopup: boolean; featured: boolean;
  categoryId: string; authorId: string; bar: Required<StickyBar>;
};

const EMPTY_BAR = { name: '', score: '', price: '', shop: '', url: '', image: '' };
const EMPTY: Form = {
  type: 'guide', status: 'draft', slug: '', title: '', excerpt: '', html: '', css: '', coverImage: '', seoTitle: '', seoDescription: '', jsonLd: '',
  testedCount: '', testWeeks: '', topPick: '', newsletterPopup: false, featured: false, categoryId: '', authorId: '', bar: EMPTY_BAR,
};

const STARTER_HTML = `<article class="bq-article">
<nav class="bq-crumbs"><a href="/">Home</a><span>New guide</span></nav>
<div class="bq-guide-top">
  <header class="bq-guide-head">
    <span class="bq-tag">Buying guide</span>
    <h1 class="bq-h1">The best … of 2026</h1>
    <p class="bq-lead">One-paragraph summary of the verdict.</p>
    <p class="bq-disclosure">We choose products independently. We may earn a commission through links on this page; your price stays the same. <a href="/how-we-make-money">Affiliate policy</a></p>
  </header>
  <div class="bq-photo bq-guide-hero"><!-- <img src="…" alt="…"> --></div>
</div>
<div class="bq-content" style="margin:0 auto">
  <section id="picks" class="bq-section">
    <h2 class="bq-h2">Our picks at a glance</h2>
    <!-- copy a .bq-pick block from CONTENT_GUIDE.md -->
  </section>
</div>
</article>`;

const toForm = (p: Post): Form => ({
  type: p.type, status: p.status, slug: p.slug, title: p.title, excerpt: p.excerpt, html: p.html, css: p.css,
  coverImage: p.coverImage ?? '', seoTitle: p.seoTitle ?? '', seoDescription: p.seoDescription ?? '', jsonLd: p.jsonLd ?? '',
  testedCount: p.testedCount?.toString() ?? '', testWeeks: p.testWeeks?.toString() ?? '', topPick: p.topPick ?? '',
  newsletterPopup: p.newsletterPopup, featured: p.featured, categoryId: p.categoryId ?? '', authorId: p.authorId ?? '',
  bar: { ...EMPTY_BAR, ...(p.stickyBar ?? {}) } as Required<StickyBar>,
});

const toPayload = (f: Form) => {
  const n = (v: string) => (v.trim() === '' ? null : Number(v));
  const s = (v: string) => (v.trim() === '' ? null : v);
  return {
    type: f.type, status: f.status, slug: f.slug || f.title, title: f.title, excerpt: f.excerpt, html: f.html, css: f.css,
    coverImage: s(f.coverImage), seoTitle: s(f.seoTitle), seoDescription: s(f.seoDescription), jsonLd: s(f.jsonLd),
    testedCount: n(f.testedCount), testWeeks: n(f.testWeeks), topPick: s(f.topPick),
    newsletterPopup: f.newsletterPopup, featured: f.featured, categoryId: s(f.categoryId), authorId: s(f.authorId),
    stickyBar: f.bar.name && f.bar.url ? f.bar : null,
  };
};

type Tab = 'html' | 'css' | 'jsonld' | 'preview';

export function PostEditor({ id }: { id?: string }) {
  const router = useRouter();
  const [form, setForm] = useState<Form>(id ? EMPTY : { ...EMPTY, html: STARTER_HTML });
  const [loaded, setLoaded] = useState(!id);
  const [cats, setCats] = useState<Category[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [tab, setTab] = useState<Tab>('html');
  const [split, setSplit] = useState(true);
  const [mobile, setMobile] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [picker, setPicker] = useState<null | 'insert' | 'cover' | 'bar'>(null);
  const views = useRef<Partial<Record<'html' | 'css', EditorView>>>({});

  useEffect(() => {
    adminApi<{ categories: Category[] }>('/categories').then((d) => setCats(d.categories));
    adminApi<{ authors: Author[] }>('/authors').then((d) => setAuthors(d.authors));
    if (id) adminApi<{ post: Post }>(`/posts/${id}`).then((d) => { setForm(toForm(d.post)); setLoaded(true); }).catch((e) => setMsg({ ok: false, text: e.message }));
  }, [id]);

  const set = <K extends keyof Form>(k: K, v: Form[K]) => { setForm((f) => ({ ...f, [k]: v })); setDirty(true); };
  const setBar = (k: keyof StickyBar, v: string) => { setForm((f) => ({ ...f, bar: { ...f.bar, [k]: v } })); setDirty(true); };

  const save = useCallback(async (override?: Partial<Form>) => {
    const f = { ...form, ...override };
    if (!f.title.trim()) { setMsg({ ok: false, text: 'Title is required' }); return; }
    if (f.jsonLd.trim()) { try { JSON.parse(f.jsonLd); } catch { setMsg({ ok: false, text: 'JSON-LD is not valid JSON' }); return; } }
    setSaving(true); setMsg(null);
    try {
      const body = toPayload(f);
      const { post } = id
        ? await adminApi<{ post: Post }>(`/posts/${id}`, { method: 'PATCH', json: body })
        : await adminApi<{ post: Post }>('/posts', { method: 'POST', json: body });
      setForm(toForm(post)); setDirty(false);
      setMsg({ ok: true, text: `Saved ${new Date().toLocaleTimeString()}` });
      if (!id) router.replace(`/admin/posts/${post.id}`);
    } catch (e) {
      setMsg({ ok: false, text: (e as Error).message });
    } finally { setSaving(false); }
  }, [form, id, router]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); save(); } };
    const onLeave = (e: BeforeUnloadEvent) => { if (dirty) e.preventDefault(); };
    window.addEventListener('keydown', onKey);
    window.addEventListener('beforeunload', onLeave);
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('beforeunload', onLeave); };
  }, [save, dirty]);

  const remove = async () => {
    if (!id || !confirm(`Delete "${form.title}"? This cannot be undone.`)) return;
    await adminApi(`/posts/${id}`, { method: 'DELETE' });
    router.push('/admin');
  };

  const onPicked = (m: Media) => {
    if (picker === 'cover') set('coverImage', m.url);
    else if (picker === 'bar') setBar('image', m.url);
    else {
      const view = views.current[tab === 'css' ? 'css' : 'html'];
      const snippet = tab === 'css' ? `url("${m.url}")` : `<img src="${m.url}" alt="${m.alt}" loading="lazy">`;
      if (view) {
        const { from, to } = view.state.selection.main;
        view.dispatch({ changes: { from, to, insert: snippet }, selection: { anchor: from + snippet.length } });
        view.focus();
      } else set('html', form.html + '\n' + snippet);
    }
    setPicker(null);
  };

  // Preview: same stylesheet as the live site, debounced so typing stays smooth.
  const [doc, setDoc] = useState('');
  useEffect(() => {
    const t = setTimeout(() => {
      const origin = window.location.origin;
      setDoc(`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><base href="${origin}/" target="_blank">
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800;900&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${origin}/brasq.css"><style>${form.css}</style></head><body>${form.html}</body></html>`);
    }, 300);
    return () => clearTimeout(t);
  }, [form.html, form.css]);

  const extensions = useMemo(() => ({ html: [htmlLang()], css: [cssLang()], jsonld: [jsonLang()] }), []);
  const liveUrl = form.slug ? postUrl({ type: form.type, slug: form.slug }) + (form.status === 'draft' ? '?preview=1' : '') : null;

  if (!loaded) return <p>{msg?.text ?? 'Loading…'}</p>;

  const code = (which: 'html' | 'css' | 'jsonld') => (
    <div className="ad-code">
      <CodeMirror
        value={which === 'jsonld' ? form.jsonLd : form[which]}
        extensions={extensions[which]}
        onChange={(v) => set(which === 'jsonld' ? 'jsonLd' : which, v)}
        onCreateEditor={(view) => { if (which !== 'jsonld') views.current[which] = view; }}
        basicSetup={{ foldGutter: true, highlightActiveLine: true }}
      />
    </div>
  );
  const preview = (
    <div className={`ad-preview${mobile ? ' ad-preview--mobile' : ''}`}>
      <iframe title="Preview" srcDoc={doc} sandbox="allow-same-origin allow-popups" />
    </div>
  );

  return (
    <>
      <div className="ad-head">
        <h1>{id ? form.title || 'Untitled' : 'New post'}</h1>
        <div className="ad-savebar">
          {msg && <span className={msg.ok ? 'ad-ok' : 'ad-error'}>{msg.text}</span>}
          {dirty && !msg && <span className="ad-hint">Unsaved changes</span>}
          {liveUrl && id && <a className="ad-btn" href={liveUrl} target="_blank">Open on site ↗</a>}
          {id && <button className="ad-btn ad-btn--danger" onClick={remove}>Delete</button>}
          {form.status === 'draft'
            ? <><button className="ad-btn" disabled={saving} onClick={() => save()}>Save draft</button><button className="ad-btn ad-btn--primary" disabled={saving} onClick={() => save({ status: 'published' })}>Publish</button></>
            : <><button className="ad-btn" disabled={saving} onClick={() => save({ status: 'draft' })}>Unpublish</button><button className="ad-btn ad-btn--primary" disabled={saving} onClick={() => save()}>Update</button></>}
        </div>
      </div>

      <div className="ad-editor">
        <div className="ad-editor__meta ad-form">
          <label>Title<input value={form.title} onChange={(e) => set('title', e.target.value)} /></label>
          <div className="ad-2">
            <label>Type
              <select value={form.type} onChange={(e) => set('type', e.target.value as PostType)}>
                <option value="guide">Buying guide</option><option value="review">Review</option><option value="page">Page</option>
              </select>
            </label>
            <label>Status
              <select value={form.status} onChange={(e) => set('status', e.target.value as PostStatus)}>
                <option value="draft">Draft</option><option value="published">Published</option>
              </select>
            </label>
          </div>
          <label>Slug<input value={form.slug} placeholder="from title" onChange={(e) => set('slug', e.target.value)} />
            <span className="ad-hint">{postUrl({ type: form.type, slug: form.slug || '…' })}</span></label>
          <label>Excerpt<textarea style={{ fontFamily: 'var(--sans)', fontSize: 13, minHeight: 70 }} value={form.excerpt} onChange={(e) => set('excerpt', e.target.value)} />
            <span className="ad-hint">Used on cards, in search and as fallback meta description.</span></label>
          <div className="ad-2">
            <label>Category
              <select value={form.categoryId} onChange={(e) => set('categoryId', e.target.value)}>
                <option value="">—</option>{cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </label>
            <label>Author
              <select value={form.authorId} onChange={(e) => set('authorId', e.target.value)}>
                <option value="">—</option>{authors.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </label>
          </div>
          <label>Cover image
            <div style={{ display: 'flex', gap: 6 }}><input value={form.coverImage} onChange={(e) => set('coverImage', e.target.value)} /><button type="button" className="ad-btn ad-btn--sm" onClick={() => setPicker('cover')}>Pick</button></div>
            {form.coverImage && <img src={form.coverImage} alt="" style={{ width: '100%', aspectRatio: '3/2', objectFit: 'cover', marginTop: 4 }} />}
          </label>

          <fieldset>
            <legend>Card details</legend>
            <div className="ad-2">
              <label>Models tested<input type="number" value={form.testedCount} onChange={(e) => set('testedCount', e.target.value)} /></label>
              <label>Test weeks<input type="number" value={form.testWeeks} onChange={(e) => set('testWeeks', e.target.value)} /></label>
            </div>
            <label>Top pick / label<input value={form.topPick} onChange={(e) => set('topPick', e.target.value)} /></label>
            <label className="ad-check"><input type="checkbox" checked={form.featured} onChange={(e) => set('featured', e.target.checked)} />Home page hero</label>
          </fieldset>

          <fieldset>
            <legend>SEO</legend>
            <label>SEO title<input value={form.seoTitle} placeholder={`${form.title} | BrasQ`} onChange={(e) => set('seoTitle', e.target.value)} /></label>
            <label>Meta description<textarea style={{ fontFamily: 'var(--sans)', fontSize: 13, minHeight: 60 }} value={form.seoDescription} onChange={(e) => set('seoDescription', e.target.value)} /></label>
            <span className="ad-hint">Structured data (JSON-LD) is edited in its own tab.</span>
          </fieldset>

          <fieldset>
            <legend>Conversion</legend>
            <label className="ad-check"><input type="checkbox" checked={form.newsletterPopup} onChange={(e) => set('newsletterPopup', e.target.checked)} />Newsletter popup (after 35% scroll)</label>
            <span className="ad-hint">Sticky “our pick” bar. Shown when name and URL are filled in.</span>
            <label>Product name<input value={form.bar.name} onChange={(e) => setBar('name', e.target.value)} /></label>
            <div className="ad-2">
              <label>Score<input value={form.bar.score} onChange={(e) => setBar('score', e.target.value)} /></label>
              <label>Price<input value={form.bar.price} placeholder="$339" onChange={(e) => setBar('price', e.target.value)} /></label>
            </div>
            <label>Shop<input value={form.bar.shop} placeholder="Amazon" onChange={(e) => setBar('shop', e.target.value)} /></label>
            <label>Affiliate URL<input value={form.bar.url} onChange={(e) => setBar('url', e.target.value)} /></label>
            <label>Image<div style={{ display: 'flex', gap: 6 }}><input value={form.bar.image} onChange={(e) => setBar('image', e.target.value)} /><button type="button" className="ad-btn ad-btn--sm" onClick={() => setPicker('bar')}>Pick</button></div></label>
          </fieldset>
        </div>

        <div className="ad-editor__work">
          <div className="ad-tabs" role="tablist">
            {([['html', 'HTML'], ['css', 'CSS'], ['jsonld', 'JSON-LD'], ...(split ? [] : [['preview', 'Preview']])] as [Tab, string][]).map(([k, l]) => (
              <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)}>{l}</button>
            ))}
            <span className="ad-tabs__spacer" />
            <button onClick={() => setPicker('insert')} title="Upload or pick an image and insert it at the cursor">+ Image</button>
            <button onClick={() => { setSplit(!split); if (tab === 'preview') setTab('html'); }}>{split ? 'Full-width editor' : 'Side-by-side preview'}</button>
            <button aria-selected={mobile} onClick={() => setMobile(!mobile)}>{mobile ? 'Mobile' : 'Desktop'} preview</button>
          </div>
          <div className={`ad-split${split ? ' ad-split--side' : ''}`}>
            {tab === 'preview' ? preview : code(tab)}
            {split && preview}
          </div>
          <p className="ad-hint">The HTML is the whole page body, rendered inside the site header and footer with <a href="/brasq.css" target="_blank">brasq.css</a>. Components are documented in CONTENT_GUIDE.md. Ctrl/⌘+S saves. <Link href="/admin/automation">Automation API</Link></p>
        </div>
      </div>

      {picker && <MediaPicker onPick={onPicked} onClose={() => setPicker(null)} />}
    </>
  );
}
