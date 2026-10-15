import 'server-only';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { connection } from 'next/server';
import { cache } from 'react';
import { PostView } from '@/components/site/PostView';
import { getPublic, SITE_URL } from './api';
import { postUrl } from './format';
import type { Post, PostType } from './types';

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ preview?: string }> };

const load = cache(async (type: PostType, slug: string, preview: boolean) => {
  await connection();
  const data = await getPublic<{ post: Post }>(`/posts/${type}/${encodeURIComponent(slug)}${preview ? '?preview=1' : ''}`, { auth: preview });
  return data?.post ?? null;
});

/** Builds page + generateMetadata for a post type. ?preview=1 shows drafts to a logged-in admin. */
export function postRoute(type: PostType) {
  async function getPost(props: Props) {
    const [{ slug }, sp] = await Promise.all([props.params, props.searchParams]);
    return load(type, slug, sp.preview === '1');
  }

  async function generateMetadata(props: Props): Promise<Metadata> {
    const post = await getPost(props);
    if (!post) return {};
    const description = post.seoDescription || post.excerpt;
    return {
      title: post.seoTitle || `${post.title} | BrasQ`,
      description,
      alternates: { canonical: SITE_URL + postUrl(post) },
      robots: post.status === 'draft' ? { index: false } : undefined,
      openGraph: { title: post.title, description, type: 'article', images: post.coverImage ? [post.coverImage] : undefined },
    };
  }

  async function Page(props: Props) {
    const post = await getPost(props);
    if (!post) notFound();
    return <PostView post={post} />;
  }

  return { Page, generateMetadata };
}
