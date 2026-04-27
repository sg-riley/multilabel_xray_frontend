"use client";

/**
 * ProgressOverlay — Full-screen overlay dengan animasi pipeline stages
 * Menampilkan tahapan pemrosesan secara animasi selama analisis berlangsung (8-15 detik)
 */

import { useEffect, useState } from "react";

interface Stage {
  key: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  durationMs: number;
}

const STAGES: Stage[] = [
  {
    key: "preprocess",
    label: "Preprocessing",
    description: "Normalisasi dan persiapan gambar...",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <rect width="18" height="18" x="3" y="3" rx="2" />
        <path d="M3 9h18" /><path d="M3 15h18" /><path d="M9 3v18" /><path d="M15 3v18" />
      </svg>
    ),
    durationMs: 1800,
  },
  {
    key: "segmentation",
    label: "Segmentasi Paru",
    description: "Mendeteksi dan memisahkan area paru-paru...",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6 6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1" />
        <path d="M8 15v1a6 6 0 0 0 6 6 6 6 0 0 0 6-6v-4" />
        <circle cx="20" cy="10" r="2" />
      </svg>
    ),
    durationMs: 2200,
  },
  {
    key: "features",
    label: "Ekstraksi Fitur",
    description: "Mengekstrak fitur handcraft dan deep learning...",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
        <path d="M7 7h.01" />
      </svg>
    ),
    durationMs: 2500,
  },
  {
    key: "classify",
    label: "Klasifikasi",
    description: "Model AI sedang mengklasifikasi penyakit...",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.29 7 12 12 20.71 7" />
        <line x1="12" x2="12" y1="22" y2="12" />
      </svg>
    ),
    durationMs: 2000,
  },
  {
    key: "gradcam",
    label: "GradCAM",
    description: "Membuat peta aktivasi untuk visualisasi...",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <circle cx="12" cy="12" r="3" />
        <path d="M3 7V5a2 2 0 0 1 2-2h2" />
        <path d="M17 3h2a2 2 0 0 1 2 2v2" />
        <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
        <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
      </svg>
    ),
    durationMs: 1800,
  },
  {
    key: "report",
    label: "Pembuatan Laporan",
    description: "LLM sedang menyusun laporan medis...",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" x2="8" y1="13" y2="13" />
        <line x1="16" x2="8" y1="17" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    durationMs: 1700,
  },
];

type StageStatus = "pending" | "active" | "done";

interface ProgressOverlayProps {
  visible: boolean;
}

export default function ProgressOverlay({ visible }: ProgressOverlayProps) {
  const [currentStage, setCurrentStage] = useState(0);
  const [stageStatuses, setStageStatuses] = useState<StageStatus[]>(
    STAGES.map(() => "pending")
  );
  const [overallProgress, setOverallProgress] = useState(0);

  useEffect(() => {
    if (!visible) {
      setCurrentStage(0);
      setStageStatuses(STAGES.map(() => "pending"));
      setOverallProgress(0);
      return;
    }

    let stageIdx = 0;
    let elapsed = 0;
    const totalDuration = STAGES.reduce((a, s) => a + s.durationMs, 0);

    const runStage = (idx: number) => {
      if (idx >= STAGES.length) return;

      setCurrentStage(idx);
      setStageStatuses((prev) => {
        const next = [...prev];
        next[idx] = "active";
        return next;
      });

      const timer = setTimeout(() => {
        elapsed += STAGES[idx].durationMs;
        setOverallProgress(Math.min(95, (elapsed / totalDuration) * 100));
        setStageStatuses((prev) => {
          const next = [...prev];
          next[idx] = "done";
          return next;
        });
        runStage(idx + 1);
      }, STAGES[idx].durationMs);

      return timer;
    };

    // Small delay to show the overlay first
    const initTimer = setTimeout(() => runStage(stageIdx), 400);
    return () => clearTimeout(initTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      id="progress-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm animate-fade-in"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-500 to-blue-600 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <svg
                className="animate-spin-slow w-5 h-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
            <div>
              <h2 className="text-white font-700 text-base">Menganalisis X-Ray</h2>
              <p className="text-sky-100 text-xs">Proses ini membutuhkan 8-15 detik</p>
            </div>
          </div>

          {/* Overall progress bar */}
          <div className="mt-4 bg-white/20 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-white rounded-full bar-fill"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          <div className="text-right mt-1">
            <span className="text-sky-100 text-xs">{Math.round(overallProgress)}%</span>
          </div>
        </div>

        {/* Stages */}
        <div className="p-6 space-y-3">
          {STAGES.map((stage, idx) => {
            const status = stageStatuses[idx];
            return (
              <div
                key={stage.key}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                  status === "active"
                    ? "bg-sky-50 border border-sky-200"
                    : status === "done"
                    ? "bg-emerald-50 border border-emerald-200"
                    : "bg-slate-50 border border-transparent opacity-50"
                }`}
              >
                {/* Icon / status */}
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                    status === "active"
                      ? "bg-sky-100 text-sky-600"
                      : status === "done"
                      ? "bg-emerald-100 text-emerald-600"
                      : "bg-slate-200 text-slate-400"
                  }`}
                >
                  {status === "done" ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : status === "active" ? (
                    <span className="animate-pulse-soft">{stage.icon}</span>
                  ) : (
                    stage.icon
                  )}
                </div>

                {/* Label */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-600 ${status === "active" ? "text-sky-700" : status === "done" ? "text-emerald-700" : "text-slate-400"}`}>
                    {stage.label}
                  </p>
                  {status === "active" && (
                    <p className="text-xs text-sky-500 animate-pulse-soft truncate">
                      {stage.description}
                    </p>
                  )}
                </div>

                {/* Spinner for active */}
                {status === "active" && (
                  <svg className="animate-spin-slow w-4 h-4 text-sky-500 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                )}
              </div>
            );
          })}
        </div>

        <div className="px-6 pb-5">
          <p className="text-center text-xs text-slate-400 italic">
            Harap tunggu, jangan tutup atau refresh halaman ini.
          </p>
        </div>
      </div>
    </div>
  );
}
