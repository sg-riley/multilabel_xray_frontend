"use client";

/**
 * GradCAMViewer — Panel visualisasi GradCAM heatmap
 * Menampilkan peta aktivasi per label yang terdeteksi dengan tab selector
 */

import { useState } from "react";
import type { GradCamImages, LabelKey } from "@/lib/types";
import { formatLabel } from "@/lib/disease-groups";

interface GradCAMViewerProps {
  gradcamImages: GradCamImages;
}

export default function GradCAMViewer({ gradcamImages }: GradCAMViewerProps) {
  const detectedLabels = Object.keys(gradcamImages) as LabelKey[];
  const [activeLabel, setActiveLabel] = useState<LabelKey>(detectedLabels[0]);

  if (detectedLabels.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-slate-100">
        <h3 className="text-sm font-700 text-slate-700 flex items-center gap-2 mb-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4 text-orange-500"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M3 7V5a2 2 0 0 1 2-2h2" />
            <path d="M17 3h2a2 2 0 0 1 2 2v2" />
            <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
            <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
          </svg>
          Activation Map (GradCAM)
        </h3>
        <p className="text-xs text-slate-400">
          Visualisasi area yang paling berpengaruh terhadap prediksi model
        </p>

        {/* Label pills — hanya tampil jika lebih dari 1 label */}
        {detectedLabels.length > 1 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {detectedLabels.map((label) => (
              <button
                key={label}
                id={`gradcam-tab-${label}`}
                onClick={() => setActiveLabel(label)}
                className={`px-3 py-1 rounded-full text-xs font-600 transition-all duration-200 ${
                  activeLabel === label
                    ? "bg-orange-100 text-orange-700 border border-orange-300"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200 border border-transparent"
                }`}
              >
                {formatLabel(label)}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* GradCAM Image */}
      <div className="relative bg-slate-950 aspect-square overflow-hidden">
        {gradcamImages[activeLabel] && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={gradcamImages[activeLabel]}
            alt={`GradCAM untuk ${formatLabel(activeLabel)}`}
            className="w-full h-full object-contain animate-fade-in"
            key={activeLabel}
          />
        )}

        {/* Label badge overlay */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 bg-slate-900/80 backdrop-blur-sm text-white text-xs font-600 rounded-lg">
            {formatLabel(activeLabel)}
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="px-5 py-4 bg-slate-50 border-t border-slate-100">
        <p className="text-xs font-600 text-slate-600 mb-2">Legenda Warna</p>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-3 rounded-full bg-gradient-to-r from-blue-600 via-cyan-400 via-yellow-400 to-red-500" />
        </div>
        <div className="flex justify-between text-xs text-slate-400 mt-1">
          <span>🔵 Aktivasi Rendah</span>
          <span>🔴 Aktivasi Tinggi</span>
        </div>
      </div>
    </div>
  );
}
