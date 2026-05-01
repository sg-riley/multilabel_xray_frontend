"use client";

/**
 * DiseaseSummaryCard — Kartu ringkasan penyakit (TB dan Pneumonia)
 * Menampilkan status deteksi dan label yang berkontribusi
 */

import type { LabelKey, PredictionsMap } from "@/lib/types";
import { formatLabel, getDetectedLabels, isDiseaseDetected } from "@/lib/disease-groups";

interface DiseaseSummaryCardProps {
  disease: "TB" | "Pneumonia";
  labels: LabelKey[];
  predictions: PredictionsMap;
  icon: React.ReactNode;
}

export default function DiseaseSummaryCard({
  disease,
  labels,
  predictions,
  icon,
}: DiseaseSummaryCardProps) {
  const detected = isDiseaseDetected(predictions, labels);
  const detectedLabels = getDetectedLabels(predictions, labels);

  return (
    <div
      className={`backdrop-blur-md rounded-2xl border p-5 flex flex-col gap-4 shadow-lg transition-all duration-300 hover:shadow-xl ${
        detected
          ? "bg-orange-500/10 border-orange-500/30"
          : "bg-emerald-500/10 border-emerald-500/30"
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 ${
            detected ? "bg-orange-500/20 text-orange-400" : "bg-emerald-500/20 text-emerald-400"
          }`}>
            {icon}
          </div>
          <h4 className="text-sm font-700 text-white">
            {disease === "TB" ? "Tuberculosis (TB)" : "Pneumonia"}
          </h4>
          <p className="text-xs text-slate-300 mt-0.5">
            {labels.length} label dianalisis
          </p>
        </div>

        {/* Status badge */}
        <span
          className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-700 ${
            detected
              ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
              : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${detected ? "bg-orange-400" : "bg-emerald-400"}`} />
          {detected ? "POSSIBLE" : "NOT DETECTED"}
        </span>
      </div>

      {/* Detected labels */}
      <div>
        {detectedLabels.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {detectedLabels.map((label) => (
              <span
                key={label}
                className="px-2 py-0.5 rounded-md bg-orange-500/20 text-orange-300 text-xs font-500 border border-orange-500/30"
              >
                {formatLabel(label)}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic">
            Tidak ada label yang terdeteksi
          </p>
        )}
      </div>
    </div>
  );
}
