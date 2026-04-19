import { DeviceStatus, ScanResult } from "@/types";

// TODO: Replace mock with real Arduino UNO Q communication.
// Likely transport: BLE via react-native-ble-plx (requires native build) or
// Wi-Fi/HTTP bridge exposed by the Arduino UNO Q. For now, we simulate.

let mockStatus: DeviceStatus = {
  connected: false,
  deviceId: "arduino-uno-q-7742",
  deviceName: "UNO Q — MPNet Edge",
  signal: 0,
};

export const deviceService = {
  async getStatus(): Promise<DeviceStatus> {
    return { ...mockStatus };
  },

  async connect(): Promise<DeviceStatus> {
    console.log("[deviceService] connecting (mock)...");
    await new Promise((r) => setTimeout(r, 900));
    mockStatus = {
      ...mockStatus,
      connected: true,
      signal: 0.82,
      lastSeenAt: new Date().toISOString(),
    };
    return { ...mockStatus };
  },

  async disconnect(): Promise<DeviceStatus> {
    mockStatus = { ...mockStatus, connected: false, signal: 0 };
    return { ...mockStatus };
  },

  // Sends the image payload to the edge device and awaits inference result.
  async runInference(imageUri: string): Promise<ScanResult> {
    console.log("[deviceService] runInference (mock)", imageUri);
    await new Promise((r) => setTimeout(r, 1800));
    const estimate = Math.round((8 + Math.random() * 50) * 10) / 10;
    const confidence = Math.round((0.72 + Math.random() * 0.24) * 100) / 100;
    return {
      microplasticEstimate: estimate,
      unit: "particles/L",
      confidence,
      modelVersion: "mpnet-edge-0.3.2",
      processedAt: new Date().toISOString(),
    };
  },
};
