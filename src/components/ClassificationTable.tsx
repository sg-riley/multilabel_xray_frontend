"use client";

/**
 * ClassificationTable — Tabel hasil klasifikasi detail untuk 8 label
 * Menampilkan probability bar, persentase, dan badge status per label
 */

import type { LabelKey, PredictionsMap, ProbabilitiesMap } from "@/lib/types";
import { LABEL_ORDER, formatLabel } from "@/lib/disease-groups";

interface ClassificationTableProps {
  predictions: PredictionsMap;
  probabilities: ProbabilitiesMap;
}

export default function ClassificationTable({
  predictions,
  probabilities,
}: ClassificationTableProps) {
  const mainLabels = LABEL_ORDER.filter((l) => l !== "No_Finding");

  const renderRow = (label: LabelKey, isLast = false) => {
    const detected = predictions[label];
    const prob = probabilities[label] ?? 0;
    const pct = (prob * 100).toFixed(1);

    return (
      <div
        key={label}
        className={`flex items-center gap-3 py-3 ${
          !isLast ? "border-b border-white/10" : ""
        }`}
      >
        {/* Label name */}
        <div className="w-28 shrink-0">
          <span className="text-sm font-500 text-slate-300">{formatLabel(label)}</span>
        </div>

        {/* Probability bar */}
        <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full bar-fill ${
              detected ? "bg-gradient-to-r from-orange-400 to-amber-400" : "bg-white/20"
            }`}
            style={{ width: `${Math.min(100, prob * 100)}%` }}
          />
        </div>

        {/* Percentage */}
        <span
          className={`w-12 text-right text-sm font-600 shrink-0 ${
            detected ? "text-orange-400" : "text-slate-400"
          }`}
        >
          {pct}%
        </span>

        {/* Badge */}
        <div className="w-24 shrink-0 text-right">
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-600 ${
              detected
                ? "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                : "bg-white/5 text-slate-400 border border-white/10"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${detected ? "bg-orange-400" : "bg-white/20"}`} />
            {detected ? "Detected" : "Normal"}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/10 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-sky-400">
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
        <h3 className="text-sm font-700 text-white">Detailed Findings (8 Labels)</h3>
      </div>

      <div className="px-5 py-1">
        {/* Column headers */}
        <div className="flex items-center gap-3 py-2 border-b border-white/10">
          <span className="w-28 text-xs font-600 text-slate-400 shrink-0">Label</span>
          <span className="flex-1 text-xs font-600 text-slate-400">Probabilitas</span>
          <span className="w-12 text-right text-xs font-600 text-slate-400 shrink-0">%</span>
          <span className="w-24 text-right text-xs font-600 text-slate-400 shrink-0">Status</span>
        </div>

        {/* Main labels */}
        {mainLabels.map((label, i) =>
          renderRow(label, i === mainLabels.length - 1)
        )}

        {/* Divider + No_Finding */}
        <div className="my-2 border-t-2 border-dashed border-white/10" />
        <p className="text-xs text-slate-400 font-500 mb-1">Finding Lain</p>
        {renderRow("No_Finding", true)}
      </div>

      <div className="px-5 py-3 bg-white/5 border-t border-white/10">
        <div className="flex items-center gap-4 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-1.5 rounded bg-gradient-to-r from-orange-400 to-amber-400 inline-block" />
            Terdeteksi
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-1.5 rounded bg-white/20 inline-block" />
            Normal
          </span>
        </div>
      </div>
    </div>
  );
}
