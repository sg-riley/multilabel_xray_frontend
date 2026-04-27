/**
 * Root layout — diterapkan ke semua halaman
 * Berisi Navbar, Footer, dan pengaturan font global
 */

import type { Metadata } from "next";
import "./globals.css";

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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex flex-col min-h-screen">
        {/* ===== NAVBAR ===== */}
        <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <a href="/" className="flex items-center gap-3 group">
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
              </a>

              {/* Nav links */}
              <nav className="flex items-center gap-2">
                <a
                  href="/"
                  className="px-4 py-2 text-sm font-500 text-slate-600 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all"
                >
                  Upload
                </a>
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

        {/* ===== FOOTER ===== */}
        <footer className="bg-slate-900 text-slate-400 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4"
                  >
                    <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6 6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
                    <path d="M8 15v1a6 6 0 0 0 6 6 6 6 0 0 0 6-6v-4" />
                    <circle cx="20" cy="10" r="2" />
                  </svg>
                </div>
                <span className="text-sm font-600 text-slate-300">XRay AI</span>
              </div>

              <div className="flex items-start gap-2 text-center md:text-right max-w-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4 text-amber-400 mt-0.5 shrink-0"
                >
                  <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                  <path d="M12 9v4" />
                  <circle cx="12" cy="17" r="1" />
                </svg>
                <p className="text-xs leading-relaxed text-slate-400 italic">
                  This tool is for research purposes only. Not a substitute for
                  professional medical diagnosis. Always consult a qualified
                  healthcare provider for medical advice.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-800 text-center text-xs text-slate-600">
              © {new Date().getFullYear()} XRay AI — Multi-Label Chest X-Ray
              Classification System
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
