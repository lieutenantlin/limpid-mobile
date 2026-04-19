export type UploadStatus = "pending" | "uploading" | "uploaded" | "failed";

export type MicroplasticUnit = "particles/L" | "particles/mL" | "mg/L";

export interface WaterSample {
  id: string;
  sampleId: string;
  capturedAt: string;
  latitude: number;
  longitude: number;
  locationLabel?: string;
  microplasticEstimate: number;
  unit: MicroplasticUnit;
  confidence: number;
  modelVersion: string;
  notes?: string;
  imageUri?: string;
  uploadStatus: UploadStatus;
  deviceId?: string;
  waterSource?: WaterSourceType;
  temperatureC?: number;
  phLevel?: number;
}

export type WaterSourceType =
  | "ocean"
  | "bay"
  | "river"
  | "lake"
  | "tap"
  | "other";

export interface SampleMetadataDraft {
  notes?: string;
  waterSource?: WaterSourceType;
  temperatureC?: number;
  phLevel?: number;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  organization?: string;
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: number;
}

export interface DeviceStatus {
  connected: boolean;
  deviceId?: string;
  deviceName?: string;
  signal?: number;
  lastSeenAt?: string;
}

export interface ScanResult {
  microplasticEstimate: number;
  unit: MicroplasticUnit;
  confidence: number;
  modelVersion: string;
  processedAt: string;
}
