export type PrimaryClassification = "Authentic" | "Suspected AI-Generated" | "Jailbreak Attempt";

export interface VisualBoundingBox {
  x_min: number; // 0 - 1000 percentage mapping
  y_min: number; // 0 - 1000 percentage mapping
  x_max: number;
  y_max: number;
  label: string;
}

export interface AudioAnomaly {
  start_time: string;
  end_time: string;
  reason: string;
}

export interface ForensicScan {
  id: string;
  userId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  is_synthetic_probability: number;
  primary_classification: PrimaryClassification;
  detected_artifacts: string[];
  visual_bounding_boxes?: VisualBoundingBox[];
  audio_anomalies?: AudioAnomaly[];
  content_analysis: string;
  createdAt: string; // ISO DateTime format
}

export interface UserPreference {
  userId: string;
  analysisSensitivity: "low" | "medium" | "high";
  updatedAt: string;
}
