"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { LogoMark } from "@/components/droptogit/Logo";
import { ThemeToggle } from "@/components/droptogit/ThemeToggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Tool", href: "/" },
  { label: "Docs", href: "/docs" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Donate", href: "/donate" },
] as const;

export function SiteNav() {
  return <SiteNavInner />;
}

export default SiteNav;

function SiteNavInner() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo — left */}
        <Link href="/" className="flex items-center gap-2">
          <LogoMark size={30} />
          <span className="text-lg font-bold tracking-tight">
            Drop<span className="text-gradient-green">ToGit</span>
          </span>
        </Link>

        {/* Desktop links — center-right */}
        <ul className="hidden items-center gap-1 sm:flex">
          {NAV_LINKS.map(({ label, href }) => {
            const active =
              href === "/"
                ? pathname === "/"
                : pathname.startsWith(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    "relative rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                    active
                      ? "text-brand-green"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {label}
                  {active && (
                    <span className="absolute inset-x-1 -bottom-px h-0.5 rounded-full bg-brand-green" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Right section: theme toggle + mobile menu */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          {/* Mobile hamburger */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="sm:hidden"
                aria-label="Open navigation menu"
              >
                <Menu className="h-[1.15rem] w-[1.15rem]" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-64">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <LogoMark size={22} />
                  <span className="text-gradient-green">DropToGit</span>
                </SheetTitle>
              </SheetHeader>

              <ul className="mt-4 flex flex-col gap-1 px-4">
                {NAV_LINKS.map(({ label, href }) => {
                  const active =
                    href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(href);
                  return (
                    <li key={href}>
                      <Link
                        href={href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "block rounded-md px-3 py-2 text-sm font-medium transition-colors",
                          active
                            ? "bg-brand-green/10 text-brand-green"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                      >
                        {label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
