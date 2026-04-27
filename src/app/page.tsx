"use client";

/**
 * Halaman Upload (/) — Halaman utama untuk upload gambar X-ray
 * Menampilkan hero section, upload zone, dan progress overlay selama analisis
 */

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import UploadZone from "@/components/UploadZone";
import ProgressOverlay from "@/components/ProgressOverlay";
import { analyzeImage } from "@/lib/api";

export default function HomePage() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleFileSelect = useCallback((file: File) => {
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 5000);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    setIsLoading(true);
    try {
      const result = await analyzeImage(selectedFile);
      sessionStorage.setItem("xray_result", JSON.stringify(result));
      router.push("/results");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan tidak diketahui.";
      showToast(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ProgressOverlay visible={isLoading} />

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 flex items-start gap-3 bg-red-600 text-white px-5 py-4 rounded-xl shadow-xl max-w-sm animate-slide-in-right">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 shrink-0 mt-0.5">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" x2="12" y1="8" y2="12" />
            <line x1="12" x2="12.01" y1="16" y2="16" />
          </svg>
          <div>
            <p className="font-600 text-sm">Analisis Gagal</p>
            <p className="text-xs text-red-100 mt-0.5">{toastMsg}</p>
          </div>
          <button onClick={() => setToastMsg(null)} className="ml-auto text-red-200 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <line x1="18" x2="6" y1="6" y2="18" /><line x1="6" x2="18" y1="6" y2="18" />
            </svg>
          </button>
        </div>
      )}

      <div className="min-h-[calc(100vh-64px-120px)]">
        {/* ===== HERO SECTION ===== */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
          {/* Background decorations */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-900/20 rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
            <div className="max-w-3xl mx-auto text-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-sm font-500 mb-6">
                <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse-soft" />
                Powered by Deep Learning &amp; LLM
              </div>

              <h1 className="text-4xl lg:text-5xl font-800 leading-tight mb-6">
                Analisis{" "}
                <span className="gradient-text">X-Ray Dada</span>
                <br />
                dengan Kecerdasan Buatan
              </h1>

              <p className="text-lg text-slate-300 leading-relaxed mb-8 max-w-2xl mx-auto">
                Sistem klasifikasi multi-label berbasis AI untuk mendeteksi 8 kondisi
                paru-paru sekaligus — termasuk Atelektasis, Efusi, Fibrosis, dan lainnya —
                dilengkapi dengan peta aktivasi GradCAM dan laporan medis otomatis.
              </p>

              {/* Feature pills */}
              <div className="flex flex-wrap justify-center gap-3 mb-10">
                {[
                  { icon: "🫁", text: "8 Label Penyakit" },
                  { icon: "🔬", text: "GradCAM Visualization" },
                  { icon: "📋", text: "AI Medical Report" },
                  { icon: "⚡", text: "Real-time Analysis" },
                ].map((f) => (
                  <span
                    key={f.text}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-slate-300"
                  >
                    <span>{f.icon}</span>
                    {f.text}
                  </span>
                ))}
              </div>

              {/* Scroll cue */}
              <div className="flex items-center justify-center gap-2 text-slate-500 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 animate-bounce">
                  <line x1="12" x2="12" y1="5" y2="19" /><polyline points="19 12 12 19 5 12" />
                </svg>
                Upload gambar untuk memulai
              </div>
            </div>
          </div>
        </section>

        {/* ===== UPLOAD SECTION ===== */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-700 text-slate-800 mb-2">
                Upload Gambar X-Ray
              </h2>
              <p className="text-slate-500 text-sm">
                Upload gambar chest X-ray dalam format PNG atau JPEG (maks. 10MB)
              </p>
            </div>

            <UploadZone
              onFileSelect={handleFileSelect}
              onAnalyze={handleAnalyze}
              isLoading={isLoading}
              selectedFile={selectedFile}
              preview={preview}
            />

            {/* Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12">
              {[
                {
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-sky-600">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  ),
                  title: "Keamanan Data",
                  desc: "Gambar diproses secara lokal dan tidak disimpan di server.",
                },
                {
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-emerald-600">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  ),
                  title: "Waktu Proses",
                  desc: "Analisis membutuhkan waktu 8–15 detik tergantung ukuran file.",
                },
                {
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-amber-600">
                      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                      <path d="M12 9v4" /><circle cx="12" cy="17" r="1" />
                    </svg>
                  ),
                  title: "Disclaimer",
                  desc: "Hasil bukan diagnosis medis. Konsultasikan ke dokter.",
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className="flex items-start gap-3 p-4 rounded-xl bg-white border border-slate-200 shadow-card"
                >
                  <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                    {card.icon}
                  </div>
                  <div>
                    <p className="text-sm font-600 text-slate-700">{card.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{card.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
