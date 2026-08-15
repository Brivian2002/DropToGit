import type { Metadata } from "next";
import { Mail, Phone, Linkedin, Github } from "lucide-react";
import SiteNav from "@/components/layout/SiteNav";
import SiteFooter from "@/components/layout/SiteFooter";

export const metadata: Metadata = {
  title: "Contact — DropToGit",
};

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteNav />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-10 sm:py-16">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Get in <span className="text-gradient-green">Touch</span>
          </h1>
          <p className="mt-2 text-muted-foreground">
            Have a question, suggestion, or just want to say hello? Reach out
            through any of the channels below.
          </p>

          <div className="mt-10 space-y-4">
            {/* Email — Large Card */}
            <a
              href="mailto:brightsany3000@gmail.com"
              className="group flex items-center gap-5 rounded-xl border bg-card p-6 transition-colors hover:bg-muted/50 sm:p-8"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-green-soft">
                <Mail className="h-7 w-7 text-brand-green" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Email
                </p>
                <p className="mt-1 text-lg font-semibold">
                  brightsany3000@gmail.com
                </p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  Preferred — responds within 24 hours
                </p>
              </div>
            </a>

            {/* Phone */}
            <a
              href="tel:+233535343490"
              className="group flex items-center gap-5 rounded-xl border bg-card p-6 transition-colors hover:bg-muted/50"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-green-soft">
                <Phone className="h-6 w-6 text-brand-green" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Phone
                </p>
                <p className="mt-1 text-base font-semibold">
                  +233-535-3434-90
                </p>
              </div>
            </a>

            {/* LinkedIn & GitHub side by side on desktop */}
            <div className="grid gap-4 sm:grid-cols-2">
              <a
                href="https://linkedin.com/in/brightdumashie"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 rounded-xl border bg-card p-6 transition-colors hover:bg-muted/50"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-green-soft">
                  <Linkedin className="h-6 w-6 text-brand-green" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    LinkedIn
                  </p>
                  <p className="mt-1 text-base font-semibold">
                    brightdumashie
                  </p>
                </div>
              </a>

              <a
                href="https://github.com/Brivian2002/droptogit"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 rounded-xl border bg-card p-6 transition-colors hover:bg-muted/50"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-green-soft">
                  <Github className="h-6 w-6 text-brand-green" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    GitHub
                  </p>
                  <p className="mt-1 truncate text-base font-semibold">
                    Brivian2002/droptogit
                  </p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}