import type { Metadata } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Providers } from "@/providers/query-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Harry Potter Explorer",
    template: "%s · Harry Potter Explorer",
  },
  description:
    "Explore the characters, houses, and spells of the Wizarding World.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <head>
        {/*
          Set the theme class before first paint so the page never flashes
          the wrong theme. Matches the logic in theme-provider.tsx.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem("theme")!=="light")document.documentElement.classList.add("dark")}catch(e){}`,
          }}
        />
      </head>
      <body className="flex min-h-full flex-col">
        {/*
          DESIGN DIRECTION — Harry Potter Explorer
          THESIS: a modern editorial explorer of the Wizarding World; refuses
          fan-site decor and generic dashboard chrome.
          OWN-WORLD: warm parchment ground, deep ink text, brass/gold accents
          at small scale; Fraunces serif for display, Geist sans for body;
          hairline borders, subtle elevation, generous editorial spacing.
          FORM: brief-pinned direction (restrained magical editorial);
          executed at take-home scope; house colors live in character UI only.
          FINISH: validated by lint, tsc, production build, and viewport check.
        */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-foreground focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-background"
        >
          Skip to content
        </a>
        {/* Warm brand glow, same as the home hero — sits behind the page
            content. Invisible on / (the opaque hero covers it). */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,var(--accent),transparent_70%)] opacity-25 mix-blend-screen"
        />
        <Providers>
          <Navbar />
          {/* `relative` keeps the content above the fixed glow. */}
          <main id="main" className="relative flex flex-1 flex-col">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
