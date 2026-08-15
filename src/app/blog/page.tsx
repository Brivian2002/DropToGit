import { Metadata } from 'next';
import { Suspense } from 'react';
import { BlogContent } from '@/components/BlogContent';
import { fetchBlogPosts, getLabelByValue } from '@/lib/blogger';
import { Card, CardContent } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Updates, guides, and insights about DropToGit, web development, and open source.',
};

export const revalidate = 60;

interface BlogPageProps {
  searchParams: Promise<{ tag?: string | string[] }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const rawTag = Array.isArray(params.tag) ? params.tag[0] : params.tag;
  const activeTag = getLabelByValue(rawTag)?.label;

  const [{ posts }, overall] = await Promise.all([
    fetchBlogPosts(50, undefined, activeTag),
    activeTag ? fetchBlogPosts(1) : Promise.resolve({ posts: [] }),
  ]);

  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="h-8 w-48 bg-muted rounded animate-pulse mb-6" />
          <div className="h-10 w-80 bg-muted rounded-full animate-pulse mb-8" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="overflow-hidden">
                <div className="aspect-video bg-muted animate-pulse" />
                <CardContent className="p-4 space-y-3">
                  <div className="h-5 w-3/4 bg-muted rounded animate-pulse" />
                  <div className="h-4 w-full bg-muted rounded animate-pulse" />
                  <div className="h-4 w-2/3 bg-muted rounded animate-pulse" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      }
    >
      <BlogContent
        posts={posts}
        activeTag={activeTag}
        hasAnyPosts={activeTag ? overall.posts.length > 0 : posts.length > 0}
      />
    </Suspense>
  );
}
