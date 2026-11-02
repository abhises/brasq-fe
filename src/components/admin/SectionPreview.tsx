'use client';
import { useEffect, useRef, useState } from 'react';

const FONTS = 'https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800;900&family=IBM+Plex+Mono:wght@400;500;600&display=swap';

/** Renders section HTML in an isolated frame with the live site's stylesheets. `scale` < 1 makes a thumbnail. */
export function SectionPreview({ html, css = '', scale = 1, width = 1100, maxHeight, minHeight = 120, className = '' }: {
  html: string; css?: string; scale?: number; width?: number; maxHeight?: number; minHeight?: number; className?: string;
}) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(minHeight);
  const [doc, setDoc] = useState('');

  useEffect(() => {
    const origin = window.location.origin;
    setDoc(`<!doctype html><html><head><meta charset="utf-8"><base href="${origin}/" target="_blank">
<link href="${FONTS}" rel="stylesheet"><link rel="stylesheet" href="${origin}/brasq.css"><link rel="stylesheet" href="${origin}/sections.css">
<style>body{margin:0;padding:20px;background:var(--paper)}${css}</style></head><body><div class="bq-preview">${html}</div></body></html>`);
  }, [html, css]);

  const measure = () => {
    const b = frame.current?.contentDocument?.body;
    if (b) setHeight(Math.max(minHeight, b.scrollHeight));
  };

  const outerH = Math.min(height * scale, maxHeight ?? Infinity);
  return (
    <div className={`sp ${className}`} style={{ height: outerH, overflow: maxHeight && height * scale > maxHeight ? (scale < 1 ? 'hidden' : 'auto') : 'hidden' }}>
      <iframe
        ref={frame} title="Section preview" srcDoc={doc} sandbox="allow-same-origin allow-popups" tabIndex={scale < 1 ? -1 : 0}
        onLoad={() => { measure(); setTimeout(measure, 400); }}
        style={{ width: scale < 1 ? width : '100%', height, transform: scale < 1 ? `scale(${scale})` : undefined, transformOrigin: 'top left', border: 0, display: 'block', pointerEvents: scale < 1 ? 'none' : undefined }}
      />
    </div>
  );
}
