import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SiteNav } from "@/components/layout/SiteNav";
import { SiteFooter } from "@/components/layout/SiteFooter";

interface BlogPost {
  id: string;
  title: string;
  snippet: string;
  published: string;
  url: string;
  slug: string;
  author: string;
  labels: string[];
  updated: string;
}

interface FullBlogPost extends BlogPost {
  content: string;
}

function formatDate(isoDate: string): string {
  try {
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return isoDate;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
    const res = await fetch(`${baseUrl}/api/blog`, {
      next: { revalidate: 300 },
    });
    const data = await res.json();
    const posts: BlogPost[] = data.posts ?? [];
    const post = posts.find((p) => p.slug === slug);

    if (!post) {
      return { title: "Post Not Found — DropToGit Blog" };
    }

    return {
      title: `${post.title} — DropToGit Blog`,
      description: post.snippet,
      openGraph: {
        title: `${post.title} — DropToGit Blog`,
        description: post.snippet,
        siteName: "DropToGit",
        type: "article",
        publishedTime: post.published,
        modifiedTime: post.updated,
        authors: [post.author],
        tags: post.labels,
        url: `/blog/${post.slug}`,
      },
    };
  } catch {
    return { title: "Blog Post — DropToGit" };
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Fetch the post list to find the matching post by slug
  let matchedPost: BlogPost | undefined;
  let fullPost: FullBlogPost | null = null;

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";

    // Fetch posts list to find the one matching our slug
    const listRes = await fetch(`${baseUrl}/api/blog`, {
      next: { revalidate: 300 },
    });
    const listData = await listRes.json();
    const posts: BlogPost[] = listData.posts ?? [];
    matchedPost = posts.find((p) => p.slug === slug);

    if (!matchedPost) {
      notFound();
    }

    // Fetch full post content by Blogger post ID
    const postRes = await fetch(`${baseUrl}/api/blog/${matchedPost.id}`, {
      next: { revalidate: 300 },
    });
    const postData = await postRes.json();

    if (postData.post) {
      fullPost = {
        ...matchedPost,
        content: postData.post.content,
      };
    }
  } catch {
    notFound();
  }

  if (!matchedPost) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteNav />

      <main className="flex-1">
        <article className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-12">
          {/* Back link */}
          <Link
            href="/blog"
            className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>

          {/* Post header */}
          <header className="mb-8 space-y-4">
            <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              {matchedPost.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <User className="h-4 w-4" />
                {matchedPost.author}
              </span>
              <span className="text-muted-foreground/40">·</span>
              <span className="flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4" />
                <time dateTime={matchedPost.published}>
                  {formatDate(matchedPost.published)}
                </time>
              </span>
            </div>

            {matchedPost.labels && matchedPost.labels.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {matchedPost.labels.map((label) => (
                  <Badge key={label} variant="secondary" className="text-xs">
                    {label}
                  </Badge>
                ))}
              </div>
            )}
          </header>

          {/* Post content — Blogger HTML with prose-like typography */}
          <div className="prose prose-sm max-w-none text-foreground sm:prose-base dark:prose-invert [&_a]:text-brand-green [&_a]:underline-offset-2 [&_a]:hover:text-brand-green/80 [&_blockquote]:border-l-brand-green [&_blockquote]:text-muted-foreground [&_code]:rounded-md [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[0.875em] [&_code]:before:content-none [&_code]:after:content-none [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:tracking-tight [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:mt-8 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-6 [&_hr]:border-border [&_img]:rounded-lg [&_img]:shadow-sm [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:leading-relaxed [&_p]:text-foreground/90 [&_pre]:rounded-lg [&_pre]:bg-muted [&_pre]:border [&_pre]:p-4 [&_pre]:overflow-x-auto [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mb-1 [&_table]:w-full [&_table]:text-sm [&_th]:border-b [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-medium [&_td]:border-b [&_td]:px-3 [&_td]:py-2">
            {fullPost?.content ? (
              <div dangerouslySetInnerHTML={{ __html: fullPost.content }} />
            ) : (
              <div className="space-y-4 text-muted-foreground">
                <p>The full content of this article could not be loaded.</p>
                {matchedPost.url && (
                  <p>
                    You can read it on the original Blogger page:{" "}
                    <a
                      href={matchedPost.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-green underline underline-offset-2"
                    >
                      {matchedPost.title}
                    </a>
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Bottom back link */}
          <div className="mt-12 border-t pt-6">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Link>
          </div>
        </article>
      </main>

      <SiteFooter />
    </div>
  );
}
