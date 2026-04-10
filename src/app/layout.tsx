import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "IdeaForge — Discover SaaS ideas from Reddit",
  description: "AI-scored product ideas extracted from Reddit pain points. Built for indie hackers and solo founders.",
  icons: {
    icon: "/ideaforge-icon.svg",
    apple: "/ideaforge-icon.svg",
  },
};

// FOUC prevention — must run before first paint.
// Storage key must match STORAGE_KEY in src/hooks/useTheme.ts
const themeInitScript = `(function(){try{var t=localStorage.getItem('ideaforge-theme');var d=t==='dark'||(t!=='light'&&matchMedia('(prefers-color-scheme:dark)').matches);if(d)document.documentElement.classList.add('dark')}catch(e){}})()`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${inter.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col bg-surface-base">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
