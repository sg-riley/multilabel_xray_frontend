"use client";

/**
 * Halaman Results (/results) — Menampilkan hasil analisis X-ray
 * Layout dua kolom (desktop) / satu kolom (mobile)
 * Data dibaca dari sessionStorage yang disimpan oleh halaman upload
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { AnalyzeResponse } from "@/lib/types";
import { PNEUMONIA_LABELS, TB_LABELS } from "@/lib/disease-groups";
import ImageViewer from "@/components/ImageViewer";
import GradCAMViewer from "@/components/GradCAMViewer";
import DiseaseSummaryCard from "@/components/DiseaseSummaryCard";
import ClassificationTable from "@/components/ClassificationTable";
import ReportPanel from "@/components/ReportPanel";
import ProcessingInfo from "@/components/ProcessingInfo";

export default function ResultsPage() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsClient(true);
  }, []);

  const handleReset = () => {
    sessionStorage.removeItem("xray_result");
    router.push("/");
  };

  /* ── Loading skeleton ── */
  if (!isClient) {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto animate-pulse space-y-6 relative z-10">
          <div className="h-8 w-64 bg-white/10 rounded-xl" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-96 bg-white/10 rounded-2xl" />
            <div className="space-y-4">
              <div className="h-32 bg-white/10 rounded-2xl" />
              <div className="h-48 bg-white/10 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const raw = sessionStorage.getItem("xray_result");
  let result: AnalyzeResponse | null = null;
  let notFound = false;

  if (!raw) {
    notFound = true;
  } else {
    try {
      result = JSON.parse(raw) as AnalyzeResponse;
    } catch {
      notFound = true;
    }
  }

  /* ── Not found state ── */
  if (notFound || !result) {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center px-4">
        <div className="relative z-10 text-center max-w-md">
          <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-6 backdrop-blur-md">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-white">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
          </div>
          <h2 className="text-xl font-700 text-white mb-2">Tidak Ada Hasil Analisis</h2>
          <p className="text-slate-300 text-sm mb-6">
            Belum ada data analisis. Silakan upload gambar X-ray terlebih dahulu.
          </p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-600 rounded-xl shadow-lg shadow-sky-500/30 hover:shadow-sky-500/50 transition-all"
          >
            Kembali ke Upload
          </button>
        </div>
      </div>
    );
  }

  const hasGradCam = Object.keys(result.gradcam_images).length > 0;

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white pb-12">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-sky-400/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        {/* ── Page header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-800 text-white">Hasil Analisis X-Ray</h1>
            <p className="text-slate-300 text-sm mt-1">
              Diproses dalam{" "}
              <strong className="text-sky-400">{(result.processing_time_ms / 1000).toFixed(2)} detik</strong>
            </p>
          </div>

          <button
            id="analyze-another-button"
            onClick={handleReset}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/20 bg-white/5 text-white font-600 text-sm hover:bg-white/10 hover:border-white/30 backdrop-blur-md transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" x2="12" y1="3" y2="15" />
            </svg>
            Analisis Gambar Lain
          </button>
        </div>

        {/* ── Medical disclaimer banner ── */}
        <div className="flex items-start gap-3 px-5 py-4 rounded-xl bg-amber-500/10 border border-amber-500/30 backdrop-blur-md mb-8">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-amber-400 shrink-0 mt-0.5">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
            <path d="M12 9v4" /><circle cx="12" cy="17" r="1" />
          </svg>
          <p className="text-sm text-amber-200/90">
            <strong>Perhatian Medis:</strong> Hasil ini hanya untuk tujuan penelitian dan{" "}
            <strong>bukan merupakan diagnosis medis</strong>. Selalu konsultasikan dengan dokter
            atau tenaga medis profesional untuk interpretasi klinis yang akurat.
          </p>
        </div>

        {/* ── Two-column layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* ===== LEFT COLUMN ===== */}
          <div className="space-y-6">
            {/* 1. Image Viewer */}
            <ImageViewer
              originalImage={result.original_image}
              roiImage={result.roi_image}
              coveragePct={result.coverage_pct}
            />

            {/* 2. GradCAM Viewer (hanya jika ada) */}
            {hasGradCam && (
              <GradCAMViewer gradcamImages={result.gradcam_images} />
            )}
          </div>

          {/* ===== RIGHT COLUMN ===== */}
          <div className="space-y-6">
            {/* 3. Disease Summary Cards */}
            <div>
              <h2 className="text-sm font-700 text-slate-400 uppercase tracking-wider mb-3">
                Ringkasan Penyakit
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DiseaseSummaryCard
                  disease="TB"
                  labels={TB_LABELS}
                  predictions={result.predictions}
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                      <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6 6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1" />
                      <path d="M8 15v1a6 6 0 0 0 6 6 6 6 0 0 0 6-6v-4" />
                      <circle cx="20" cy="10" r="2" />
                    </svg>
                  }
                />
                <DiseaseSummaryCard
                  disease="Pneumonia"
                  labels={PNEUMONIA_LABELS}
                  predictions={result.predictions}
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                      <path d="M12 2a10 10 0 0 1 10 10" />
                      <path d="M12 2a10 10 0 0 0-10 10" />
                      <path d="M12 12v10" />
                      <path d="M12 12H2" />
                      <path d="M12 12h10" />
                    </svg>
                  }
                />
              </div>
            </div>

            {/* 4. Classification Table */}
            <ClassificationTable
              predictions={result.predictions}
              probabilities={result.probabilities}
            />

            {/* 6. Processing Info */}
            <ProcessingInfo
              totalMs={result.processing_time_ms}
              steps={result.pipeline_steps}
            />
          </div>
        </div>

        {/* 5. AI Report Full Width Bottom */}
        <div className="w-full">
          <ReportPanel report={result.report} />
        </div>
      </div>
    </div>
  );
}
