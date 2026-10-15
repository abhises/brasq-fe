export type PostType = 'guide' | 'review' | 'page';
export type PostStatus = 'draft' | 'published';

export interface CategoryRef { slug: string; name: string }
export interface Category extends CategoryRef { id: string; intro: string; sortOrder: number; guideCount?: number }

export interface AuthorCard { slug: string; name: string; role: string; short?: string; avatarUrl: string | null }
export interface Author extends AuthorCard {
  id: string; short: string; bio: string; email: string | null;
  facts: { value: string; label: string }[]; expertise: string[]; career: { years: string; text: string }[];
  sortOrder: number; showOnHome: boolean;
}

export interface StickyBar { name: string; score?: string; price?: string; shop?: string; url: string; image?: string }

export interface PostCard {
  id: string; type: PostType; slug: string; title: string; excerpt: string; coverImage: string | null;
  testedCount: number | null; testWeeks: number | null; topPick: string | null;
  updatedAt: string; publishedAt: string | null;
  category: CategoryRef | null; author: AuthorCard | null;
}

export interface Post extends Omit<PostCard, 'category' | 'author'> {
  status: PostStatus; html: string; css: string;
  seoTitle: string | null; seoDescription: string | null; jsonLd: string | null;
  stickyBar: StickyBar | null; newsletterPopup: boolean; featured: boolean;
  categoryId: string | null; authorId: string | null; createdAt: string;
  category: Category | null; author: Author | null;
}

export interface Media { id: string; key: string; url: string; filename: string; mimeType: string; size: number; alt: string; driver: string; createdAt: string }
export interface Subscriber { id: string; email: string; source: string | null; createdAt: string }
