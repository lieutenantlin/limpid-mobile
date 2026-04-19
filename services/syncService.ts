import { WaterSample } from "@/types";
import { apiClient } from "./apiClient";
import { sampleService } from "./sampleService";

interface PresignedResponse {
  uploadUrl: string;
  objectKey: string;
}

async function uploadImage(imageUri: string): Promise<string | undefined> {
  try {
    const presigned = await apiClient.post<PresignedResponse>("/upload/presigned", {
      filename: "image.jpg",
    });
    if (!presigned.ok || !presigned.data) {
      console.log("[syncService] presigned failed", presigned.error);
      return undefined;
    }
    const { uploadUrl, objectKey } = presigned.data;
    const fileRes = await fetch(imageUri);
    const blob = await fileRes.blob();
    const putRes = await fetch(uploadUrl, { method: "PUT", body: blob });
    if (!putRes.ok) {
      console.log("[syncService] image PUT failed", putRes.status);
      return undefined;
    }
    return objectKey;
  } catch (e: any) {
    console.log("[syncService] image upload failed", e);
    return undefined;
  }
}

export const syncService = {
  async uploadSample(sample: WaterSample): Promise<WaterSample> {
    if (sample.inferenceStatus === "pending" || sample.inferenceStatus === "unavailable") {
      const updated = await sampleService.update(sample.id, {
        uploadStatus: "pending",
      });
      return updated ?? sample;
    }

    if (!sample.deviceId) {
      const updated = await sampleService.update(sample.id, {
        uploadStatus: "failed",
      });
      return updated ?? sample;
    }

    await sampleService.update(sample.id, { uploadStatus: "uploading" });

    let objectKey: string | undefined;
    if (sample.imageUri) {
      objectKey = await uploadImage(sample.imageUri);
    }

    const payload = {
      sampleId: sample.id,
      deviceId: sample.deviceId,
      capturedAt: sample.capturedAt,
      location: { lat: sample.latitude, lng: sample.longitude },
      microplasticEstimate: sample.microplasticEstimate!,
      unit: sample.unit ?? "particles/L",
      confidence: sample.confidence!,
      modelVersion: sample.modelVersion!,
      notes: sample.notes,
      imageObjectKey: objectKey ?? undefined,
    };

    const res = await apiClient.post("/ingest/sample", payload);
    const nextStatus = res.ok ? "uploaded" : "failed";
    const updated = await sampleService.update(sample.id, {
      uploadStatus: nextStatus,
    });
    return updated ?? sample;
  },

  async retryAllFailed(): Promise<number> {
    const list = await sampleService.list();
    const failed = list.filter(
      (s) =>
        s.uploadStatus === "failed" ||
        s.uploadStatus === "pending" ||
        s.uploadStatus === "uploading"
    );
    for (const s of failed) {
      await this.uploadSample(s);
    }
    return failed.length;
  },
};
