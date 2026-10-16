'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { adminApi } from '@/lib/admin-client';
import type { Media } from '@/lib/types';
import { useConfirm } from './ConfirmDialog';

/** Upload (drag & drop, file picker or remote URL) + grid of stored media. */
export function MediaLibrary({ onPick }: { onPick?: (m: Media) => void }) {
  const [items, setItems] = useState<Media[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [over, setOver] = useState(false);
  const [error, setError] = useState('');
  const [remote, setRemote] = useState('');
  const [copied, setCopied] = useState('');
  const input = useRef<HTMLInputElement>(null);
  const confirm = useConfirm();

  const load = useCallback(() => adminApi<{ media: Media[] }>('/media').then((d) => setItems(d.media)), []);
  useEffect(() => { load(); }, [load]);

  const upload = async (files: FileList | File[]) => {
    setBusy(true); setError('');
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append('file', file);
        await adminApi('/media', { method: 'POST', body: fd });
      }
      await load();
    } catch (e) { setError((e as Error).message); } finally { setBusy(false); }
  };

  const importUrl = async () => {
    if (!remote) return;
    setBusy(true); setError('');
    try { await adminApi('/media/import', { method: 'POST', json: { url: remote } }); setRemote(''); await load(); }
    catch (e) { setError((e as Error).message); } finally { setBusy(false); }
  };

  const remove = async (m: Media) => {
    if (!(await confirm({ title: `Delete ${m.filename}?`, message: 'Posts that use this URL will show a broken image.' }))) return;
    await adminApi(`/media/${m.id}`, { method: 'DELETE' });
    load();
  };

  const saveAlt = async (m: Media, alt: string) => {
    if (alt !== m.alt) await adminApi(`/media/${m.id}`, { method: 'PATCH', json: { alt } });
  };

  return (
    <div>
      <div
        className={`ad-drop${over ? ' ad-drop--over' : ''}`}
        onClick={() => input.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setOver(true); }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => { e.preventDefault(); setOver(false); upload(e.dataTransfer.files); }}
      >
        <strong>{busy ? 'Uploading…' : 'Drop images here or click to upload'}</strong>
        <div className="ad-hint">PNG, JPG, WebP, AVIF, GIF, SVG, MP4 or PDF up to 15 MB. Stored in the local uploads folder in development and in S3 in production.</div>
        <input ref={input} type="file" multiple accept="image/*,video/mp4,video/webm,application/pdf" hidden onChange={(e) => e.target.files && upload(e.target.files)} />
      </div>
      <div className="ad-filters">
        <input style={{ flex: 1 }} placeholder="…or paste an image URL to import it" value={remote} onChange={(e) => setRemote(e.target.value)} />
        <button className="ad-btn" disabled={busy || !remote} onClick={importUrl}>Import</button>
      </div>
      {error && <p className="ad-error">{error}</p>}
      {!items ? <p>Loading…</p> : items.length === 0 ? <p className="ad-hint">No media yet.</p> : (
        <div className="ad-media">
          {items.map((m) => (
            <figure key={m.id}>
              <div>{m.mimeType.startsWith('image/') ? <img src={m.url} alt={m.alt} loading="lazy" /> : <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{m.mimeType}</span>}</div>
              <figcaption>
                <span title={m.filename}>{m.filename} · {Math.round(m.size / 1024)} KB · {m.driver}</span>
                <input defaultValue={m.alt} placeholder="Alt text" onBlur={(e) => saveAlt(m, e.target.value)} style={{ border: '1px solid var(--line)', padding: '4px 6px', font: '12px var(--sans)' }} />
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {onPick && <button className="ad-btn ad-btn--sm ad-btn--primary" onClick={() => onPick(m)}>Use</button>}
                  <button className="ad-btn ad-btn--sm" onClick={() => { navigator.clipboard.writeText(m.url); setCopied(m.id); }}>{copied === m.id ? 'Copied' : 'Copy URL'}</button>
                  {!onPick && <button className="ad-btn ad-btn--sm ad-btn--danger" onClick={() => remove(m)}>Delete</button>}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </div>
  );
}
