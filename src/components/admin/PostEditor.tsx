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
import { adminTypeLabel as typeLabel, postUrl } from '@/lib/format';
import { newId } from '@/lib/sections-client';
import type { Author, Category, Media, Post, PostStatus, PostType, SectionsDoc, SectionType, StickyBar } from '@/lib/types';
import { useConfirm } from './ConfirmDialog';
import { MediaPicker } from './MediaPicker';
import { SectionsEditor, starterDoc } from './SectionsEditor';
import { starterHtml } from './starters';

type Form = {
  type: PostType; status: PostStatus; slug: string; title: string; excerpt: string; html: string; css: string;
  coverImage: string; seoTitle: string; seoDescription: string; jsonLd: string;
  testedCount: string; testWeeks: string; topPick: string; newsletterPopup: boolean; featured: boolean;
  categoryId: string; authorId: string; bar: Required<StickyBar>;
  /** Section-based content; null = the post is edited as plain HTML */
  sections: SectionsDoc | null;
};

const EMPTY_BAR = { name: '', score: '', price: '', shop: '', url: '', image: '' };
const EMPTY: Form = {
  type: 'guide', status: 'draft', slug: '', title: '', excerpt: '', html: '', css: '', coverImage: '', seoTitle: '', seoDescription: '', jsonLd: '',
  testedCount: '', testWeeks: '', topPick: '', newsletterPopup: false, featured: false, categoryId: '', authorId: '', bar: EMPTY_BAR, sections: null,
};

/** Post types in the order the type picker shows them. */
const TYPES: PostType[] = ['guide', 'review', 'comparison', 'informational', 'page'];

const toForm = (p: Post): Form => ({
  type: p.type, status: p.status, slug: p.slug, title: p.title, excerpt: p.excerpt, html: p.html, css: p.css,
  coverImage: p.coverImage ?? '', seoTitle: p.seoTitle ?? '', seoDescription: p.seoDescription ?? '', jsonLd: p.jsonLd ?? '',
  testedCount: p.testedCount?.toString() ?? '', testWeeks: p.testWeeks?.toString() ?? '', topPick: p.topPick ?? '',
  newsletterPopup: p.newsletterPopup, featured: p.featured, categoryId: p.categoryId ?? '', authorId: p.authorId ?? '',
  bar: { ...EMPTY_BAR, ...(p.stickyBar ?? {}) } as Required<StickyBar>,
  sections: p.sections ?? null,
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
    sections: f.sections,
  };
};

type Tab = 'sections' | 'html' | 'css' | 'jsonld' | 'preview';

