"use client";

/**
 * Halaman Upload (/) — Halaman utama untuk upload gambar X-ray
 * Menampilkan hero section, upload zone, dan progress overlay selama analisis
 */

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import UploadZone from "@/components/UploadZone";
import ProgressOverlay from "@/components/ProgressOverlay";
import { analyzeImage, getPreview } from "@/lib/api";

export default function HomePage() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleFileSelect = useCallback(async (file: File) => {
    setSelectedFile(file);
    setPreview(null); // Reset preview while loading

    const isDicom =
      file.name.toLowerCase().endsWith(".dcm") ||
      file.name.toLowerCase().endsWith(".dicom") ||
      file.type.includes("dicom");

    if (isDicom) {
      try {
        const { preview: b64 } = await getPreview(file);
        setPreview(b64);
      } catch (err) {
        console.error("Failed to get DICOM preview", err);
        // Fallback: preview tetap null, UploadZone akan menampilkan icon DICOM
      }
    } else {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
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

      <div className="relative flex flex-col lg:flex-row h-[calc(100vh-64px)] overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-sky-400/5 rounded-full blur-3xl" />
        </div>

        {/* ===== LEFT SECTION: HEADING ===== */}
        <section className="relative flex-1 flex flex-col justify-center px-8 sm:px-12 lg:px-20 z-10">
          <div className="relative z-10 max-w-xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-sm font-500 mb-6 w-max">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse-soft" />
              Powered by Deep Learning &amp; LLM
            </div>

            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-800 leading-tight mb-6">
              Analisis <span className="text-sky-400">X-Ray</span>
              <br />
              Kecerdasan Buatan
            </h1>

            <p className="text-lg text-slate-300 leading-relaxed mb-8">
              Sistem klasifikasi multi-label berbasis AI untuk mendeteksi 8 kondisi
              paru-paru sekaligus — termasuk Atelektasis, Efusi, Fibrosis, dan lainnya.
            </p>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-3">
              {[
                { icon: "🫁", text: "8 Label Penyakit" },
                { icon: "🔬", text: "GradCAM" },
                { icon: "📋", text: "AI Report" },
                { icon: "⚡", text: "Real-time" },
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
          </div>
        </section>

        {/* ===== RIGHT SECTION: UPLOAD ===== */}
        <section className="flex-1 flex flex-col justify-center items-center px-8 sm:px-12 lg:px-20 relative z-10">
          <div className="w-full max-w-xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-800 text-white mb-2">
                Upload X-Ray
              </h2>
              <p className="text-slate-300">
                Format PNG, JPEG, atau DICOM (maks. 10MB)
              </p>
            </div>

            <UploadZone
              onFileSelect={handleFileSelect}
              onAnalyze={handleAnalyze}
              isLoading={isLoading}
              selectedFile={selectedFile}
              preview={preview}
            />
          </div>
        </section>
      </div>
    </>
  );
}
