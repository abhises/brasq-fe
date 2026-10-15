import type { MetadataRoute } from 'next';
import { getPublic, SITE_URL } from '@/lib/api';
import { postUrl } from '@/lib/format';

type Data = { posts: { type: string; slug: string; updatedAt: string }[]; categories: { slug: string; updatedAt: string }[]; authors: { slug: string; updatedAt: string }[] };

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const d = await getPublic<Data>('/sitemap');
  if (!d) return [];
  return [
    { url: SITE_URL + '/' },
    { url: SITE_URL + '/team' },
    ...d.posts.map((p) => ({ url: SITE_URL + postUrl(p), lastModified: p.updatedAt })),
    ...d.categories.map((c) => ({ url: `${SITE_URL}/category/${c.slug}`, lastModified: c.updatedAt })),
    ...d.authors.map((a) => ({ url: `${SITE_URL}/author/${a.slug}`, lastModified: a.updatedAt })),
  ];
}
