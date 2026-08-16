import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Github, Linkedin, Mail, MessageSquare, Phone } from 'lucide-react';

export const metadata = { title: 'Contact' };

const contactMethods = [
  {
    icon: Mail,
    label: 'Email',
    value: 'brightsany3000@gmail.com',
    href: 'mailto:brightsany3000@gmail.com',
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+233-535-3434-90',
    href: 'tel:+233535343490',
    color: 'text-sky-accent',
    bg: 'bg-sky-accent/10',
  },
  {
    icon: Linkedin,
    label: 'LinkedIn',
    value: 'linkedin.com/in/brightdumashie',
    href: 'https://linkedin.com/in/brightdumashie',
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
];

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_19rem] lg:items-start">
        <div className="space-y-8">
          <section className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
              <MessageSquare className="h-3.5 w-3.5" />
              Start a conversation
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Get in touch</h1>
            <div className="space-y-3 text-muted-foreground leading-relaxed">
              <p>
                Contact Bright about DropToGit feedback, a confusing GitHub workflow, accessibility improvements, collaboration ideas, or questions about the project’s direction. If the tool helped you move a project into GitHub, hearing what worked and what felt unclear is especially useful.
              </p>
              <p>
                Email is the best channel for a detailed question. I aim to respond within a few business days, depending on the request and time zone. For reproducible bugs and feature proposals, a GitHub issue is usually the fastest way to keep the discussion attached to the relevant code.
              </p>
            </div>
          </section>

          <section className="grid gap-4 sm:grid-cols-3">
            {contactMethods.map((method) => {
              const Icon = method.icon;
              return (
                <Card key={method.label} className="border-border/80">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${method.bg}`}>
                        <Icon className={`h-4 w-4 ${method.color}`} />
                      </div>
                      <CardTitle className="text-base">{method.label}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <a
                      href={method.href}
                      target={method.href.startsWith('http') ? '_blank' : undefined}
                      rel={method.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className={`break-all text-sm ${method.color} hover:underline`}
                    >
                      {method.value}
                    </a>
                  </CardContent>
                </Card>
              );
            })}
          </section>

          <Card className="border-border/80 bg-card/70">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-foreground">
                  <Github className="h-4 w-4" />
                </div>
                <div>
                  <CardTitle className="text-base">Technical feedback</CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">Keep product issues close to the code.</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
              <p>
                Open an issue for bugs, feature requests, documentation corrections, or repository workflow problems. Include the page or workflow step, what you expected, what happened instead, and any safe-to-share error message.
              </p>
              <a
                href="https://github.com/Brivian2002/DropToGit/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-medium text-primary hover:underline"
              >
                Open the DropToGit issue tracker <span aria-hidden="true">→</span>
              </a>
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24">
          <Card className="border-border/80">
            <CardContent className="space-y-4 p-5">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">What to include</p>
              <ul className="space-y-3 text-sm leading-6 text-muted-foreground">
                <li><strong className="text-foreground">Context:</strong> what you were trying to upload or publish.</li>
                <li><strong className="text-foreground">Steps:</strong> where the workflow stopped or became confusing.</li>
                <li><strong className="text-foreground">Evidence:</strong> the non-sensitive error text or a screenshot.</li>
                <li><strong className="text-foreground">Goal:</strong> what a successful result would look like.</li>
              </ul>
            </CardContent>
          </Card>
          <div className="rounded-2xl border border-primary/15 bg-primary/5 p-5 text-sm leading-6 text-muted-foreground">
            Please do not send GitHub tokens, Blogger API keys, passwords, or other secrets in an email, issue, or screenshot.
          </div>
        </aside>
      </div>
    </div>
  );
}
