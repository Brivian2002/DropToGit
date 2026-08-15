import type { Metadata } from "next";
import SiteNav from "@/components/layout/SiteNav";
import SiteFooter from "@/components/layout/SiteFooter";

export const metadata: Metadata = {
  title: "Terms of Service — DropToGit",
};

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteNav />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-10 sm:py-16">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Terms of <span className="text-gradient-green">Service</span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Last updated: June 2025
          </p>

          <div className="mt-10 space-y-10">
            {/* 1. Acceptance */}
            <section>
              <h2 className="text-xl font-semibold tracking-tight">
                1. Acceptance of Terms
              </h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                By accessing or using DropToGit (&ldquo;the Service&rdquo;) at
                droptogit.vercel.app, you agree to be bound by these Terms of
                Service. If you do not agree, please do not use the Service.
              </p>
            </section>

            {/* 2. Description */}
            <section>
              <h2 className="text-xl font-semibold tracking-tight">
                2. Description of Service
              </h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                DropToGit is a browser-based tool that allows users to upload
                project files directly to GitHub repositories via
                GitHub&rsquo;s Data API. The Service does not require Git
                installation or command-line usage.
              </p>
            </section>

            {/* 3. User Responsibilities */}
            <section>
              <h2 className="text-xl font-semibold tracking-tight">
                3. User Responsibilities
              </h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                You are solely responsible for:
              </p>
              <ul className="mt-2 list-disc space-y-2 pl-6 leading-relaxed text-muted-foreground">
                <li>
                  The security of your GitHub Personal Access Token (PAT). You
                  should create a fine-grained token with minimal required
                  permissions and revoke it when no longer needed.
                </li>
                <li>
                  Ensuring you have the right to upload the files and content
                  you submit through the Service.
                </li>
                <li>
                  Verifying that your use of GitHub&rsquo;s API complies with
                  GitHub&rsquo;s Terms of Service.
                </li>
                <li>
                  The consequences of using the &ldquo;Replace All&rdquo; mode,
                  which deletes all existing files in the target repository
                  before uploading new ones.
                </li>
              </ul>
            </section>

            {/* 4. Intellectual Property */}
            <section>
              <h2 className="text-xl font-semibold tracking-tight">
                4. Intellectual Property
              </h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                You retain all rights to the files and content you upload. The
                DropToGit name, logo, and the Service itself are the intellectual
                property of Bright Dumashie. You may not copy, modify, or
                redistribute the Service without permission.
              </p>
            </section>

            {/* 5. No Warranty */}
            <section>
              <h2 className="text-xl font-semibold tracking-tight">
                5. Disclaimer of Warranties
              </h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                The Service is provided &ldquo;as is&rdquo; and &ldquo;as
                available&rdquo; without warranties of any kind, either express
                or implied, including but not limited to implied warranties of
                merchantability, fitness for a particular purpose, and
                non-infringement. We do not warrant that the Service will be
                uninterrupted, error-free, or secure.
              </p>
            </section>

            {/* 6. Limitation of Liability */}
            <section>
              <h2 className="text-xl font-semibold tracking-tight">
                6. Limitation of Liability
              </h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                In no event shall DropToGit, its creator, or contributors be
                liable for any direct, indirect, incidental, special,
                consequential, or punitive damages arising out of or related to
                your use of the Service, including but not limited to loss of
                data, loss of profits, or damage to your GitHub repositories.
                Using the &ldquo;Replace All&rdquo; feature is irreversible and
                you assume full responsibility for its use.
              </p>
            </section>

            {/* 7. Rate Limits and API Usage */}
            <section>
              <h2 className="text-xl font-semibold tracking-tight">
                7. Rate Limits and API Usage
              </h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                The Service is subject to GitHub&rsquo;s API rate limits. We are
                not responsible for errors or failures caused by rate limiting,
                API outages, or changes to GitHub&rsquo;s API. We may also
                implement our own usage limits to ensure fair use of the Service.
              </p>
            </section>

            {/* 8. Prohibited Uses */}
            <section>
              <h2 className="text-xl font-semibold tracking-tight">
                8. Prohibited Uses
              </h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                You agree not to:
              </p>
              <ul className="mt-2 list-disc space-y-2 pl-6 leading-relaxed text-muted-foreground">
                <li>
                  Use the Service to upload malicious code, malware, or content
                  that violates any law or third-party rights.
                </li>
                <li>
                  Attempt to reverse-engineer, hack, or disrupt the Service.
                </li>
                <li>
                  Use the Service in a way that exceeds GitHub&rsquo;s rate
                  limits or Terms of Service.
                </li>
                <li>
                  Misrepresent the source or authorship of uploaded content.
                </li>
              </ul>
            </section>

            {/* 9. Termination */}
            <section>
              <h2 className="text-xl font-semibold tracking-tight">
                9. Termination
              </h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                We reserve the right to terminate or suspend access to the
                Service at any time, without notice, for conduct that we believe
                violates these Terms or is harmful to other users or the Service.
              </p>
            </section>

            {/* 10. Changes */}
            <section>
              <h2 className="text-xl font-semibold tracking-tight">
                10. Changes to Terms
              </h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                We may update these Terms of Service from time to time. Changes
                will be posted on this page with an updated &ldquo;Last
                updated&rdquo; date. Continued use after changes constitutes
                acceptance.
              </p>
            </section>

            {/* 11. Governing Law */}
            <section>
              <h2 className="text-xl font-semibold tracking-tight">
                11. Governing Law
              </h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                These Terms shall be governed by and construed in accordance
                with the laws of Ghana. Any disputes shall be resolved in the
                courts of Accra, Ghana.
              </p>
            </section>

            {/* 12. Contact */}
            <section>
              <h2 className="text-xl font-semibold tracking-tight">
                12. Contact
              </h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                If you have questions about these Terms, contact us at{" "}
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
