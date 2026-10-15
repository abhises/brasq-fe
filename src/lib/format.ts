export const longDate = (iso: string | null | undefined) =>
  iso ? new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }) : '';

export const postUrl = (p: { type: string; slug: string }) =>
  p.type === 'guide' ? `/guide/${p.slug}` : p.type === 'review' ? `/review/${p.slug}` : `/${p.slug}`;

export const slugify = (s: string) => s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
