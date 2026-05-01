/**
 * Root layout — diterapkan ke semua halaman
 * Berisi Navbar, Footer, dan pengaturan font global
 */

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "XRay AI — Chest X-Ray Analysis System",
  description:
    "Sistem analisis X-ray dada berbasis kecerdasan buatan untuk deteksi multi-label penyakit paru-paru.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
      </head>
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        {/* ===== NAVBAR ===== */}
        <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-3 group">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-md group-hover:shadow-sky-300/50 transition-all duration-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5"
                  >
                    <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6 6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
                    <path d="M8 15v1a6 6 0 0 0 6 6 6 6 0 0 0 6-6v-4" />
                    <circle cx="20" cy="10" r="2" />
                  </svg>
                </div>
                <div>
                  <div className="text-base font-800 text-slate-900 leading-tight group-hover:text-sky-600 transition-colors">
                    XRay<span className="text-sky-500"> AI</span>
                  </div>
                  <div className="text-xs text-slate-500 font-400 leading-none">
                    Chest X-Ray Analysis System
                  </div>
                </div>
              </Link>

              {/* Nav links */}
              <nav className="flex items-center gap-2">
                <Link
                  href="/"
                  className="px-4 py-2 text-sm font-500 text-slate-600 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all"
                >
                  Upload
                </Link>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-600 bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-soft" />
                  Research Tool
                </span>
              </nav>
            </div>
          </div>
        </header>

        {/* ===== MAIN CONTENT ===== */}
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
