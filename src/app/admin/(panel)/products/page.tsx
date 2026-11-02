'use client';
import { useEffect, useState } from 'react';
import { useConfirm } from '@/components/admin/ConfirmDialog';
import { SectionForm } from '@/components/admin/SectionForm';
import { adminApi } from '@/lib/admin-client';
import type { FieldDef, Product } from '@/lib/types';

const FIELDS: FieldDef[] = [
  { key: 'name', label: 'Name', type: 'text', required: true },
  { key: 'slug', label: 'Slug', type: 'text', help: 'Leave empty to make one from the name.' },
  { key: 'score', label: 'Test score (0–10)', type: 'number' },
  { key: 'price', label: 'Price (USD)', type: 'number' },
  { key: 'image', label: 'Photo', type: 'image' },
  { key: 'summary', label: 'One-line summary', type: 'richtext', help: 'Used as “Why we picked it” when a pick card leaves it empty.' },
  { key: 'reviewSlug', label: 'Review slug', type: 'text', placeholder: 'vorta-s9', help: 'Links the product name to /review/<slug>.' },
  { key: 'shops', label: 'Shops', type: 'list', itemLabel: '{{name}}', fields: [{ key: 'name', label: 'Shop', type: 'text', placeholder: 'Amazon' }, { key: 'url', label: 'Affiliate link', type: 'link' }] },
];
type Form = Record<string, unknown>;
const toForm = (p?: Product): Form => p ? { ...p, score: p.score ?? '', price: p.price ?? '', image: p.image ?? '', reviewSlug: p.reviewSlug ?? '' } : { name: '', slug: '', score: '', price: '', image: '', summary: '', reviewSlug: '', shops: [{ name: 'Amazon', url: '' }] };
const toPayload = (f: Form) => {
  const n = (v: unknown) => (v === '' || v === null || v === undefined ? null : Number(v));
  const s = (v: unknown) => (typeof v === 'string' && v.trim() ? v.trim() : null);
  return { name: String(f.name ?? ''), slug: String(f.slug ?? ''), score: n(f.score), price: n(f.price), image: s(f.image), reviewSlug: s(f.reviewSlug), summary: String(f.summary ?? ''),
    shops: ((f.shops as { name: string; url: string }[]) ?? []).filter((x) => x.name && x.url) };
};

export default function ProductsPage() {
  const confirm = useConfirm();
  const [products, setProducts] = useState<Product[] | null>(null);
  const [q, setQ] = useState('');
  const [edit, setEdit] = useState<{ id?: string; form: Form } | null>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const load = () => adminApi<{ products: Product[] }>(`/products${q ? `?q=${encodeURIComponent(q)}` : ''}`).then((d) => setProducts(d.products)).catch((e) => setMsg({ ok: false, text: e.message }));
  useEffect(() => { const t = setTimeout(load, 200); return () => clearTimeout(t); }, [q]); // eslint-disable-line react-hooks/exhaustive-deps

  const save = async () => {
    if (!edit) return;
    try {
      const body = toPayload(edit.form);
      if (!body.name) { setMsg({ ok: false, text: 'Name is required' }); return; }
      const r = edit.id
        ? await adminApi<{ product: Product; rerendered: number }>(`/products/${edit.id}`, { method: 'PATCH', json: body })
        : await adminApi<{ product: Product }>('/products', { method: 'POST', json: body });
      setMsg({ ok: true, text: `Saved ${r.product.name}${'rerendered' in r && r.rerendered ? ` · ${r.rerendered} ${r.rerendered === 1 ? 'page' : 'pages'} updated` : ''}` });
      setEdit({ id: r.product.id, form: toForm(r.product) }); load();
    } catch (e) { setMsg({ ok: false, text: (e as Error).message }); }
  };
  const remove = async () => {
    if (!edit?.id || !(await confirm({ title: `Delete "${String(edit.form.name)}"?`, message: 'Pick cards that use it will lose their product data.' }))) return;
    try { await adminApi(`/products/${edit.id}`, { method: 'DELETE' }); setEdit(null); load(); } catch (e) { setMsg({ ok: false, text: (e as Error).message }); }
  };

  return (
    <>
      <div className="ad-head">
        <div><h1>Products</h1><p className="ad-hint" style={{ margin: '4px 0 0' }}>One place for each product’s name, score, price, photo and shop links. Pick cards, tables and buttons that use a product update when you save it here.</p></div>
        <button className="ad-btn ad-btn--primary" onClick={() => { setEdit({ form: toForm() }); setMsg(null); }}>+ New product</button>
      </div>
      <div className="pr-layout">
        <div>
          <div className="ad-filters"><input placeholder="Search products" value={q} onChange={(e) => setQ(e.target.value)} /></div>
          {!products ? <p>Loading…</p> : (
            <table className="ad-table">
              <thead><tr><th>Product</th><th>Score</th><th>Price</th><th>Shops</th></tr></thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} onClick={() => { setEdit({ id: p.id, form: toForm(p) }); setMsg(null); }} style={{ cursor: 'pointer' }} aria-selected={edit?.id === p.id}>
                    <td className="ad-cell-main"><span className="pr-name">{p.image ? <img src={p.image} alt="" /> : <span className="sf-image__empty" />}<span><b>{p.name}</b><span className="ad-hint">{p.reviewSlug ? `/review/${p.reviewSlug}` : p.slug}</span></span></span></td>
                    <td>{p.score?.toFixed(1) ?? '—'}</td><td>{p.price != null ? `$${p.price}` : '—'}</td><td>{p.shops.map((s) => s.name).join(', ') || '—'}</td>
                  </tr>
                ))}
                {products.length === 0 && <tr><td colSpan={4}>No products yet. Add one with “+ New product”.</td></tr>}
              </tbody>
            </table>
          )}
        </div>
        {edit && (
          <div className="pr-edit">
            <div className="ad-head" style={{ marginBottom: 8 }}><h2 style={{ margin: 0, fontSize: 18 }}>{edit.id ? 'Edit product' : 'New product'}</h2>
              <div className="ad-savebar">{edit.id && <button className="ad-btn ad-btn--danger ad-btn--sm" onClick={remove}>Delete</button>}<button className="ad-btn ad-btn--sm" onClick={() => setEdit(null)}>Close</button><button className="ad-btn ad-btn--primary ad-btn--sm" onClick={save}>Save</button></div></div>
            {msg && <p className={msg.ok ? 'ad-ok' : 'ad-error'} style={{ margin: '0 0 8px' }}>{msg.text}</p>}
            <SectionForm fields={FIELDS} value={edit.form} onChange={(form) => setEdit({ ...edit, form })} />
          </div>
        )}
      </div>
    </>
  );
}
