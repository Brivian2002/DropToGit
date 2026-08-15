import type { Metadata } from "next";
import SiteNav from "@/components/layout/SiteNav";
import SiteFooter from "@/components/layout/SiteFooter";

export const metadata: Metadata = {
  title: "Privacy Policy — DropToGit",
};

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteNav />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-10 sm:py-16">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Privacy <span className="text-gradient-green">Policy</span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Last updated: June 2025
          </p>

          <div className="mt-10 space-y-10">
            {/* 1. Overview */}
            <section>
              <h2 className="text-xl font-semibold tracking-tight">
                1. Overview
              </h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                This Privacy Policy describes how DropToGit (&ldquo;we&rdquo;,
                &ldquo;us&rdquo;, or &ldquo;our&rdquo;) handles your information
                when you use our website and service at droptogit.vercel.app
                (the &ldquo;Service&rdquo;). We are committed to minimal data
                collection and maximum transparency.
              </p>
            </section>

            {/* 2. Information We Collect */}
            <section>
              <h2 className="text-xl font-semibold tracking-tight">
                2. Information We Collect
              </h2>

              <h3 className="mt-4 text-base font-medium">
                2.1 Information You Provide
              </h3>
              <ul className="mt-2 list-disc space-y-2 pl-6 leading-relaxed text-muted-foreground">
                <li>
                  <strong className="text-foreground">
                    GitHub Personal Access Token (PAT)
                  </strong>
                  : Entered by you in the browser session to authenticate with
                  GitHub&rsquo;s API. This token is{" "}
                  <strong className="text-foreground">
                    never stored, logged, or persisted
                  </strong>{" "}
                  on our servers. It is used only for the duration of the active
                  session and transmitted directly to GitHub&rsquo;s API over
                  HTTPS.
                </li>
                <li>
                  <strong className="text-foreground">
                    Project Files
                  </strong>
                  : Files you drag and drop into the browser. These are read
                  entirely in your browser and uploaded directly from your
                  device to GitHub&rsquo;s API. They are not stored on or
                  processed by our servers.
                </li>
                <li>
                  <strong className="text-foreground">
                    Repository Information
                  </strong>
                  : Repository owner and name you select. This is used only to
                  route your files to the correct GitHub repository.
                </li>
              </ul>

              <h3 className="mt-6 text-base font-medium">
                2.2 Automatically Collected Information
              </h3>
              <ul className="mt-2 list-disc space-y-2 pl-6 leading-relaxed text-muted-foreground">
                <li>
                  <strong className="text-foreground">
                    Analytics Data
                  </strong>
                  : We may use privacy-respecting analytics (such as Vercel
                  Analytics) to understand general usage patterns — pages
                  visited, device type, and approximate location. This data is
                  aggregated and does not identify you personally.
                </li>
              </ul>
            </section>

            {/* 3. How We Use Information */}
            <section>
              <h2 className="text-xl font-semibold tracking-tight">
                3. How We Use Information
              </h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                The information described above is used solely to provide and
                improve the DropToGit service. Specifically:
              </p>
              <ul className="mt-2 list-disc space-y-2 pl-6 leading-relaxed text-muted-foreground">
                <li>Your PAT is used to authenticate API requests to GitHub.</li>
                <li>
                  Project files are uploaded to your chosen GitHub repository.
                </li>
                <li>
                  Analytics data helps us understand usage and improve the
                  product.
                </li>
              </ul>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                We do <strong className="text-foreground">not</strong> sell,
                rent, or share your information with third parties for marketing
                purposes.
              </p>
            </section>

            {/* 4. Data Storage and Security */}
            <section>
              <h2 className="text-xl font-semibold tracking-tight">
                4. Data Storage and Security
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-6 leading-relaxed text-muted-foreground">
                <li>
                  <strong className="text-foreground">
                    No server-side token storage
                  </strong>
                  : Your GitHub PAT is never written to a database, file, or log
                  on our infrastructure. It exists only in browser memory during
                  the session.
                </li>
                <li>
                  <strong className="text-foreground">
                    No file storage on our servers
                  </strong>
                  : Your project files are streamed directly from your browser to
                  GitHub. We never store, cache, or inspect the contents of your
                  files.
                </li>
                <li>
                  <strong className="text-foreground">
                    HTTPS everywhere
                  </strong>
                  : All communication between your browser, our service, and
                  GitHub is encrypted via HTTPS.
                </li>
              </ul>
            </section>

            {/* 5. Third-Party Services */}
            <section>
              <h2 className="text-xl font-semibold tracking-tight">
                5. Third-Party Services
              </h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                DropToGit interacts with the following third-party services:
              </p>
              <ul className="mt-2 list-disc space-y-2 pl-6 leading-relaxed text-muted-foreground">
                <li>
                  <strong className="text-foreground">GitHub API</strong>: To
                  create blobs, tree objects, and commits on your behalf. GitHub
                  has its own privacy policy at github.com/privacy.
                </li>
                <li>
                  <strong className="text-foreground">
                    Vercel (hosting)
                  </strong>
                  : Our site is hosted on Vercel. See vercel.com/privacy for
                  their policy.
                </li>
              </ul>
            </section>

            {/* 6. Cookies and Tracking */}
            <section>
              <h2 className="text-xl font-semibold tracking-tight">
                6. Cookies and Tracking
              </h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                DropToGit uses minimal cookies. We may set a single cookie for
                theme preference (light/dark mode). We do not use advertising
                cookies, tracking pixels, or third-party tracking scripts beyond
                Vercel Analytics.
              </p>
            </section>

            {/* 7. Your Rights */}
            <section>
              <h2 className="text-xl font-semibold tracking-tight">
                7. Your Rights
              </h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                Since we do not store personal data on our servers, there is
                minimal data to access or delete. However, you have the right
                to:
              </p>
              <ul className="mt-2 list-disc space-y-2 pl-6 leading-relaxed text-muted-foreground">
                <li>
                  Request information about any data we may hold about you.
                </li>
                <li>Request deletion of any such data.</li>
                <li>
                  Revoke your GitHub PAT at any time through your GitHub
                  Settings.
                </li>
              </ul>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                To exercise these rights, contact us at{" "}
                <a
                  href="mailto:brightsany3000@gmail.com"
                  className="font-medium text-brand-green underline-offset-4 hover:underline"
                >
                  brightsany3000@gmail.com
                </a>
                .
              </p>
            </section>

            {/* 8. Children's Privacy */}
            <section>
              <h2 className="text-xl font-semibold tracking-tight">
                8. Children&rsquo;s Privacy
              </h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                Our service is not directed at children under 13. We do not
                knowingly collect personal information from children. If you
                believe we have collected such information, please contact us
                and we will promptly delete it.
              </p>
            </section>

            {/* 9. Changes to This Policy */}
            <section>
              <h2 className="text-xl font-semibold tracking-tight">
                9. Changes to This Policy
              </h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                We may update this Privacy Policy from time to time. Changes
                will be posted on this page with an updated &ldquo;Last
                updated&rdquo; date. Continued use of the Service after changes
                constitutes acceptance of the updated policy.
              </p>
            </section>

            {/* 10. Contact */}
            <section>
              <h2 className="text-xl font-semibold tracking-tight">
                10. Contact
              </h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                If you have questions about this Privacy Policy, contact us at{" "}
                <a
                  href="mailto:brightsany3000@gmail.com"
                  className="font-medium text-brand-green underline-offset-4 hover:underline"
                >
                  brightsany3000@gmail.com
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
