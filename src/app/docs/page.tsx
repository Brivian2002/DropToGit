"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Key,
  GitBranch,
  RefreshCw,
  AlertTriangle,
  ShieldCheck,
  Rocket,
} from "lucide-react";
import SiteNav from "@/components/layout/SiteNav";
import SiteFooter from "@/components/layout/SiteFooter";

const sections = [
  {
    id: "getting-started",
    icon: BookOpen,
    title: "Getting Started",
    content: (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">
          What is a Personal Access Token?
        </h3>
        <p className="leading-relaxed text-muted-foreground">
          A GitHub Personal Access Token (PAT) is a special credential that lets
          DropToGit talk to GitHub&rsquo;s API on your behalf. Think of it as a
          temporary, scoped key that says &ldquo;this app is allowed to push
          files to my repo.&rdquo;
        </p>
        <h3 className="text-lg font-semibold">Why do I need one?</h3>
        <p className="leading-relaxed text-muted-foreground">
          DropToGit doesn&rsquo;t store your GitHub login. Instead, it uses
          GitHub&rsquo;s official Data API — and that API requires authentication.
          A fine-grained PAT is the safest way to grant access to a single
          repository without exposing your full account.
        </p>
        <div className="rounded-lg border bg-muted/40 p-4">
          <p className="text-sm font-medium">
            You&rsquo;ll create a token with only the permissions needed. Once
            you&rsquo;re done, you can revoke it anytime from GitHub Settings.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "creating-pat",
    icon: Key,
    title: "Creating a Fine-Grained PAT",
    content: (
      <div className="space-y-4">
        <p className="leading-relaxed text-muted-foreground">
          Follow these exact steps to create a token that works with DropToGit:
        </p>
        <ol className="list-decimal space-y-3 pl-6 leading-relaxed text-muted-foreground">
          <li>
            Go to{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono text-foreground">
              github.com → Settings → Developer settings → Personal access tokens → Fine-grained tokens
            </code>
          </li>
          <li>
            Click <strong className="text-foreground">Generate new token</strong>.
          </li>
          <li>
            Give it a name (e.g. &ldquo;DropToGit&rdquo;) and set an expiration
            that works for you.
          </li>
          <li>
            Under <strong className="text-foreground">Repository access</strong>,
            select{" "}
            <strong className="text-foreground">
              Only select repositories
            </strong>{" "}
            and pick the repo you want to push to.
          </li>
          <li>
            Under <strong className="text-foreground">Permissions</strong>,
            navigate to{" "}
            <strong className="text-foreground">Repository permissions</strong>{" "}
            and set:
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>
                <strong className="text-foreground">Contents</strong>:{" "}
                <Badge variant="outline" className="text-xs">
                  Read and write
                </Badge>
              </li>
            </ul>
          </li>
          <li>
            Click <strong className="text-foreground">Generate token</strong>{" "}
            and copy it. You won&rsquo;t be able to see it again.
          </li>
        </ol>
        <div className="rounded-lg border border-brand-green/20 bg-brand-green-soft/50 p-4">
          <p className="text-sm text-foreground">
            <strong>Required scope:</strong> Only{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
              Contents: Read and write
            </code>{" "}
            is needed. Nothing else.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "connecting-repo",
    icon: GitBranch,
    title: "Connecting Your Repo",
    content: (
      <div className="space-y-4">
        <p className="leading-relaxed text-muted-foreground">
          Once you have your PAT, connecting to a repository is simple:
        </p>
        <ol className="list-decimal space-y-3 pl-6 leading-relaxed text-muted-foreground">
          <li>
            Paste your PAT into the token field on the DropToGit homepage. The
            app will validate it and fetch a list of repositories your token can
            access.
          </li>
          <li>
            Select your target repository from the dropdown (or type to search).
          </li>
          <li>
            If the repository doesn&rsquo;t exist yet, you can create it
            directly from the same interface by entering a new name and clicking
            &ldquo;Create repository.&rdquo;
          </li>
          <li>
            Choose your upload mode and drop your project folder onto the
            dropzone.
          </li>
        </ol>
        <p className="leading-relaxed text-muted-foreground">
          DropToGit communicates directly with GitHub&rsquo;s API. Your token
          and files never pass through any intermediate server — they go
          straight from your browser to GitHub over HTTPS.
        </p>
      </div>
    ),
  },
  {
    id: "replace-vs-smart",
    icon: RefreshCw,
    title: "Replace All vs. Smart Update",
    content: (
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border bg-muted/30 p-4">
            <h4 className="font-semibold">Replace All</h4>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Deletes every file in the repository and replaces them with the
              contents of your uploaded folder. The repository becomes an exact
              mirror of what you dropped.
            </p>
            <p className="mt-3 text-sm font-medium text-foreground">
              Use when: starting fresh, deploying a complete project, or when the
              repo should exactly match your local folder.
            </p>
          </div>
          <div className="rounded-xl border bg-muted/30 p-4">
            <h4 className="font-semibold">Smart Update</h4>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Compares files by path. Files that exist in both and have changed
              are updated. New files are added. Files removed from your folder
              are deleted from the repo.
            </p>
            <p className="mt-3 text-sm font-medium text-foreground">
              Use when: iterating on an existing project and only want to push
              what changed.
            </p>
          </div>
        </div>
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
          <p className="text-sm font-medium text-destructive">
            Warning: Replace All is irreversible. It will delete all existing
            files in the target branch, including any you didn&rsquo;t upload.
            Use with caution on repositories with multiple contributors.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "troubleshooting",
    icon: AlertTriangle,
    title: "Troubleshooting",
    content: (
      <div className="space-y-6">
        <div>
          <h4 className="font-semibold">
            403 Forbidden / Token permissions error
          </h4>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Your PAT doesn&rsquo;t have the correct permissions. Make sure
            you&rsquo;re using a{" "}
            <strong className="text-foreground">fine-grained token</strong> with{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
              Contents: Read and write
            </code>{" "}
            scoped to the target repository. Classic tokens may not work properly
            with the Data API endpoints DropToGit uses.
          </p>
        </div>
        <div>
          <h4 className="font-semibold">Rate limit exceeded</h4>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            GitHub limits API requests per hour. Fine-grained tokens get up to
            15,000 requests/hour. If you hit this limit, wait a few minutes
            before trying again. DropToGit batches requests to minimize rate
            limit usage.
          </p>
        </div>
        <div>
          <h4 className="font-semibold">Large file upload failures</h4>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            GitHub&rsquo;s API has a 100 MB per-file limit. Files larger than
            this cannot be uploaded via the Data API and will cause the upload
            to fail. Consider using Git Large File Storage (Git LFS) directly
            for files exceeding this limit.
          </p>
        </div>
        <div>
          <h4 className="font-semibold">Repository not found</h4>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Verify that your token has access to the selected repository. In your
            token&rsquo;s settings, make sure the repository is explicitly listed
            under &ldquo;Repository access.&rdquo;
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "security-faq",
    icon: ShieldCheck,
    title: "Security FAQ",
    content: (
      <div className="space-y-6">
        <div>
          <h4 className="font-semibold">
            Is my GitHub token ever stored or logged?
          </h4>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            <strong className="text-foreground">No.</strong> Your PAT is held
            only in browser memory (JavaScript variables) for the duration of
            the session. It is never:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-6 text-sm text-muted-foreground">
            <li>Written to a database</li>
            <li>Written to server-side logs</li>
            <li>Stored in localStorage, sessionStorage, or cookies</li>
            <li>Sent to any server other than GitHub&rsquo;s API</li>
          </ul>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            When you close the tab or refresh, the token is gone. Our API routes
            act as a passthrough — they receive the token in the request header,
            forward it to GitHub, and return GitHub&rsquo;s response. They never
            persist it.
          </p>
        </div>
        <div>
          <h4 className="font-semibold">Are my files stored anywhere?</h4>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            No. Files are read from your device using the browser&rsquo;s File
            API, packaged into the upload format in memory, and streamed
            directly to GitHub&rsquo;s API. Nothing touches our filesystem or
            database.
          </p>
        </div>
        <div>
          <h4 className="font-semibold">
            What about the server-side API routes?
          </h4>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            The API routes exist to handle CORS and request forwarding. They
            receive the file data and token, forward them to GitHub, and stream
            the response back. No request body or header is logged or stored.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "roadmap",
    icon: Rocket,
    title: "Roadmap",
    content: (
      <div className="space-y-4">
        <p className="leading-relaxed text-muted-foreground">
          Here&rsquo;s what we&rsquo;re working on and planning:
        </p>
        <ul className="space-y-3">
          {[
            {
              name: "Project Analyzer",
              desc: "Automatically detect project type (React, Next.js, Python, etc.) and suggest configuration.",
            },
            {
              name: "Smart Cleanup",
              desc: "Detect and optionally remove node_modules, .git, dist, and other generated folders before upload.",
            },
            {
              name: "Secret Scanner",
              desc: "Scan files for API keys, tokens, and credentials before they reach GitHub. Warn or block the upload.",
            },
            {
              name: "Paystack Donations",
              desc: "Integrated card and mobile money donations via Paystack for supporters in Africa and beyond.",
            },
            {
              name: "Vercel Deployment",
              desc: "One-click deploy your pushed project directly to Vercel after uploading to GitHub.",
            },
          ].map((item) => (
            <li
              key={item.name}
              className="rounded-lg border bg-muted/30 px-4 py-3"
            >
              <p className="font-medium">{item.name}</p>
              <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
            </li>
          ))}
        </ul>
      </div>
    ),
  },
];

export default function DocsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteNav />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-10 sm:py-16">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            <span className="text-gradient-green">Documentation</span>
          </h1>
          <p className="mt-2 text-muted-foreground">
            Everything you need to use DropToGit effectively.
          </p>

          <div className="mt-10">
            <Accordion type="multiple" className="w-full">
              {sections.map((section) => (
                <AccordionItem key={section.id} value={section.id}>
                  <AccordionTrigger className="text-base">
                    <span className="flex items-center gap-3">
                      <section.icon className="h-5 w-5 shrink-0 text-brand-green" />
                      {section.title}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>{section.content}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
