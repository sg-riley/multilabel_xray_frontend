/**
 * Fetch wrapper untuk berkomunikasi dengan Next.js API route
 * yang mem-proxy request ke backend FastAPI
 */

import type { AnalyzeResponse, HealthResponse, LabelsResponse } from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

/**
 * Kirim gambar X-ray untuk dianalisis
 * Request dikirim melalui Next.js API route (/api/analyze) untuk menghindari CORS
 * @param file - File gambar PNG/JPG
 */
export async function analyzeImage(file: File): Promise<AnalyzeResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/analyze", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Terjadi kesalahan tidak diketahui" }));
    throw new Error(error.detail ?? `HTTP ${response.status}`);
  }

  return response.json() as Promise<AnalyzeResponse>;
}

/**
 * Cek status kesehatan backend
 */
export async function checkHealth(): Promise<HealthResponse> {
  const response = await fetch(`${BASE_URL}/api/health`);
  if (!response.ok) throw new Error("Backend tidak dapat dijangkau");
  return response.json() as Promise<HealthResponse>;
}

/**
 * Ambil daftar label yang didukung backend
 */
export async function fetchLabels(): Promise<LabelsResponse> {
  const response = await fetch(`${BASE_URL}/api/labels`);
  if (!response.ok) throw new Error("Gagal mengambil daftar label");
  return response.json() as Promise<LabelsResponse>;
}