export function PostEditor({ id }: { id?: string }) {
  const router = useRouter();
  const confirm = useConfirm();
  const [form, setForm] = useState<Form>(id ? EMPTY : { ...EMPTY, html: starterHtml('guide') });
  /** Number of products for a new comparison's starter layout */
  const [products, setProducts] = useState<2 | 3 | 4>(2);
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
  const [sectionTypes, setSectionTypes] = useState<SectionType[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  /** true once the editor touched the sections, so changing the post type no longer swaps the starter */
  const [sectionsTouched, setSectionsTouched] = useState(false);
  const [sectionsHtml, setSectionsHtml] = useState('');
  const [previewError, setPreviewError] = useState('');
  const frame = useRef<HTMLIFrameElement>(null);
  const usesSections = form.sections !== null;

  useEffect(() => {
    adminApi<{ categories: Category[] }>('/categories').then((d) => setCats(d.categories));
    adminApi<{ authors: Author[] }>('/authors').then((d) => setAuthors(d.authors));
    adminApi<{ types: SectionType[] }>('/section-types').then((d) => {
      setSectionTypes(d.types);
      // a new post starts from the section layout of its type
      if (!id) { setForm((f) => (f.sections === null && f.html === starterHtml(f.type) ? { ...f, html: '', sections: starterDoc(f.type, d.types) } : f)); setTab('sections'); }
    });
    if (id) adminApi<{ post: Post }>(`/posts/${id}`).then((d) => { setForm(toForm(d.post)); if (d.post.sections) setTab('sections'); setLoaded(true); }).catch((e) => setMsg({ ok: false, text: e.message }));
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

  /** New posts only: swap in the starter layout for another type / product count. Asks first if the HTML was edited. */
  const changeStarter = async (type: PostType, n: 2 | 3 | 4) => {
    if (form.sections) {
      // sections mode: swap the starter sections until they were edited
      if (sectionsTouched) set('type', type);
      else { setForm((f) => ({ ...f, type, sections: starterDoc(type, sectionTypes) })); setSelected(null); setDirty(true); }
      return;
    }
    const untouched = !form.html.trim() || form.html === starterHtml(form.type, products);
    const next = starterHtml(type, n);
    if (!untouched && next !== form.html && !(await confirm({ title: 'Replace the HTML?', message: `Start from the ${typeLabel(type).toLowerCase()} layout${type === 'comparison' ? ` with ${n} products` : ''}. Your current HTML will be replaced.`, confirmLabel: 'Replace' }))) {
      set('type', type);
      return;
    }
    setProducts(n);
    setForm((f) => ({ ...f, type, html: next }));
    setDirty(true);
  };

  const setSections = (doc: SectionsDoc) => { set('sections', doc); setSectionsTouched(true); };

  /** HTML post -> sections: the current HTML becomes one Custom HTML section, so the page looks exactly the same. */
  const useSectionsMode = async () => {
    if (!(await confirm({ title: 'Edit this post with sections?', message: 'The current HTML becomes one “Custom HTML” section, so the page looks the same. You can then add sections around it, or rebuild it section by section.', confirmLabel: 'Use sections' }))) return;
    const items = form.html.trim() ? [{ id: newId(), type: 'custom-html', data: { html: form.html, tocTitle: '' } }] : [];
    setForm((f) => ({ ...f, sections: { layout: form.html.trim() ? 'raw' : 'toc', items } })); setSelected(items[0]?.id ?? null); setTab('sections'); setDirty(true);
  };
  /** Sections -> hand-written HTML, starting from the HTML the sections produce now. */
  const useHtmlMode = async () => {
    if (!(await confirm({ title: 'Edit the HTML by hand?', message: 'The post stops using sections. You keep the HTML they produce now and edit it directly. Section forms will no longer update this post.', confirmLabel: 'Edit HTML' }))) return;
    setForm((f) => ({ ...f, html: sectionsHtml || f.html, sections: null })); setTab('html'); setDirty(true);
  };

  const remove = async () => {
    if (!id || !(await confirm({ title: `Delete "${form.title}"?`, message: 'This cannot be undone.' }))) return;
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
    if (!form.sections) return;
    const t = setTimeout(() => {
      const n = (v: string) => (v.trim() === '' ? null : Number(v));
      adminApi<{ html: string }>('/posts/preview', { method: 'POST', json: {
        sections: form.sections, type: form.type, slug: form.slug || 'preview', title: form.title, excerpt: form.excerpt, coverImage: form.coverImage || null,
        testedCount: n(form.testedCount), testWeeks: n(form.testWeeks), topPick: form.topPick || null, categoryId: form.categoryId || null, authorId: form.authorId || null,
      } }).then((r) => { setSectionsHtml(r.html); setPreviewError(''); }).catch((e) => setPreviewError(e.message));
    }, 350);
    return () => clearTimeout(t);
  }, [form.sections, form.type, form.slug, form.title, form.excerpt, form.coverImage, form.testedCount, form.testWeeks, form.topPick, form.categoryId, form.authorId]);

  const pageHtml = usesSections ? sectionsHtml : form.html;
  /** Scroll position of the preview, kept when it reloads with new content */
  const previewScroll = useRef(0);
  useEffect(() => {
    const t = setTimeout(() => {
      previewScroll.current = frame.current?.contentWindow?.scrollY ?? previewScroll.current;
      const origin = window.location.origin;
      setDoc(`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><base href="${origin}/" target="_blank">
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800;900&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${origin}/brasq.css"><link rel="stylesheet" href="${origin}/sections.css"><style>.bq-sec.is-selected{outline:2px dashed var(--orange);outline-offset:8px}${form.css}</style></head><body>${pageHtml}</body></html>`);
    }, 300);
    return () => clearTimeout(t);
  }, [pageHtml, form.css]);

  /** Outline the selected section in the preview and scroll it into view. */
  const markSelected = useCallback((scroll: boolean) => {
    const d = frame.current?.contentDocument;
    if (!d) return;
    d.querySelectorAll('.bq-sec.is-selected').forEach((el) => el.classList.remove('is-selected'));
    const el = selected ? d.querySelector(`[data-section="${CSS.escape(selected)}"]`) : null;
    if (el) { el.classList.add('is-selected'); if (scroll) el.scrollIntoView({ block: 'start', behavior: 'smooth' }); }
  }, [selected]);
  useEffect(() => { markSelected(true); }, [markSelected]);

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
      <iframe ref={frame} title="Preview" srcDoc={doc} sandbox="allow-same-origin allow-popups" onLoad={() => { frame.current?.contentWindow?.scrollTo(0, previewScroll.current); markSelected(false); }} />
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
              <select value={form.type} onChange={(e) => (id ? set('type', e.target.value as PostType) : changeStarter(e.target.value as PostType, products))}>
                {TYPES.map((t) => <option key={t} value={t}>{typeLabel(t)}</option>)}
              </select>
            </label>
            <label>Status
              <select value={form.status} onChange={(e) => set('status', e.target.value as PostStatus)}>
                <option value="draft">Draft</option><option value="published">Published</option>
              </select>
            </label>
          </div>
          {!id && form.type === 'comparison' && (
            <label>Products compared
              <select value={products} onChange={(e) => changeStarter('comparison', Number(e.target.value) as 2 | 3 | 4)}>
                <option value={2}>2 products (X vs Y)</option><option value={3}>3 products</option><option value={4}>4 products</option>
              </select>
              <span className="ad-hint">Sets up the lineup, head-to-head table and “which to buy” blocks for this many products.</span>
            </label>
          )}
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
            {([...(usesSections ? [['sections', 'Sections']] : []), ['html', 'HTML'], ['css', 'CSS'], ['jsonld', 'JSON-LD'], ...(split ? [] : [['preview', 'Preview']])] as [Tab, string][]).map(([k, l]) => (
              <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)}>{l}</button>
            ))}
            <span className="ad-tabs__spacer" />
            {!usesSections && <button onClick={useSectionsMode} title="Build this post from sections">Use sections</button>}
            {tab !== 'sections' && !(usesSections && tab === 'html') && <button onClick={() => setPicker('insert')} title="Upload or pick an image and insert it at the cursor">+ Image</button>}
            <button onClick={() => { setSplit(!split); if (tab === 'preview') setTab('html'); }}>{split ? 'Full-width editor' : 'Side-by-side preview'}</button>
            <button aria-selected={mobile} onClick={() => setMobile(!mobile)}>{mobile ? 'Mobile' : 'Desktop'} preview</button>
          </div>
          <div className={`ad-split${split ? ' ad-split--side' : ''}`}>
            {tab === 'preview' ? preview
              : tab === 'sections' && form.sections ? <SectionsEditor doc={form.sections} onChange={setSections} selected={selected} onSelect={setSelected} types={sectionTypes} />
                : tab === 'html' && usesSections ? (
                  <div className="ad-code-wrap">
                    <div className="se-htmlbar"><span className="ad-hint">This HTML is generated from the sections and updates when you save. {previewError && <span className="ad-error">{previewError}</span>}</span><button className="ad-btn ad-btn--sm" onClick={useHtmlMode}>Edit HTML by hand</button></div>
                    <div className="ad-code"><CodeMirror value={sectionsHtml} extensions={extensions.html} readOnly editable={false} basicSetup={{ foldGutter: true }} /></div>
                  </div>
                ) : code(tab === 'sections' ? 'html' : tab)}
            {split && preview}
          </div>
          <p className="ad-hint">The HTML is the whole page body, rendered inside the site header and footer with <a href="/brasq.css" target="_blank">brasq.css</a>. Components are documented in CONTENT_GUIDE.md. Ctrl/⌘+S saves. <Link href="/admin/automation">Automation API</Link></p>
        </div>
      </div>

      {picker && <MediaPicker onPick={onPicked} onClose={() => setPicker(null)} />}
    </>
  );
}
