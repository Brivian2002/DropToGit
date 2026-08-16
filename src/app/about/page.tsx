import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ArrowRight,
  BookOpen,
  GitBranch,
  KeyRound,
  Lock,
  Shield,
  Terminal,
  Upload,
  UserX,
} from 'lucide-react';

export const metadata = { title: 'About' };

const steps = [
  {
    icon: KeyRound,
    title: 'Connect a repository',
    description:
      'Use a GitHub Personal Access Token with the narrowest repository permissions you need. DropToGit uses the token to identify repositories and prepare the push workflow.',
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  {
    icon: Upload,
    title: 'Bring in your project',
    description:
      'Drop a local folder or zip file into the browser. The app reads the files locally, normalizes their paths, and shows the complete hierarchy before anything is committed.',
    color: 'text-sky-accent',
    bg: 'bg-sky-accent/10',
  },
  {
    icon: GitBranch,
    title: 'Review and create a commit',
    description:
      'Choose the branch and update mode, confirm the ordered file tree, write a meaningful commit message, and push the project to GitHub as one organized change.',
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
];

const trustPoints = [
  {
    icon: Lock,
    title: 'Session-based credentials',
    description:
      'The GitHub token is entered for the current browser session. DropToGit is designed to avoid accounts, token databases, and long-lived credential storage.',
  },
  {
    icon: Shield,
    title: 'A visible workflow',
    description:
      'The tool shows the repository, file tree, update mode, branch, and commit message before the push. The goal is to make the important state understandable rather than hidden behind a single button.',
  },
  {
    icon: UserX,
    title: 'No command-line barrier',
    description:
      'DropToGit is useful for learners, designers, students, collaborators, and developers moving prototypes or generated builds who do not want to install and configure Git for every small delivery.',
  },
  {
    icon: ArrowRight,
    title: 'Built around GitHub commits',
    description:
      'The product is not a second code host. It is a focused bridge between a project folder on a computer and an organized commit in an existing GitHub repository.',
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
        <div className="space-y-12">
          <section className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
              <BookOpen className="h-3.5 w-3.5" />
              The story behind the tool
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              About <span className="text-primary">DropToGit</span>
            </h1>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                DropToGit is a browser-first project delivery tool built by{' '}
                <Link href="/about-me" className="font-medium text-primary hover:underline">
                  Bright Dumashie
                </Link>
                , an AI Data Reviewer, Multilingual Annotation Specialist, and Web Developer based in Accra, Ghana. Bright has more than four years of experience supporting data and AI operations, including annotation, rubric-based quality control, and evaluation of text, audio, video, and large-language-model outputs.
              </p>
              <p>
                The product began with a practical observation: moving a small project into GitHub can involve more setup than the project itself. A new contributor may need to install Git, understand a terminal workflow, configure credentials, learn repository commands, and then diagnose confusing errors before they have made their first useful commit. DropToGit reduces that first-mile friction without pretending that version control is unnecessary.
              </p>
              <p>
                Instead of cloning a repository manually or asking someone to copy files into a web editor, a user can connect a GitHub repository, drop a local folder or zip file, inspect the normalized folder tree, choose a branch and push mode, and create a commit from one guided workspace. This makes the tool especially useful for prototypes, coursework, generated websites, documentation projects, and collaborations where the person preparing the files is not the person who normally manages Git.
              </p>
              <p>
                Bright builds DropToGit as part of a wider interest in making technical tools more legible and accessible. His background in quality review influences the product’s emphasis on visible states, explicit destructive actions, readable progress, and a review step before publishing. The goal is not to replace Git for experienced teams; it is to make a safe, understandable path into GitHub available when a full local setup is unnecessary.
              </p>
            </div>
          </section>

          <section className="space-y-5">
            <div>
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">The workflow</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">From local folder to organized commit</h2>
              <p className="mt-2 max-w-2xl text-muted-foreground leading-relaxed">
                Each stage is deliberately visible so users can understand what will happen before the repository changes.
              </p>
            </div>
            <div className="grid gap-4">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <Card key={step.title} className="overflow-hidden border-border/80">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${step.bg}`}>
                          <Icon className={`h-5 w-5 ${step.color}`} />
                        </div>
                        <div>
                          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">0{index + 1}</p>
                          <CardTitle className="text-base">{step.title}</CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="pl-13 text-sm leading-6 text-muted-foreground">{step.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          <section className="space-y-5">
            <div>
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">Design principles</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">Why the product is built this way</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {trustPoints.map((point) => {
                const Icon = point.icon;
                return (
                  <Card key={point.title} className="border-border/80">
                    <CardContent className="space-y-3 pt-5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <h3 className="text-sm font-semibold">{point.title}</h3>
                      <p className="text-sm leading-6 text-muted-foreground">{point.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24">
          <Card className="border-border/80 bg-card/70">
            <CardContent className="space-y-4 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Terminal className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold">A focused bridge, not a replacement for Git</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Use DropToGit when you need a clear browser workflow for a project folder. Use local Git when you need branching, rebasing, history inspection, hooks, or a full team development environment.
                </p>
              </div>
              <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
                Open the tool <ArrowRight className="h-4 w-4" />
              </Link>
            </CardContent>
          </Card>
          <div className="rounded-2xl border border-border/70 bg-muted/25 p-5">
            <p className="text-sm font-semibold">Built and maintained independently</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">DropToGit is one of Bright Dumashie’s practical web projects, alongside work in AI data quality, LLM evaluation, and accessible developer tooling.</p>
            <Link href="/about-me" className="mt-4 inline-flex text-sm font-medium text-primary hover:underline">Read the creator profile →</Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
