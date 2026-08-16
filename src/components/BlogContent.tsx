'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import {
  Calendar, Clock, Tag, X, Loader2, ImageIcon, ExternalLink,
  LayoutGrid, Newspaper, Cpu, Wrench, Lightbulb, BookOpen, Globe, Rocket, Sparkles,
  type LucideIcon,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollControls } from '@/components/ScrollControls';
import {
  type BloggerPost,
  type BlogCategory,
  type BlogFetchError,
  BLOG_CATEGORIES,
  BLOG_LABELS,
  labelToKey,
  getPostExcerpt,
  formatDate,
  getCategoryByKey,
} from '@/lib/blogger';
import { cn } from '@/lib/utils';

// ─── Icon renderer ─────────────────────────────────────────────────

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

function CategoryIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICON_MAP[name] || LayoutGrid;
  return <Icon className={className} />;
}

// ─── Props ─────────────────────────────────────────────────────────

interface BlogContentProps {
  posts: BloggerPost[];
  activeTag?: string;
  hasAnyPosts: boolean;
  blogError?: BlogFetchError;
}

// ─── Post Card Skeleton ────────────────────────────────────────────

function PostCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="aspect-video w-full" />
      <CardContent className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex gap-2 pt-1">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Blog Post Card ────────────────────────────────────────────────

