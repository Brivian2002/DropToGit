import Link from "next/link";
import { Github } from "lucide-react";
import { LogoMark } from "@/components/droptogit/Logo";

const FOOTER_LINKS = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "About", href: "/about" },
  { label: "About Me", href: "/about-me" },
  { label: "Contact", href: "/contact" },
] as const;

export function SiteFooter() {
  return <SiteFooterInner />;
}

export default SiteFooter;

function SiteFooterInner() {
  return (
    <footer className="mt-auto border-t bg-background/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
        {/* Row 1: brand mark + tagline */}
        <div className="flex items-center gap-2">
          <LogoMark size={20} />
          <span>
            DropToGit &mdash; stateless, secure, open source.
          </span>
        </div>

        {/* Row 2: footer links */}
        <ul className="flex flex-wrap items-center gap-x-4 gap-y-1">
          {FOOTER_LINKS.map(({ label, href }) => (
            <li key={href}>
              <Link
                href={href}
                className="transition-colors hover:text-foreground"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Row 3: GitHub + copyright */}
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/Brivian2002/droptogit"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
            aria-label="DropToGit GitHub repository"
          >
            <Github className="h-3.5 w-3.5" />
            GitHub
          </a>
          <span className="text-muted-foreground/60">&copy; 2025 Bright Dumashie</span>
        </div>
      </div>
    </footer>
  );
}
