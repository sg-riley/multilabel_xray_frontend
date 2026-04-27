/**
 * Definisi kelompok label penyakit dan logika deteksi
 * Digunakan untuk menentukan kemungkinan Pneumonia dan TB
 */

import type { LabelKey, PredictionsMap, ProbabilitiesMap } from "./types";

/** Label yang berkontribusi pada indikasi Pneumonia */
export const PNEUMONIA_LABELS: LabelKey[] = ["Infiltration", "Consolidation", "Nodule"];

/** Label yang berkontribusi pada indikasi Tuberkulosis (TB) */
export const TB_LABELS: LabelKey[] = [
  "Infiltration",
  "Fibrosis",
  "Effusion",
  "Atelectasis",
  "Consolidation",
  "Nodule",
  "Mass",
];

/** Urutan tampilan label (No_Finding ditampilkan terakhir) */
export const LABEL_ORDER: LabelKey[] = [
  "Atelectasis",
  "Effusion",
  "Fibrosis",
  "Infiltration",
  "Consolidation",
  "Mass",
  "Nodule",
  "No_Finding",
];

/**
 * Cek apakah penyakit terdeteksi berdasarkan kelompok label
 * @param predictions - Map prediksi dari backend
 * @param group - Array label yang membentuk kelompok penyakit
 */
export function isDiseaseDetected(
  predictions: PredictionsMap,
  group: LabelKey[]
): boolean {
  return group.some((label) => predictions[label] === true);
}

/**
 * Dapatkan label yang terdeteksi dari suatu kelompok penyakit
 * @param predictions - Map prediksi dari backend
 * @param group - Array label yang membentuk kelompok penyakit
 */
export function getDetectedLabels(
  predictions: PredictionsMap,
  group: LabelKey[]
): LabelKey[] {
  return group.filter((label) => predictions[label] === true);
}

/**
 * Dapatkan probabilitas maksimum dari kelompok label
 * @param probabilities - Map probabilitas dari backend
 * @param group - Array label yang membentuk kelompok penyakit
 */
export function getMaxProbability(
  probabilities: ProbabilitiesMap,
  group: LabelKey[]
): number {
  return Math.max(...group.map((label) => probabilities[label] ?? 0));
}

/** Format label untuk ditampilkan (ganti underscore dengan spasi) */
export function formatLabel(label: string): string {
  return label.replace(/_/g, " ");
}