function BlogPostCard({ post, onRead }: { post: BloggerPost; onRead: () => void }) {
  const matchedCategories = post.categories.map((categoryKey) => getCategoryByKey(categoryKey));
  const visibleCategories = matchedCategories.length > 0 ? matchedCategories : [getCategoryByKey(post.category)];

  return (
    <Card
      className="overflow-hidden group cursor-pointer hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 border-border/60 hover:border-primary/30"
      onClick={onRead}
    >
      {/* Image */}
      <div className="relative aspect-video bg-muted overflow-hidden">
        {post.featuredImage ? (
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-muted-foreground/40">
            <ImageIcon className="h-12 w-12" />
            <span className="text-xs">No image</span>
          </div>
        )}
        {/* Matching Blogger label badges */}
        <div className="absolute top-3 left-3 flex max-w-[90%] flex-wrap gap-1.5">
          {visibleCategories.slice(0, 3).map((category) => (
            <Badge key={category.key} className="bg-black/60 text-white border-0 backdrop-blur-sm text-[11px] font-medium hover:bg-black/60">
              <CategoryIcon name={category.icon} className="mr-1.5 h-3 w-3" />
              {category.label}
            </Badge>
          ))}
          {visibleCategories.length > 3 && (
            <Badge className="bg-black/60 text-white border-0 backdrop-blur-sm text-[11px] font-medium hover:bg-black/60">
              +{visibleCategories.length - 3}
            </Badge>
          )}
        </div>
      </div>

      <CardContent className="p-4 space-y-3">
        <h3 className="font-semibold text-base leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {post.title}
        </h3>

        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
          {getPostExcerpt(post.content, 140)}
        </p>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(post.published)}
            </span>
          </div>
          <span className="text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            Read →
          </span>
        </div>

        {post.labels && post.labels.length > 0 && (
          <div className="flex gap-1.5 flex-wrap pt-1">
            {post.labels.slice(0, 3).map((label) => (
              <Badge
                key={label}
                variant="secondary"
                className="text-[10px] px-1.5 py-0 font-normal"
              >
                #{label}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Category Tab ──────────────────────────────────────────────────

function CategoryTab({
  cat,
  isActive,
  href,
}: {
  cat: BlogCategory;
  isActive: boolean;
  href: string;
}) {
  return (
    <Link
      href={href}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap shrink-0',
        isActive
          ? 'bg-primary text-primary-foreground shadow-sm'
          : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground',
      )}
    >
      <CategoryIcon name={cat.icon} className="h-3.5 w-3.5" />
      <span>{cat.label}</span>
    </Link>
  );
}

// ─── Full Post Reader (Sheet Sidebar) ──────────────────────────────

function PostReader({
  post,
  open,
  onOpenChange,
}: {
  post: BloggerPost | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const cat = post ? getCategoryByKey(post.category) : null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="relative mx-auto h-[min(94vh,960px)] w-full max-w-4xl overflow-hidden rounded-t-2xl p-0 flex flex-col gap-0"
      >
        {post ? (
          <>
            {/* Hero image */}
            <div className="relative w-full max-h-[180px] sm:max-h-[260px] bg-muted overflow-hidden shrink-0">
              {post.featuredImage ? (
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full min-h-[200px] flex flex-col items-center justify-center gap-2 text-muted-foreground/30">
                  <ImageIcon className="h-16 w-16" />
                </div>
              )}
              {/* Gradient overlay for the close button area */}
              <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-black/40 to-transparent" />
            </div>

            {/* Post header */}
            <div className="mx-auto w-full max-w-2xl px-4 sm:px-6 pt-4 pb-0 space-y-3 shrink-0">
              <div className="flex items-center justify-between gap-3">
                <Badge variant="secondary" className="text-xs">
                  <CategoryIcon name={cat?.icon || ''} className="mr-1.5 h-3 w-3" />
                  {cat?.label}
                </Badge>
                <button
                  onClick={() => onOpenChange(false)}
                  className="h-8 w-8 rounded-full bg-muted/80 flex items-center justify-center hover:bg-muted transition-colors"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <SheetTitle className="text-xl sm:text-2xl font-bold leading-tight">
                {post.title}
              </SheetTitle>

              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground pb-3 border-b">
                {post.author?.displayName && (
                  <span>by {post.author.displayName}</span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDate(post.published)}
                </span>
                {post.updated !== post.published && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    Updated {formatDate(post.updated)}
                  </span>
                )}
              </div>

              {post.labels && post.labels.length > 0 && (
                <div className="flex gap-1.5 flex-wrap pb-3">
                  {post.labels.map((label) => (
                    <Link
                      key={label}
                      href={`/blog?tag=${encodeURIComponent(label).replace(/%20/g, '+')}`}
                      className="inline-flex items-center rounded-full border border-border px-2 py-1 text-[11px] font-normal text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                    >
                      <Tag className="mr-1 h-3 w-3" />
                      #{label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Post body: a real viewport-sized reader with vertical and horizontal overflow handled safely. */}
            <div className="relative min-h-0 flex-1">
              <div
                id="blog-reader-scroll"
                className="h-full min-h-0 overflow-y-auto overflow-x-hidden overscroll-contain px-4 py-5 sm:px-6 scrollbar-thin"
                tabIndex={0}
                aria-label="Blog post reader"
              >
                <article
                  className="blog-content prose prose-sm mx-auto w-full max-w-[44rem] min-w-0
                    prose-headings:font-semibold prose-headings:tracking-tight
                    prose-p:leading-relaxed prose-a:no-underline hover:prose-a:underline
                    prose-code:font-mono prose-code:text-sm prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                    prose-pre:my-4 prose-pre:max-w-full prose-pre:overflow-x-auto prose-pre:border prose-pre:rounded-lg
                    prose-img:my-4 prose-img:max-w-full prose-blockquote:border-l-primary"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </div>
              <ScrollControls targetId="blog-reader-scroll" />
            </div>

            {/* Bottom action bar */}
            <div className="px-6 py-4 border-t bg-muted/30 shrink-0">
              <a
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                View on Blogger
              </a>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

// ─── Main BlogContent Component ────────────────────────────────────

export function BlogContent({ posts, activeTag, hasAnyPosts, blogError }: BlogContentProps) {
  const [selectedPost, setSelectedPost] = useState<BloggerPost | null>(null);
  const [readerOpen, setReaderOpen] = useState(false);
  const [fullPost, setFullPost] = useState<BloggerPost | null>(null);
  const activeCategory = activeTag ? getCategoryByKey(labelToKey(activeTag)) : getCategoryByKey('all');

  const filteredPosts = posts;

  // Open post reader
  const handleReadPost = useCallback(async (post: BloggerPost) => {
    setSelectedPost(post);
    setReaderOpen(true);
    setFullPost(null);

    try {
      const res = await fetch(`/api/blog/post/${post.id}`);
      if (res.ok) {
        const data = await res.json();
        setFullPost(data);
      } else {
        // Fallback to the data we already have
        setFullPost(post);
      }
    } catch {
      setFullPost(post);
    }
  }, []);

  const displayPost = fullPost || selectedPost;

  const visibleCategories = BLOG_CATEGORIES;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-8">
      {/* Page header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Blog</h1>
        <p className="text-muted-foreground max-w-xl">
          Updates, guides, and insights about DropToGit, web development, and the open-source world.
          Posts are categorized by hashtag labels.
        </p>
      </div>

      {/* Category tabs - horizontal scrollable */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin -mx-4 px-4">
        {visibleCategories.map((cat) => (
          <CategoryTab
            key={cat.key}
            cat={cat}
            isActive={activeCategory.key === cat.key}
            href={cat.key === 'all' ? '/blog' : `/blog?tag=${encodeURIComponent(cat.label).replace(/%20/g, '+')}`}
          />
        ))}
      </div>

      {/* Active category description */}
      {activeTag && (
        <p className="text-sm text-muted-foreground -mt-4">
          Showing posts tagged <span className="font-medium text-foreground">{activeTag}</span>. {activeCategory.description}
        </p>
      )}

      {/* Post grid */}
      {blogError === 'missing-config' ? (
        <Card>
          <CardContent className="py-20 text-center space-y-3">
            <p className="text-muted-foreground text-lg">Blogger is not connected yet</p>
            <p className="text-sm text-muted-foreground">
              Add BLOGGER_API_KEY and BLOGGER_BLOG_ID to the Vercel Production environment, then redeploy.
            </p>
          </CardContent>
        </Card>
      ) : blogError === 'api-error' ? (
        <Card>
          <CardContent className="py-20 text-center space-y-3">
            <p className="text-muted-foreground text-lg">Blogger could not be reached</p>
            <p className="text-sm text-muted-foreground">
              Check that Blogger API v3 is enabled and the API key permits server-side requests from Vercel.
            </p>
          </CardContent>
        </Card>
      ) : !hasAnyPosts ? (
        <Card>
          <CardContent className="py-20 text-center space-y-3">
            <p className="text-muted-foreground text-lg">No posts yet</p>
            <p className="text-sm text-muted-foreground">
              Check back soon — we&apos;re working on the first articles.
            </p>
          </CardContent>
        </Card>
      ) : filteredPosts.length === 0 && activeTag ? (
        <Card>
          <CardContent className="py-16 text-center space-y-3">
            <p className="text-muted-foreground text-lg">No posts tagged &apos;{activeTag}&apos; yet</p>
            <p className="text-sm text-muted-foreground">
              Try <Link href="/blog" className="text-primary hover:underline">All posts</Link> or check back soon.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPosts.map((post) => (
            <BlogPostCard
              key={post.id}
              post={post}
              onRead={() => handleReadPost(post)}
            />
          ))}
        </div>
      )}

      {/* Hashtag system explanation */}
      {posts.length > 0 && (
        <div className="rounded-lg border bg-muted/30 p-5 space-y-3">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <Tag className="h-4 w-4" />
            How Categories Work
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Every blog post is automatically categorized based on its labels (hashtags).
            When publishing on Blogger, use one of these exact labels so filters stay consistent:
          </p>
          <div className="flex flex-wrap gap-2">
            {BLOG_LABELS.map(({ label }) => (
              <code key={label} className="rounded bg-muted px-2 py-1 text-xs font-mono">{label}</code>
            ))}
          </div>
        </div>
      )}

      {/* Post Reader Sheet */}
      <PostReader
        post={displayPost}
        open={readerOpen}
        onOpenChange={setReaderOpen}
      />
    </div>
  );
}
