import Link from 'next/link';
import { longDate, postUrl } from '@/lib/format';
import type { AuthorCard, PostCard } from '@/lib/types';

export function Photo({ src, alt = '', className = '', style, children }: { src?: string | null; alt?: string; className?: string; style?: React.CSSProperties; children?: React.ReactNode }) {
  return <div className={`bq-photo ${className}`} style={style}>{src && <img src={src} alt={alt} loading="lazy" />}{children}</div>;
}

export function Avatar({ author, size = 44 }: { author: Pick<AuthorCard, 'avatarUrl' | 'name'>; size?: number }) {
  return <div className="bq-avatar" style={{ width: size, height: size }}>{author.avatarUrl && <img src={author.avatarUrl} alt={author.name} loading="lazy" />}</div>;
}

export function GuideCard({ post }: { post: PostCard }) {
  return (
    <Link href={postUrl(post)} className="bq-gcard">
      <Photo src={post.coverImage} alt={post.title} className="bq-photo--32">
        {post.testedCount ? <span className="bq-photo-badge">{post.testedCount}&nbsp;tested</span> : null}
      </Photo>
      {post.category && <div className="bq-eyebrow">{post.category.name}</div>}
      <div className="bq-gcard__title">{post.title}</div>
      <div className="bq-gcard__meta">{post.author ? `By ${post.author.name} · ` : ''}{longDate(post.updatedAt)}</div>
    </Link>
  );
}

export function GuideListCard({ post }: { post: PostCard }) {
  return (
    <Link href={postUrl(post)} className="bq-listcard">
      <Photo src={post.coverImage} alt={post.title} />
      <div>
        {post.testedCount ? <span className="bq-eyebrow">{post.testedCount}&nbsp;models tested{post.testWeeks ? ` · ${post.testWeeks} weeks` : ''}</span> : null}
        <strong>{post.title}</strong>
        <span className="bq-listcard__intro">{post.excerpt}</span>
        <span style={{ fontSize: 13, color: 'var(--muted)' }}>{post.author ? `By ${post.author.name} · ` : ''}updated {longDate(post.updatedAt)}</span>
        {post.topPick && <span style={{ fontSize: 14, fontWeight: 700 }}>Our pick:&nbsp;{post.topPick}</span>}
      </div>
    </Link>
  );
}

export function TesterCard({ author }: { author: AuthorCard }) {
  return (
    <Link href={`/author/${author.slug}`} className="bq-tester">
      <Avatar author={author} size={72} />
      <div><strong>{author.name}</strong><span className="bq-role">{author.role}</span><span>{author.short}</span></div>
    </Link>
  );
}
