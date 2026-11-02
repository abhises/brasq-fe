'use client';
import { css as cssLang } from '@codemirror/lang-css';
import { html as htmlLang } from '@codemirror/lang-html';
import CodeMirror from '@uiw/react-codemirror';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { adminApi } from '@/lib/admin-client';
import { FIELD_TYPE_LABEL, emptyData } from '@/lib/sections-client';
import type { FieldDef, FieldType, SectionType } from '@/lib/types';
import { useConfirm } from './ConfirmDialog';
import { SectionForm } from './SectionForm';
import { SectionPreview } from './SectionPreview';

type Draft = Pick<SectionType, 'key' | 'name' | 'group' | 'description' | 'fields' | 'template' | 'css' | 'sample' | 'tocLabel' | 'placement' | 'scope'>;
const BLANK: Draft = {
  key: '', name: '', group: 'Products', description: '', tocLabel: '{{heading}}', placement: 'body', scope: 'any', css: '',
  fields: [{ key: 'heading', label: 'Heading', type: 'text' }, { key: 'body', label: 'Text', type: 'richtext' }],
  template: '<section class="bq-section">\n  {{#heading}}<h2 class="bq-h2">{{heading}}</h2>{{/heading}}\n  <div class="bq-rich">{{{body}}}</div>\n</section>',
  sample: { heading: 'Example heading', body: 'Example text for the preview.' },
};
const GROUPS = ['Page', 'Products', 'Summaries', 'Text', 'Data', 'How-to', 'Trust', 'Engagement', 'Front page', 'Other'];
type Tab = 'fields' | 'template' | 'css' | 'sample';

