import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { Toaster } from "sonner";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  preload: false,
});

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://droptogit.vercel.app/#organization',
      name: 'DropToGit',
      url: 'https://droptogit.vercel.app/',
      logo: {
        '@type': 'ImageObject',
        url: 'https://droptogit.vercel.app/logo-mark.svg',
      },
      founder: {
        '@type': 'Person',
        name: 'Bright Dumashie',
        url: 'https://droptogit.vercel.app/about-me',
      },
      sameAs: [
        'https://github.com/Brivian2002/DropToGit',
        'https://www.linkedin.com/in/brightdumashie',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': 'https://droptogit.vercel.app/#website',
      name: 'DropToGit',
      url: 'https://droptogit.vercel.app/',
      publisher: { '@id': 'https://droptogit.vercel.app/#organization' },
    },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL('https://droptogit.vercel.app'),
  applicationName: 'DropToGit',
  category: 'technology',
  title: {
    default: "DropToGit — Ship projects to GitHub without the terminal",
    template: "%s — DropToGit",
  },
  description:
    "Move a local project folder into a clean GitHub commit from the browser. No CLI, no local setup, no credential storage.",
  keywords: [
    "GitHub",
    "Git",
    "upload",
    "drag and drop",
    "deploy",
    "developer tool",
    "DropToGit",
  ],
  authors: [{ name: "Bright Dumashie" }],
  creator: "Bright Dumashie",
  publisher: 'Bright Dumashie',
  alternates: {
    canonical: '/',
  },
  verification: {
    google: "rFXCJfN2PKInkfgkJx2gD9GTfN27-evXzaTyxQG2zGk",
  },
  other: {
    "google-adsense-account": "ca-pub-7744791430316817",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/logo-mark.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    title: "DropToGit — Ship projects to GitHub without the terminal",
    description:
      "Move a local project folder into a clean GitHub commit from the browser.",
    type: "website",
    siteName: "DropToGit",
    url: "https://droptogit.vercel.app/",
    images: [
      {
        url: "/logo.svg",
        width: 440,
        height: 128,
        alt: "DropToGit official visual logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DropToGit",
    description:
      "Browser-first project delivery for GitHub.",
    images: ["/logo.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster richColors position="bottom-right" />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
