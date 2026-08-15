import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, ArrowRight, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SiteNav } from "@/components/layout/SiteNav";
import { SiteFooter } from "@/components/layout/SiteFooter";

export const metadata: Metadata = {
  title: "Blog — DropToGit",
  description:
    "News, tutorials, and updates from the DropToGit team. Learn how to push projects to GitHub with drag and drop.",
  openGraph: {
    title: "Blog — DropToGit",
    description:
      "News, tutorials, and updates from the DropToGit team.",
    siteName: "DropToGit",
    type: "website",
  },
};

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

export default async function BlogPage() {
  let posts: BlogPost[] = [];
  let message: string | undefined;

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
    const res = await fetch(`${baseUrl}/api/blog`, {
      next: { revalidate: 300 },
    });
    const data = await res.json();
    posts = data.posts ?? [];
    message = data.message;
  } catch {
    // Network error or parsing error — show empty state
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteNav />

      <main className="flex-1">
        {/* Page header */}
        <section className="relative overflow-hidden border-b">
          <div className="absolute inset-0 bg-grid opacity-40" aria-hidden />
          <div className="absolute -top-20 left-1/2 h-52 w-[32rem] -translate-x-1/2 rounded-full bg-brand-green/8 blur-3xl" aria-hidden />
          <div className="relative mx-auto w-full max-w-6xl px-4 py-10 sm:py-14">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <BookOpen className="h-4 w-4 text-brand-green" />
                <span>DropToGit Blog</span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                News &{" "}
                <span className="text-gradient-green">Updates</span>
              </h1>
              <p className="max-w-xl text-muted-foreground">
                Tutorials, release notes, and tips to help you get the most out of
                DropToGit. Push projects to GitHub — no terminal required.
              </p>
            </div>
          </div>
        </section>

        {/* Posts grid or empty state */}
        <section className="mx-auto w-full max-w-6xl px-4 py-8 sm:py-10">
          {posts.length > 0 ? (
            <>
              <div className="mb-6 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {posts.length} {posts.length === 1 ? "article" : "articles"}
                </p>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                {posts.map((post) => (
                  <Card
                    key={post.id}
                    className="group animate-float-in transition-shadow hover:shadow-md"
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <CalendarDays className="h-3.5 w-3.5" />
                        <time dateTime={post.published}>
                          {formatDate(post.published)}
                        </time>
                        <span className="text-muted-foreground/40">·</span>
                        <span>{post.author}</span>
                      </div>
                      <CardTitle className="mt-2 text-lg leading-snug">
                        <Link
                          href={`/blog/${post.slug}`}
                          className="after:absolute after:inset-0 relative transition-colors group-hover:text-brand-green"
                        >
                          {post.title}
                        </Link>
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="pb-3">
                      {post.labels && post.labels.length > 0 && (
                        <div className="mb-3 flex flex-wrap gap-1.5">
                          {post.labels.slice(0, 4).map((label) => (
                            <Badge key={label} variant="secondary" className="text-[11px]">
                              {label}
                            </Badge>
                          ))}
                        </div>
                      )}
                      <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                        {post.snippet}
                      </p>
                    </CardContent>

                    <CardFooter className="pt-0">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center gap-1 text-sm font-medium text-brand-green transition-colors hover:text-brand-green/80"
                      >
                        Read more
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            /* Empty / Coming Soon state */
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border bg-muted/50">
                <BookOpen className="h-9 w-9 text-muted-foreground" />
              </div>
              <h2 className="mb-2 text-xl font-semibold tracking-tight">
                {message ? "Blog coming soon" : "No posts yet"}
              </h2>
              <p className="max-w-md text-sm text-muted-foreground">
                {message
                  ? "We're setting up the blog. Check back soon for articles about DropToGit, Git tips, and developer workflows."
                  : "Blog posts will appear here once they're published. Stay tuned for tutorials and updates."}
              </p>
              <Link
                href="/"
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <ArrowRight className="h-4 w-4 rotate-180" />
                Back to Home
              </Link>
            </div>
          )}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