export function SectionTypeEditor({ typeKey }: { typeKey?: string }) {
  const router = useRouter();
  const confirm = useConfirm();
  const isNew = !typeKey;
  const [draft, setDraft] = useState<Draft | null>(isNew ? BLANK : null);
  const [meta, setMeta] = useState<{ builtIn: boolean; usedBy: { id: string; title: string }[] }>({ builtIn: false, usedBy: [] });
  const [tab, setTab] = useState<Tab>('fields');
  const [preview, setPreview] = useState({ html: '', css: '', error: '' });
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [dirty, setDirty] = useState(false);
  const locked = meta.builtIn;

  useEffect(() => {
    if (!typeKey) return;
    adminApi<{ type: SectionType; usedBy: { id: string; title: string }[] }>(`/section-types/${typeKey}`)
      .then((d) => { const t = d.type; setDraft({ key: t.key, name: t.name, group: t.group, description: t.description, fields: t.fields, template: t.template, css: t.css, sample: t.sample, tocLabel: t.tocLabel, placement: t.placement, scope: t.scope }); setMeta({ builtIn: t.builtIn, usedBy: d.usedBy }); })
      .catch((e) => setMsg({ ok: false, text: e.message }));
  }, [typeKey]);

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => { setDraft((d) => (d ? { ...d, [k]: v } : d)); setDirty(true); };

  // live preview of unsaved changes
  useEffect(() => {
    if (!draft) return;
    const t = setTimeout(() => {
      adminApi<{ html: string; css: string }>('/section-types/preview', { method: 'POST', json: { key: draft.key || 'new-type', data: draft.sample, type: { fields: draft.fields, template: draft.template, css: draft.css, tocLabel: draft.tocLabel, placement: draft.placement } } })
        .then((r) => setPreview({ html: r.html, css: r.css, error: '' }))
        .catch((e) => setPreview((p) => ({ ...p, error: e.message })));
    }, 350);
    return () => clearTimeout(t);
  }, [draft]);

  const save = useCallback(async () => {
    if (!draft || locked) return;
    if (!draft.name.trim()) { setMsg({ ok: false, text: 'Give the section type a name' }); return; }
    if (!isNew && meta.usedBy.length && !(await confirm({ title: `Update ${meta.usedBy.length} ${meta.usedBy.length === 1 ? 'page' : 'pages'}?`, message: 'Every page that uses this section type is rebuilt with the new template.', confirmLabel: 'Save and update' }))) return;
    try {
      if (isNew) {
        const { type } = await adminApi<{ type: SectionType }>('/section-types', { method: 'POST', json: draft });
        setDirty(false); router.replace(`/admin/sections/${type.key}`);
      } else {
        const { key: _k, ...rest } = draft;
        const r = await adminApi<{ rerendered: number }>(`/section-types/${typeKey}`, { method: 'PATCH', json: rest });
        setDirty(false); setMsg({ ok: true, text: `Saved${r.rerendered ? ` · ${r.rerendered} ${r.rerendered === 1 ? 'page' : 'pages'} updated` : ''}` });
      }
    } catch (e) { setMsg({ ok: false, text: (e as Error).message }); }
  }, [draft, locked, isNew, meta.usedBy.length, confirm, router, typeKey]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); save(); } };
    const onLeave = (e: BeforeUnloadEvent) => { if (dirty) e.preventDefault(); };
    window.addEventListener('keydown', onKey); window.addEventListener('beforeunload', onLeave);
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('beforeunload', onLeave); };
  }, [save, dirty]);

  const duplicate = async () => {
    const { type } = await adminApi<{ type: SectionType }>(`/section-types/${typeKey}/duplicate`, { method: 'POST' });
    router.push(`/admin/sections/${type.key}`);
  };
  const remove = async () => {
    if (!(await confirm({ title: `Delete "${draft?.name}"?`, message: 'This cannot be undone.' }))) return;
    try { await adminApi(`/section-types/${typeKey}`, { method: 'DELETE' }); router.push('/admin/sections'); }
    catch (e) { setMsg({ ok: false, text: (e as Error).message }); }
  };

  const ext = useMemo(() => ({ html: [htmlLang()], css: [cssLang()] }), []);
  if (!draft) return <p>{msg?.text ?? 'Loading…'}</p>;

  return (
    <>
      <div className="ad-head">
        <div>
          <h1>{isNew ? 'New section type' : draft.name}</h1>
          <p className="ad-hint" style={{ margin: '4px 0 0' }}>
            {locked ? 'Built-in and locked. Duplicate it to make an editable copy.' : isNew ? 'Name it, add fields, write the template and check the preview.' : `Custom section type · key ${draft.key}`}
            {!isNew && ` · ${meta.usedBy.length ? `used in ${meta.usedBy.length} ${meta.usedBy.length === 1 ? 'page' : 'pages'}` : 'not used yet'}`}
          </p>
        </div>
        <div className="ad-savebar">
          {msg && <span className={msg.ok ? 'ad-ok' : 'ad-error'}>{msg.text}</span>}
          {dirty && !msg && <span className="ad-hint">Unsaved changes</span>}
          <Link className="ad-btn" href="/admin/sections">Library</Link>
          {!isNew && <button className="ad-btn" onClick={duplicate}>Duplicate</button>}
          {!isNew && !locked && <button className="ad-btn ad-btn--danger" onClick={remove}>Delete</button>}
          {!locked && <button className="ad-btn ad-btn--primary" onClick={save}>{isNew ? 'Create section type' : 'Save'}</button>}
        </div>
      </div>

      <div className="st-editor">
        <div className="st-panel">
          <div className="ad-tabs" role="tablist">
            {([['fields', 'Settings & fields'], ['template', 'Template'], ['css', 'CSS'], ['sample', 'Sample data']] as [Tab, string][]).map(([k, l]) => (
              <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)}>{l}</button>
            ))}
          </div>
          <fieldset className="st-body" disabled={locked}>
            {tab === 'fields' && (
              <div className="ad-form">
                <div className="ad-2">
                  <label>Name<input value={draft.name} placeholder="e.g. Deal of the week" onChange={(e) => set('name', e.target.value)} /></label>
                  <label>Group<select value={draft.group} onChange={(e) => set('group', e.target.value)}>{[...new Set([...GROUPS, draft.group])].map((g) => <option key={g}>{g}</option>)}</select></label>
                </div>
                {isNew && <label>Key<input value={draft.key} placeholder="from the name" onChange={(e) => set('key', e.target.value)} /><span className="ad-hint">Used in the CSS class <code>.bq-sec--{draft.key || 'key'}</code>. Can’t be changed later.</span></label>}
                <label>Description<input value={draft.description} placeholder="One line, shown in the library" onChange={(e) => set('description', e.target.value)} /></label>
                <div className="ad-2">
                  <label>Can be used in<select value={draft.scope} onChange={(e) => set('scope', e.target.value as Draft['scope'])}><option value="any">Posts and front page</option><option value="post">Posts only</option><option value="home">Front page only</option></select></label>
                  <label>Position<select value={draft.placement} onChange={(e) => set('placement', e.target.value as Draft['placement'])}><option value="body">Main column</option><option value="top">Full width, top</option><option value="bottom">Full width, bottom</option></select></label>
                </div>
                <label>Name in the table of contents<input value={draft.tocLabel} placeholder="{{heading}}" onChange={(e) => set('tocLabel', e.target.value)} /><span className="ad-hint">A template like <code>{'{{heading}}'}</code>. Leave empty to keep this section out of the table of contents.</span></label>
                <FieldsBuilder fields={draft.fields} onChange={(f) => set('fields', f)} />
              </div>
            )}
            {tab === 'template' && (
              <div className="ad-form">
                <div className="st-code"><CodeMirror value={draft.template} extensions={ext.html} readOnly={locked} onChange={(v) => set('template', v)} basicSetup={{ foldGutter: true }} /></div>
                <TemplateHelp fields={draft.fields} />
              </div>
            )}
            {tab === 'css' && (
              <div className="ad-form">
                <div className="st-code"><CodeMirror value={draft.css} extensions={ext.css} readOnly={locked} onChange={(v) => set('css', v)} basicSetup={{ foldGutter: true }} /></div>
                <span className="ad-hint">{locked ? 'Built-in types are styled in brasq.css.' : <>Every rule is limited to this section automatically, so <code>.card {'{…}'}</code> becomes <code>.bq-sec--{draft.key || 'key'} .card {'{…}'}</code>. Use <code>:scope</code> to style the section itself. The site’s colour variables such as <code>var(--orange)</code> work here.</>}</span>
              </div>
            )}
            {tab === 'sample' && (
              <div>
                <p className="ad-hint" style={{ marginTop: 0 }}>Example content used for the preview and the library thumbnail.</p>
                <SectionForm fields={draft.fields} value={draft.sample} onChange={(v) => set('sample', v)} />
                {!locked && <button type="button" className="ad-btn ad-btn--sm" style={{ marginTop: 10 }} onClick={() => set('sample', emptyData(draft.fields))}>Reset sample</button>}
              </div>
            )}
          </fieldset>
          {!isNew && meta.usedBy.length > 0 && (
            <details className="st-used"><summary>Used in {meta.usedBy.length} {meta.usedBy.length === 1 ? 'page' : 'pages'}</summary>
              <ul>{meta.usedBy.map((p) => <li key={p.id}><Link href={`/admin/posts/${p.id}`}>{p.title}</Link></li>)}</ul></details>
          )}
        </div>
        <div className="st-preview">
          <div className="st-preview__head"><span>Preview with sample data</span>{preview.error && <span className="ad-error">{preview.error}</span>}</div>
          <SectionPreview html={preview.html} css={preview.css} minHeight={300} />
        </div>
      </div>
    </>
  );
}

