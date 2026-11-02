export const longDate = (iso: string | null | undefined) =>
  iso ? new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }) : '';

/** URL prefix per post type. Pages live at the root: /<slug>. */
const PREFIX: Record<string, string> = { guide: '/guide/', review: '/review/', comparison: '/compare/', informational: '/explained/' };
export const postUrl = (p: { type: string; slug: string }) => (PREFIX[p.type] ?? '/') + p.slug;

/** Human label per post type, used for eyebrows in lists and in the admin. */
export const TYPE_LABEL: Record<string, string> = { guide: 'Buying guide', review: 'Review', comparison: 'Comparison', informational: 'Explained', page: 'Page' };
export const typeLabel = (type: string) => TYPE_LABEL[type] ?? type;

export const slugify = (s: string) => s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
