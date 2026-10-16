import type { Post } from '@/lib/types';
import { NewsletterPopup } from './NewsletterPopup';
import { PostEnhancer } from './PostEnhancer';
import { StickyBuyBar } from './StickyBuyBar';

/**
 * Comparison-table group headings are one cell spanning every column, so the cell itself can't stick while the
 * table scrolls sideways. Wrapping the text gives `.bq-cmp__group-label` something to pin to the left edge.
 */
const withStickyGroupLabels = (html: string) =>
  html.replace(/(<tr class="bq-cmp__group">\s*<th[^>]*>)(?!\s*<span class="bq-cmp__group-label")([\s\S]*?)(<\/th>)/g, '$1<span class="bq-cmp__group-label">$2</span>$3');

/** Renders a post exactly as authored in the admin: its CSS, its HTML and its JSON-LD. */
export function PostView({ post }: { post: Post }) {
  const rootId = `post-${post.id}`;
  return (
    <>
      {post.status === 'draft' && (
        <div style={{ background: 'var(--red)', color: '#fff', textAlign: 'center', padding: 8, fontSize: 13, fontWeight: 700 }}>Draft preview, not visible to readers</div>
      )}
      {post.css && <style dangerouslySetInnerHTML={{ __html: post.css }} />}
      {post.jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: post.jsonLd.replace(/</g, '\\u003c') }} />}
      <div id={rootId} className="bq-post" dangerouslySetInnerHTML={{ __html: withStickyGroupLabels(post.html) }} />
      <PostEnhancer rootId={rootId} />
      {post.stickyBar?.url && <StickyBuyBar bar={post.stickyBar} />}
      {post.newsletterPopup && <NewsletterPopup image={post.coverImage} source={`popup:${post.slug}`} />}
    </>
  );
}