function TemplateHelp({ fields }: { fields: FieldDef[] }) {
  const show = (fs: FieldDef[], prefix = ''): string[] => fs.flatMap((f) =>
    f.type === 'list' ? [`{{#${f.key}}} … {{/${f.key}}}  (list: ${(f.fields ?? []).map((s) => s.key).join(', ')})`]
      : f.type === 'richtext' || f.type === 'code' ? [`{{{${prefix}${f.key}}}}`]
        : f.type === 'cells' ? [`{{#${f.key}}}{{value}}{{/${f.key}}}  ({{#best}} marks a value ending in *)`]
          : f.type === 'product' ? [`{{${f.key}.name}} {{${f.key}.score}} {{${f.key}.priceText}} {{${f.key}.image}} {{${f.key}.url}} {{${f.key}.shopUrl}}`]
            : f.type === 'post' ? [`{{${f.key}.title}} {{${f.key}.url}} {{${f.key}.coverImage}} {{${f.key}.typeLabel}}`]
              : [`{{${prefix}${f.key}}}`]);
  return (
    <div className="st-help">
      <strong>Your fields</strong>
      <code>{show(fields).join('\n')}</code>
      <strong>Also available</strong>
      <code>{'{{post.title}} {{post.url}} {{post.author.name}} {{post.updated}} {{post.category.name}}\n{{^field}}shown when empty{{/field}}   {{@number}} {{@n}} inside a list'}</code>
      <span className="ad-hint">Shop links: add <code>rel=&quot;sponsored nofollow&quot; target=&quot;_blank&quot;</code>. Interactive parts use the <code>data-bq-*</code> attributes from the content guide; scripts aren’t allowed.</span>
    </div>
  );
}

