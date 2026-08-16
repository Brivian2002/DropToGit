import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft, Calendar, ImageIcon, ExternalLink,
  LayoutGrid, Newspaper, Cpu, Wrench, Lightbulb, BookOpen, Globe, Rocket, Sparkles,
  type LucideIcon,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollToTopButton } from '@/components/ScrollToTopButton';
import { fetchBlogPost, formatDate, getCategoryByKey } from '@/lib/blogger';

const ICON_MAP: Record<string, LucideIcon> = {
  'layout-grid': LayoutGrid,
  newspaper: Newspaper,
  cpu: Cpu,
  wrench: Wrench,
  lightbulb: Lightbulb,
  'book-open': BookOpen,
  globe: Globe,
  rocket: Rocket,
  sparkles: Sparkles,
};

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchBlogPost(slug);
  if (!post) return { title: 'Post Not Found' };
  return {
    title: post.title,
    description: post.content.replace(/<[^>]*>/g, '').slice(0, 160),
    openGraph: post.featuredImage
      ? { images: [{ url: post.featuredImage }] }
      : undefined,
  };
}

export const revalidate = 60;

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await fetchBlogPost(slug);

  if (!post) notFound();

  const cat = getCategoryByKey(post.category);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <div className="mx-auto w-full max-w-4xl space-y-6">
      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Blog
      </Link>

      <article className="mx-auto w-full max-w-3xl space-y-5">
        {/* Featured image */}
        {post.featuredImage ? (
          <div className="rounded-xl overflow-hidden border">
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full max-h-[400px] object-cover"
            />
          </div>
        ) : (
          <div className="rounded-xl border bg-muted/40 h-48 flex items-center justify-center text-muted-foreground/30">
            <ImageIcon className="h-14 w-14" />
          </div>
        )}

        {/* Header */}
        <header className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {(() => {
                const Icon = ICON_MAP[cat.icon] || Newspaper;
                return <Icon className="mr-1.5 h-3 w-3" />;
              })()}
              {cat.label}
            </Badge>
            {post.labels?.map((label) => (
              <Link
                key={label}
                href={`/blog?tag=${encodeURIComponent(label).replace(/%20/g, '+')}`}
                className="inline-flex items-center rounded-full border border-border px-2 py-1 text-[11px] font-normal text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
              >
                #{label}
              </Link>
            ))}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {formatDate(post.published)}
            </span>
            {post.author?.displayName && (
              <span>by {post.author.displayName}</span>
            )}
          </div>
        </header>

        {/* Body */}
        <div
          className="blog-content prose prose-sm max-w-none
            prose-headings:font-semibold prose-headings:tracking-tight
            prose-p:leading-relaxed prose-a:no-underline hover:prose-a:underline
            prose-code:font-mono prose-code:text-sm prose-code:px-1 prose-code:py-0.5 prose-code:rounded
            prose-pre:border prose-pre:rounded-lg prose-img:rounded-lg prose-img:my-4
            prose-blockquote:border-l-primary"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Footer */}
        <Card className="bg-muted/30">
          <CardContent className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <Link
              href="/blog"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back to all posts
            </Link>
            <a
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              View on Blogger
            </a>
          </CardContent>
        </Card>
      </article>
      </div>
      <ScrollToTopButton />
    </div>
  );
}
