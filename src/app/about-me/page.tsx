import type { Metadata } from "next";
import { Mail, Phone, Linkedin, MapPin } from "lucide-react";
import SiteNav from "@/components/layout/SiteNav";
import SiteFooter from "@/components/layout/SiteFooter";

export const metadata: Metadata = {
  title: "About the Creator — DropToGit",
};

export default function AboutMePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteNav />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-10 sm:py-16">
          <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start">
            {/* Avatar */}
            <div className="flex h-[120px] w-[120px] shrink-0 items-center justify-center rounded-full bg-brand-green text-2xl font-bold text-primary-foreground">
              BD
            </div>

            {/* Info */}
            <div className="text-center sm:text-left">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Bright Dumashie
              </h1>
              <p className="mt-1 text-base font-medium text-brand-green">
                AI Data Reviewer · LLM Evaluator · Web Developer
              </p>
              <p className="mt-2 flex items-center justify-center gap-1.5 text-sm text-muted-foreground sm:justify-start">
                <MapPin className="h-4 w-4" />
                Accra, Ghana
              </p>
            </div>
          </div>

          {/* Bio */}
          <div className="mt-10 space-y-4">
            <p className="leading-relaxed text-muted-foreground">
              Bright is an AI Data Reviewer and Multilingual Annotation Specialist
              with 4+ years of experience supporting AI and data operations —
              annotation, rubric-based evaluation, and quality control across text,
              audio, and video modalities, including LLM output evaluation.
            </p>
            <p className="leading-relaxed text-muted-foreground">
              He&rsquo;s a certified micro1 Data Labeler and also builds web tools,
              including{" "}
              <span className="font-semibold text-foreground">DropToGit</span>{" "}
              and{" "}
              <a
                href="https://speedtestplus.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-brand-green underline-offset-4 hover:underline"
              >
                speedtestplus.vercel.app
              </a>
              .
            </p>
          </div>

          {/* Contact Section */}
          <div className="mt-12">
            <h2 className="text-xl font-semibold tracking-tight">Contact</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {/* Email */}
              <a
                href="mailto:brightsany3000@gmail.com"
                className="group flex items-center gap-3 rounded-xl border bg-card p-4 transition-colors hover:bg-muted/50"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-green-soft">
                  <Mail className="h-5 w-5 text-brand-green" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-muted-foreground">
                    Email
                  </p>
                  <p className="truncate text-sm font-medium">
                    brightsany3000@gmail.com
                  </p>
                </div>
              </a>

              {/* Phone */}
              <a
                href="tel:+233535343490"
                className="group flex items-center gap-3 rounded-xl border bg-card p-4 transition-colors hover:bg-muted/50"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-green-soft">
                  <Phone className="h-5 w-5 text-brand-green" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-muted-foreground">
                    Phone
                  </p>
                  <p className="text-sm font-medium">+233-535-3434-90</p>
                </div>
              </a>

              {/* LinkedIn */}
              <a
                href="https://linkedin.com/in/brightdumashie"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 rounded-xl border bg-card p-4 transition-colors hover:bg-muted/50"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-green-soft">
                  <Linkedin className="h-5 w-5 text-brand-green" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-muted-foreground">
                    LinkedIn
                  </p>
                  <p className="truncate text-sm font-medium">
                    brightdumashie
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