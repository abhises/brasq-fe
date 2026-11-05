'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { logout } from '@/app/admin/actions';

type Item = { href: string; label: string };
type Group = Item & { icon: keyof typeof ICONS; items?: Item[] };

// WordPress-style menu: top-level sections, with sub-items for the open section.
const MENU: Group[] = [
  { href: '/admin', label: 'Dashboard', icon: 'dashboard' },
  {
    href: '/admin/posts', label: 'Posts', icon: 'posts',
    items: [
      { href: '/admin/posts', label: 'All posts & pages' },
      { href: '/admin/posts/new', label: 'Add new' },
    ],
  },
  { href: '/admin/front-page', label: 'Front page', icon: 'pages' },
  { href: '/admin/media', label: 'Media', icon: 'media' },
  { href: '/admin/categories', label: 'Categories', icon: 'categories' },
  { href: '/admin/authors', label: 'Authors', icon: 'authors' },
  { href: '/admin/subscribers', label: 'Subscribers', icon: 'subscribers' },
  { href: '/admin/automation', label: 'Automation API', icon: 'automation' },
];

const ICONS = {
  dashboard: 'M3 13h8V3H3zm10 8h8V11h-8zM3 21h8v-6H3zm10-18v6h8V3z',
  posts: 'M4 4h16v4H4zm0 6h10v2H4zm0 4h16v2H4zm0 4h10v2H4z',
  pages: 'M6 2h9l5 5v15H6zM15 2v5h5M9 12h8M9 16h8',
  media: 'M3 5h18v14H3zm2 12h14l-4.5-6-3.5 4.5-2.5-3z',
  categories: 'M3 3h8v8H3zm10 0h8v8h-8zM3 13h8v8H3zm10 0h8v8h-8z',
  authors: 'M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9m-8 9c0-4.4 3.6-7 8-7s8 2.6 8 7z',
  subscribers: 'M3 5h18v14H3zm0 1 9 7 9-7',
  automation: 'M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16',
};

const matches = (path: string, href: string) =>
  href === '/admin' ? path === '/admin' : path === href || path.startsWith(href + '/');

/** The most specific menu link for this path, so "Add new" wins over "All posts & pages". */
function currentHref(path: string) {
  let best = '';
  for (const g of MENU)
    for (const l of [g, ...(g.items ?? [])])
      if (matches(path, l.href) && l.href.length > best.length) best = l.href;
  return best;
}

export function AdminNav({ email }: { email: string | null }) {
  const path = usePathname();
  const current = currentHref(path);
  const isOpen = (g: Group) => current === g.href || !!g.items?.some((i) => i.href === current);
  const open = MENU.find(isOpen);
  const nav = useRef<HTMLElement>(null);

  // On phones the menu is a sideways-scrolling row: keep the current section visible.
  useEffect(() => {
    nav.current?.querySelector('.is-open > .ad-nav')?.scrollIntoView({ inline: 'nearest', block: 'nearest' });
  }, [path]);

  const subLinks = (items: Item[]) =>
    items.map((i) => (
      <Link key={i.href} href={i.href} className="ad-sub__link" aria-current={i.href === current ? 'page' : undefined}>{i.label}</Link>
    ));

  return (
    <aside className="ad-side">
      <Link href="/admin" className="ad-side__logo">Bras<span>Q</span></Link>
      <nav ref={nav} className="ad-side__nav" aria-label="Admin">
        {MENU.map((g) => (
          <div key={g.href} className={`ad-grp${isOpen(g) ? ' is-open' : ''}`}>
            <Link href={g.href} className="ad-nav" aria-current={isOpen(g) && !g.items ? 'page' : undefined}>
              <svg viewBox="0 0 24 24" aria-hidden="true" className="ad-nav__icon"><path d={ICONS[g.icon]} /></svg>
              {g.label}
            </Link>
            {g.items && <div className="ad-sub">{subLinks(g.items)}</div>}
          </div>
        ))}
      </nav>
      {/* phones: sub-items of the open section get their own row */}
      {open?.items && <div className="ad-side__subnav">{subLinks(open.items)}</div>}
      <div className="ad-side__foot">
        {email && <span className="ad-side__user ad-cell-hide">{email}</span>}
        <a href="/" target="_blank" rel="noreferrer">View site ↗</a>
        <form action={logout}><button type="submit">Sign out</button></form>
      </div>
    </aside>
  );
}
