'use client';
import { useEffect } from 'react';
import { subscribe, THANKS } from '@/lib/subscribe';

/**
 * Adds behaviour to plain HTML stored in the database:
 *  - <form data-bq-subscribe data-source="..."> with an email input  -> newsletter signup
 *  - <div data-bq-gallery> with .bq-gallery__main img and buttons[data-src] -> image gallery
 *  - <section data-bq-helpful> with buttons[data-vote]                  -> "Was this helpful?"
 */
export function PostEnhancer({ rootId }: { rootId: string }) {
  useEffect(() => {
    const root = document.getElementById(rootId);
    if (!root) return;
    const off: (() => void)[] = [];
    const on = (el: Element, ev: string, fn: (e: Event) => void) => { el.addEventListener(ev, fn); off.push(() => el.removeEventListener(ev, fn)); };

    root.querySelectorAll<HTMLFormElement>('form[data-bq-subscribe]').forEach((form) => {
      on(form, 'submit', async (e) => {
        e.preventDefault();
        const input = form.querySelector<HTMLInputElement>('input[type=email]');
        form.querySelector('.bq-form-error')?.remove();
        try {
          await subscribe(input?.value ?? '', form.dataset.source || 'post');
          const p = document.createElement('p');
          p.className = 'bq-form-done';
          p.textContent = THANKS;
          form.replaceWith(p);
        } catch (err) {
          const p = document.createElement('p');
          p.className = 'bq-form-error';
          p.textContent = (err as Error).message;
          form.appendChild(p);
        }
      });
    });

    root.querySelectorAll<HTMLElement>('[data-bq-gallery]').forEach((gallery) => {
      const main = gallery.querySelector<HTMLImageElement>('.bq-gallery__main img');
      const thumbs = gallery.querySelectorAll<HTMLButtonElement>('button[data-src]');
      thumbs.forEach((btn) => on(btn, 'click', () => {
        if (main) { main.src = btn.dataset.src!; main.alt = btn.getAttribute('aria-label') ?? ''; }
        thumbs.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
      }));
    });

    root.querySelectorAll<HTMLElement>('[data-bq-helpful]').forEach((box) => {
      box.querySelectorAll('button[data-vote]').forEach((btn) => on(btn, 'click', () => {
        box.innerHTML = '<span style="font-size:15px;font-weight:700">Thanks for your feedback. Missing something? <a href="/contact">Let us know</a>.</span>';
      }));
    });

    return () => off.forEach((f) => f());
  }, [rootId]);
  return null;
}
