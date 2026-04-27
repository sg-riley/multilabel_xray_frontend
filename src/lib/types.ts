/**
 * TypeScript interfaces untuk semua tipe respons API
 * Mendefinisikan struktur data yang diterima dari backend FastAPI
 */

export interface PipelineSteps {
  preprocess_ms: number;
  segmentation_ms: number;
  handcraft_ms: number;
  deep_feature_ms: number;
  fusion_ms: number;
  classify_ms: number;
  gradcam_ms: number;
  report_ms: number;
}

/** Label yang dikenali oleh model */
export type LabelKey =
  | "Atelectasis"
  | "Effusion"
  | "Fibrosis"
  | "Infiltration"
  | "Consolidation"
  | "Mass"
  | "Nodule"
  | "No_Finding";

export type PredictionsMap = Record<LabelKey, boolean>;
export type ProbabilitiesMap = Record<LabelKey, number>;
export type GradCamImages = Partial<Record<LabelKey, string>>;

/** Respons utama dari POST /api/analyze */
export interface AnalyzeResponse {
  predictions: PredictionsMap;
  probabilities: ProbabilitiesMap;
  gradcam_images: GradCamImages;
  original_image: string;
  roi_image: string;
  report: string;
  processing_time_ms: number;
  pipeline_steps: PipelineSteps;
  coverage_pct: number;
}

/** Respons dari GET /api/health */
export interface HealthResponse {
  status: "ready" | "loading";
  models: Record<string, unknown>;
}

/** Respons dari GET /api/labels */
export interface LabelsResponse {
  labels: string[];
}

/** Tahapan pipeline untuk progress overlay */
export interface PipelineStage {
  key: string;
  label: string;
  description: string;
  durationMs: number;
}
