export type PostType = 'guide' | 'review' | 'comparison' | 'informational' | 'page';
export type PostStatus = 'draft' | 'published';

export interface CategoryRef { slug: string; name: string }
export interface Category extends CategoryRef { id: string; intro: string; sortOrder: number; guideCount?: number }

export interface AuthorCard { slug: string; name: string; role: string; short?: string; avatarUrl: string | null }
export interface Author extends AuthorCard {
  id: string; short: string; bio: string; email: string | null; linkedinUrl: string | null; youtubeUrl: string | null;
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
  stickyBar: StickyBar | null; newsletterPopup: boolean; featured: boolean; sections: SectionsDoc | null;
  categoryId: string | null; authorId: string | null; createdAt: string;
  category: Category | null; author: Author | null;
}

/** Section system (see brasq-be/src/lib/sections) */
export type FieldType = 'text' | 'textarea' | 'richtext' | 'number' | 'image' | 'link' | 'select' | 'toggle' | 'list' | 'post' | 'product' | 'cells' | 'code';
export interface FieldDef {
  key: string; label: string; type: FieldType; required?: boolean; help?: string; placeholder?: string; default?: unknown;
  options?: string[]; fields?: FieldDef[]; fill?: Record<string, string>; itemLabel?: string;
}
export interface SectionType {
  id: string; key: string; name: string; group: string; description: string; fields: FieldDef[]; template: string; css: string;
  sample: Record<string, unknown>; tocLabel: string; placement: 'top' | 'body' | 'bottom'; scope: 'any' | 'post' | 'home';
  builtIn: boolean; version: number; updatedAt: string; uses?: number; previewHtml?: string;
}
export interface SectionItem { id: string; type: string; data: Record<string, unknown>; hidden?: boolean; placement?: 'top' | 'body' | 'bottom'; tocLabel?: string }
export interface SectionsDoc { layout: 'toc' | 'wide' | 'raw'; className?: string; tocTitle?: string; backToTop?: boolean; items: SectionItem[] }
export interface Product {
  id: string; slug: string; name: string; score: number | null; price: number | null; image: string | null;
  shops: { name: string; url: string }[]; reviewSlug: string | null; summary: string; updatedAt: string;
}

export interface Media { id: string; key: string; url: string; filename: string; mimeType: string; size: number; alt: string; driver: string; createdAt: string }
export interface Subscriber { id: string; email: string; source: string | null; createdAt: string }
