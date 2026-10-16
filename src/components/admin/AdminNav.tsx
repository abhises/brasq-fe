'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { logout } from '@/app/admin/actions';

const LINKS: [string, string][] = [
  ['/admin', 'Posts & pages'], ['/admin/posts/new', 'New post'], ['/admin/media', 'Media'],
  ['/admin/categories', 'Categories'], ['/admin/authors', 'Authors'], ['/admin/subscribers', 'Subscribers'], ['/admin/automation', 'Automation API'],
];

export function AdminNav() {
  const path = usePathname();
  const current = (href: string) => (href === '/admin' ? path === '/admin' : path.startsWith(href));
  const nav = useRef<HTMLElement>(null);
  // On phones the nav is a sideways-scrolling row: keep the current section visible.
  useEffect(() => { nav.current?.querySelector('[aria-current="page"]')?.scrollIntoView({ inline: 'nearest', block: 'nearest' }); }, [path]);
  return (
    <aside className="ad-side">
      <Link href="/admin" className="ad-side__logo">Bras<span>Q</span></Link>
      <nav ref={nav} className="ad-side__nav">
        {LINKS.map(([href, label]) => (
          <Link key={href} href={href} className="ad-nav" aria-current={current(href) ? 'page' : undefined}>{label}</Link>
        ))}
      </nav>
      <div className="ad-side__foot">
        <a href="/" target="_blank">View site ↗</a>
        <form action={logout}><button type="submit">Sign out</button></form>
      </div>
    </aside>
  );
}
