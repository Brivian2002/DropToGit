import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "@/components/layout/SiteNav";
import SiteFooter from "@/components/layout/SiteFooter";

export const metadata: Metadata = {
  title: "About — DropToGit",
};

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteNav />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-10 sm:py-16">
          <article className="prose prose-neutral max-w-none dark:prose-invert">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              About <span className="text-gradient-green">DropToGit</span>
            </h1>

            <h2 className="mt-10 text-xl font-semibold tracking-tight">
              Why DropToGit exists
            </h2>

            <p className="mt-4 leading-relaxed text-muted-foreground">
              Pushing a project to GitHub usually means installing Git, learning
              commands, and managing credentials in a terminal.{" "}
              <span className="text-foreground font-medium">
                DropToGit skips all of that
              </span>{" "}
              — drag your project folder in, and it&rsquo;s pushed straight to
              your repository using GitHub&rsquo;s own Data API.
            </p>

            <p className="mt-4 leading-relaxed text-muted-foreground">
              <strong className="text-foreground">No terminal.</strong> No Git
              installation. No stored tokens. Your Personal Access Token is sent
              directly to GitHub over HTTPS for that session only — it&rsquo;s
              never logged, stored, or seen by anyone but you and GitHub.
            </p>

            <p className="mt-4 leading-relaxed text-muted-foreground">
              DropToGit was built for developers, students, and anyone who wants a
              faster, simpler way to ship code to GitHub — especially useful for
              quick projects, prototypes, and non-technical collaborators who find
              the command line intimidating.
            </p>

            <div className="mt-10 rounded-xl border bg-muted/40 p-6">
              <p className="text-sm leading-relaxed text-muted-foreground">
                Built and maintained independently by{" "}
                <Link
                  href="/about-me"
                  className="font-semibold text-brand-green underline-offset-4 hover:underline"
                >
                  Bright Dumashie
                </Link>
                .
              </p>
            </div>
          </article>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
