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
          !isLast ? "border-b border-slate-100" : ""
        }`}
      >
        {/* Label name */}
        <div className="w-28 shrink-0">
          <span className="text-sm font-500 text-slate-700">{formatLabel(label)}</span>
        </div>

        {/* Probability bar */}
        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full bar-fill ${
              detected ? "bg-gradient-to-r from-orange-400 to-amber-400" : "bg-slate-300"
            }`}
            style={{ width: `${Math.min(100, prob * 100)}%` }}
          />
        </div>

        {/* Percentage */}
        <span
          className={`w-12 text-right text-sm font-600 shrink-0 ${
            detected ? "text-orange-600" : "text-slate-400"
          }`}
        >
          {pct}%
        </span>

        {/* Badge */}
        <div className="w-24 shrink-0 text-right">
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-600 ${
              detected
                ? "bg-orange-100 text-orange-700 border border-orange-200"
                : "bg-slate-100 text-slate-400 border border-slate-200"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${detected ? "bg-orange-500" : "bg-slate-300"}`} />
            {detected ? "Detected" : "Normal"}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-sky-500">
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
        <h3 className="text-sm font-700 text-slate-700">Detailed Findings (8 Labels)</h3>
      </div>

      <div className="px-5 py-1">
        {/* Column headers */}
        <div className="flex items-center gap-3 py-2 border-b border-slate-100">
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
        <div className="my-2 border-t-2 border-dashed border-slate-200" />
        <p className="text-xs text-slate-400 font-500 mb-1">Finding Lain</p>
        {renderRow("No_Finding", true)}
      </div>

      <div className="px-5 py-3 bg-slate-50 border-t border-slate-100">
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-1.5 rounded bg-gradient-to-r from-orange-400 to-amber-400 inline-block" />
            Terdeteksi
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-1.5 rounded bg-slate-300 inline-block" />
            Normal
          </span>
        </div>
      </div>
    </div>
  );
}
