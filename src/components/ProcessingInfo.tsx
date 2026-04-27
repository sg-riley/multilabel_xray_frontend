"use client";

/**
 * ProcessingInfo — Panel informasi waktu pemrosesan yang dapat dilipat (accordion)
 * Menampilkan total waktu dan breakdown per tahap pipeline
 */

import { useState } from "react";
import type { PipelineSteps } from "@/lib/types";

interface ProcessingInfoProps {
  totalMs: number;
  steps: PipelineSteps;
}

const STEP_LABELS: { key: keyof PipelineSteps; label: string; color: string }[] = [
  { key: "preprocess_ms", label: "Preprocessing", color: "bg-sky-400" },
  { key: "segmentation_ms", label: "Segmentasi", color: "bg-blue-400" },
  { key: "handcraft_ms", label: "Handcraft Features", color: "bg-violet-400" },
  { key: "deep_feature_ms", label: "Deep Features", color: "bg-purple-400" },
  { key: "fusion_ms", label: "Feature Fusion", color: "bg-indigo-400" },
  { key: "classify_ms", label: "Klasifikasi", color: "bg-emerald-400" },
  { key: "gradcam_ms", label: "GradCAM", color: "bg-orange-400" },
  { key: "report_ms", label: "Pembuatan Laporan", color: "bg-pink-400" },
];

function formatMs(ms: number): string {
  if (ms >= 1000) return `${(ms / 1000).toFixed(2)}s`;
  return `${ms}ms`;
}

export default function ProcessingInfo({ totalMs, steps }: ProcessingInfoProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
      {/* Accordion Header */}
      <button
        id="processing-info-toggle"
        onClick={() => setIsOpen((v) => !v)}
        className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-slate-500">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span className="text-sm font-700 text-slate-700">Informasi Pemrosesan</span>
          <span className="px-2 py-0.5 rounded-full text-xs font-600 bg-slate-100 text-slate-600">
            {formatMs(totalMs)} total
          </span>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Accordion Content */}
      {isOpen && (
        <div className="px-5 pb-5 border-t border-slate-100 animate-fade-in">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
            {STEP_LABELS.map(({ key, label, color }) => (
              <div
                key={key}
                className="flex flex-col gap-1.5 p-3 rounded-xl bg-slate-50 border border-slate-100"
              >
                <div className={`w-2 h-2 rounded-full ${color}`} />
                <p className="text-xs font-500 text-slate-600 leading-tight">{label}</p>
                <p className="text-sm font-700 text-slate-800">{formatMs(steps[key])}</p>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="mt-4 flex items-center justify-between px-4 py-3 rounded-xl bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-200">
            <span className="text-sm font-600 text-slate-600">Total Waktu Pemrosesan</span>
            <span className="text-base font-800 text-sky-700">{formatMs(totalMs)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
