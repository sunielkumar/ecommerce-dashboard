import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";
import { getSiteUrlObject } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: getSiteUrlObject(),
  title: {
    default: "CommerceHub Dashboard",
    template: "%s | CommerceHub Dashboard",
  },
  description:
    "A production-ready e-commerce dashboard built with Next.js, TypeScript, SSR, Redux, and the Fake Store API.",
  keywords: [
    "Next.js",
    "TypeScript",
    "SSR",
    "Redux",
    "E-commerce dashboard",
    "Fake Store API",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-slate-50 font-sans text-slate-900 antialiased`}
      >
        <Providers>
          <div className="min-h-screen">
            <Navbar />
            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
