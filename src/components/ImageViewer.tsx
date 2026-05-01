"use client";

/**
 * ImageViewer — Panel viewer gambar dengan tab switcher Original/ROI
 * Menampilkan gambar base64 dari backend dan persentase coverage paru-paru
 */

import { useState } from "react";

type Tab = "original" | "roi";

interface ImageViewerProps {
  originalImage: string;
  roiImage: string;
  coveragePct: number;
}

export default function ImageViewer({
  originalImage,
  roiImage,
  coveragePct,
}: ImageViewerProps) {
  const [activeTab, setActiveTab] = useState<Tab>("original");

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    {
      key: "original",
      label: "Original",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
          <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
          <circle cx="9" cy="9" r="2" />
          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
        </svg>
      ),
    },
    {
      key: "roi",
      label: "ROI (Segmented)",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
          <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6 6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1" />
          <path d="M8 15v1a6 6 0 0 0 6 6 6 6 0 0 0 6-6v-4" />
          <circle cx="20" cy="10" r="2" />
        </svg>
      ),
    },
  ];

  const currentImage = activeTab === "original" ? originalImage : roiImage;

  return (
    <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-white/10">
        <h3 className="text-sm font-700 text-white mb-3 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-sky-400">
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
          </svg>
          Gambar X-Ray
        </h3>

        {/* Tab switcher */}
        <div className="flex bg-white/10 rounded-xl p-1 gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              id={`tab-${tab.key}`}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-600 transition-all duration-200 ${
                activeTab === tab.key
                  ? "bg-white/20 text-sky-300 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Image */}
      <div className="relative bg-black/40 aspect-square overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={currentImage}
          alt={activeTab === "original" ? "Gambar X-Ray original" : "Gambar ROI tersegmentasi"}
          className="w-full h-full object-contain animate-fade-in"
          key={activeTab}
        />
      </div>

      {/* Coverage info */}
      <div className="px-5 py-4 bg-white/5 border-t border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-sky-400">
              <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6 6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1" />
              <path d="M8 15v1a6 6 0 0 0 6 6 6 6 0 0 0 6-6v-4" />
              <circle cx="20" cy="10" r="2" />
            </svg>
            <span className="font-500">Lung Coverage</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-sky-400 to-blue-500 rounded-full bar-fill"
                style={{ width: `${Math.min(100, coveragePct)}%` }}
              />
            </div>
            <span className="text-sm font-700 text-sky-400">
              {coveragePct.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
