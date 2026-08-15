import type { MetadataRoute } from 'next';
import { fetchAllBlogPosts } from '@/lib/blogger';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://droptogit.vercel.app';

const staticRoutes = [
  { path: '', priority: 1, changeFrequency: 'weekly' as const },
  { path: '/docs', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/blog', priority: 0.8, changeFrequency: 'daily' as const },
  { path: '/about', priority: 0.5, changeFrequency: 'monthly' as const },
  { path: '/about-me', priority: 0.4, changeFrequency: 'monthly' as const },
  { path: '/contact', priority: 0.4, changeFrequency: 'yearly' as const },
  { path: '/donate', priority: 0.4, changeFrequency: 'monthly' as const },
  { path: '/privacy', priority: 0.2, changeFrequency: 'yearly' as const },
  { path: '/terms', priority: 0.2, changeFrequency: 'yearly' as const },
];

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await fetchAllBlogPosts();

  return [
    ...staticRoutes.map((route) => ({
      url: `${siteUrl}${route.path}`,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...posts.map((post) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: post.updated || post.published,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
  ];
}
