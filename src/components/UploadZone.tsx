"use client";

/**
 * UploadZone — Area drag-and-drop untuk upload gambar X-ray
 * Mendukung: drag & drop, click to browse, preview gambar, validasi tipe & ukuran file
 */

import React, { useCallback, useRef, useState } from "react";

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  onAnalyze: () => void;
  isLoading: boolean;
  selectedFile: File | null;
  preview: string | null;
}

const MAX_SIZE_MB = 10;
const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/jpg"];

export default function UploadZone({
  onFileSelect,
  onAnalyze,
  isLoading,
  selectedFile,
  preview,
}: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateAndSelect = useCallback(
    (file: File) => {
      setError(null);
      if (!ACCEPTED_TYPES.includes(file.type)) {
        setError("Format file tidak didukung. Gunakan PNG atau JPEG/JPG.");
        return;
      }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setError(`Ukuran file terlalu besar. Maksimum ${MAX_SIZE_MB}MB.`);
        return;
      }
      onFileSelect(file);
    },
    [onFileSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) validateAndSelect(file);
    },
    [validateAndSelect]
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) validateAndSelect(file);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* Drop Zone */}
      <div
        id="upload-dropzone"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !selectedFile && inputRef.current?.click()}
        className={`
          relative rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer
          ${isDragging
            ? "border-sky-400 bg-sky-50 shadow-lg shadow-sky-100 scale-[1.01]"
            : selectedFile
            ? "border-sky-300 bg-sky-50/50 cursor-default"
            : "border-slate-300 bg-white hover:border-sky-400 hover:bg-sky-50/30 hover:shadow-md"
          }
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg"
          className="hidden"
          onChange={handleInputChange}
          id="file-input"
        />

        {preview && selectedFile ? (
          /* Preview Mode */
          <div className="p-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row gap-6 items-center">
              {/* Image Preview */}
              <div className="relative w-48 h-48 rounded-xl overflow-hidden bg-slate-900 shadow-lg shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={preview}
                  alt="Preview X-ray"
                  className="w-full h-full object-contain"
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-xl" />
              </div>

              {/* File Info */}
              <div className="flex-1 min-w-0 text-center sm:text-left">
                <div className="flex items-center gap-2 justify-center sm:justify-start mb-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-emerald-600">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <span className="text-sm font-600 text-emerald-700">File siap dianalisis</span>
                </div>
                <p className="font-600 text-slate-800 text-base truncate max-w-xs">
                  {selectedFile.name}
                </p>
                <p className="text-sm text-slate-500 mt-1">
                  {formatSize(selectedFile.size)} &bull;{" "}
                  {selectedFile.type.split("/")[1].toUpperCase()}
                </p>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (inputRef.current) {
                      inputRef.current.value = "";
                      inputRef.current.click();
                    }
                  }}
                  className="mt-4 text-xs text-sky-600 hover:text-sky-700 underline underline-offset-2"
                >
                  Ganti gambar
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="p-12 flex flex-col items-center gap-4 text-center">
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-300 ${isDragging ? "bg-sky-100 scale-110" : "bg-slate-100"}`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`w-10 h-10 transition-colors ${isDragging ? "text-sky-500" : "text-slate-400"}`}
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" x2="12" y1="3" y2="15" />
              </svg>
            </div>

            <div>
              <p className="text-base font-600 text-slate-700">
                {isDragging ? "Lepaskan file di sini" : "Drag & drop gambar X-ray"}
              </p>
              <p className="text-sm text-slate-500 mt-1">
                atau{" "}
                <span className="text-sky-600 font-600 hover:text-sky-700">
                  klik untuk browse
                </span>
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="px-2 py-1 bg-slate-100 rounded-md font-500">PNG</span>
              <span className="px-2 py-1 bg-slate-100 rounded-md font-500">JPEG</span>
              <span className="text-slate-300">|</span>
              <span>Maksimum {MAX_SIZE_MB}MB</span>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm animate-fade-in">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 shrink-0">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" x2="12" y1="8" y2="12" />
            <line x1="12" x2="12.01" y1="16" y2="16" />
          </svg>
          {error}
        </div>
      )}

      {/* Analyze Button */}
      <button
        id="analyze-button"
        onClick={onAnalyze}
        disabled={!selectedFile || isLoading}
        className={`
          w-full py-4 rounded-xl text-base font-700 transition-all duration-300 flex items-center justify-center gap-2
          ${selectedFile && !isLoading
            ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-200 hover:shadow-sky-300 hover:scale-[1.01] active:scale-[0.99]"
            : "bg-slate-100 text-slate-400 cursor-not-allowed"
          }
        `}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin-slow w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Menganalisis...
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            Analisis X-Ray
          </>
        )}
      </button>
    </div>
  );
}
