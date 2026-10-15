import type { Post } from '@/lib/types';
import { NewsletterPopup } from './NewsletterPopup';
import { PostEnhancer } from './PostEnhancer';
import { StickyBuyBar } from './StickyBuyBar';

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
      <div id={rootId} className="bq-post" dangerouslySetInnerHTML={{ __html: post.html }} />
      <PostEnhancer rootId={rootId} />
      {post.stickyBar?.url && <StickyBuyBar bar={post.stickyBar} />}
      {post.newsletterPopup && <NewsletterPopup image={post.coverImage} source={`popup:${post.slug}`} />}
    </>
  );
}