const TYPES = Object.keys(FIELD_TYPE_LABEL) as FieldType[];
const keyOf = (label: string) => label.toLowerCase().replace(/[^a-z0-9]+(.)?/g, (_, c: string) => (c ? c.toUpperCase() : '')).replace(/^[^a-z]+/, '') || 'field';

function FieldsBuilder({ fields, onChange, nested = false }: { fields: FieldDef[]; onChange: (f: FieldDef[]) => void; nested?: boolean }) {
  const update = (i: number, patch: Partial<FieldDef>) => onChange(fields.map((f, k) => (k === i ? { ...f, ...patch } : f)));
  const move = (i: number, d: number) => { const j = i + d; if (j < 0 || j >= fields.length) return; const n = [...fields]; [n[i], n[j]] = [n[j], n[i]]; onChange(n); };
  return (
    <div className={`fb${nested ? ' fb--nested' : ''}`}>
      {!nested && <div className="fb__title">Fields</div>}
      {fields.map((f, i) => (
        <div key={i} className="fb__row">
          <div className="fb__line">
            <input aria-label="Field label" value={f.label} placeholder="Label" onChange={(e) => update(i, { label: e.target.value, ...(f.key === keyOf(f.label) || !f.key ? { key: keyOf(e.target.value) } : {}) })} />
            <input aria-label="Field key" className="fb__key" value={f.key} placeholder="key" onChange={(e) => update(i, { key: e.target.value.replace(/[^a-zA-Z0-9_]/g, '') })} />
            <select aria-label="Field type" value={f.type} onChange={(e) => update(i, { type: e.target.value as FieldType, ...(e.target.value === 'list' && !f.fields ? { fields: [{ key: 'text', label: 'Text', type: 'text' }] } : {}) })}>
              {TYPES.map((t) => <option key={t} value={t}>{FIELD_TYPE_LABEL[t]}</option>)}
            </select>
            <span className="fb__ops">
              <button type="button" aria-label="Move up" onClick={() => move(i, -1)}>↑</button>
              <button type="button" aria-label="Move down" onClick={() => move(i, 1)}>↓</button>
              <button type="button" aria-label={`Remove ${f.label}`} onClick={() => onChange(fields.filter((_, k) => k !== i))}>×</button>
            </span>
          </div>
          <div className="fb__line fb__line--extra">
            <label className="ad-check"><input type="checkbox" checked={!!f.required} onChange={(e) => update(i, { required: e.target.checked })} />Required</label>
            <input aria-label="Help text" value={f.help ?? ''} placeholder="Help text (optional)" onChange={(e) => update(i, { help: e.target.value || undefined })} />
            {f.type === 'select' && <input aria-label="Choices" value={(f.options ?? []).join(', ')} placeholder="Choices, separated by commas" onChange={(e) => update(i, { options: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })} />}
            {f.type === 'list' && <input aria-label="Item label" value={f.itemLabel ?? ''} placeholder="Item label, e.g. {{name}}" onChange={(e) => update(i, { itemLabel: e.target.value || undefined })} />}
          </div>
          {f.type === 'list' && <FieldsBuilder nested fields={f.fields ?? []} onChange={(sub) => update(i, { fields: sub })} />}
        </div>
      ))}
      <button type="button" className="ad-btn ad-btn--sm" onClick={() => onChange([...fields, { key: `field${fields.length + 1}`, label: `Field ${fields.length + 1}`, type: 'text' }])}>+ Add {nested ? 'field to each item' : 'field'}</button>
    </div>
  );
}
