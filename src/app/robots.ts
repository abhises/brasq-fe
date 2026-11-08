import type { MetadataRoute } from 'next';

// Render at request time so the runtime SITE_URL is used (not the build-time fallback).
export const dynamic = 'force-dynamic';

export default function robots(): MetadataRoute.Robots {
  const site = (process.env.SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '');
  return { rules: [{ userAgent: '*', allow: '/', disallow: ['/admin', '/api'] }], sitemap: `${site}/sitemap.xml` };
}
