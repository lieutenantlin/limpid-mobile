// Mock API client. TODO: replace with real fetch to AWS-backed endpoints.
// Planned endpoints:
//   POST /auth/login
//   GET  /auth/me
//   POST /ingest/sample
//   GET  /samples
//   GET  /samples/:id

const BASE_URL = process.env.EXPO_PUBLIC_RORK_API_BASE_URL ?? "";

export interface ApiResponse<T> {
  ok: boolean;
  status: number;
  data?: T;
  error?: string;
}

async function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export const apiClient = {
  baseUrl: BASE_URL,

  async get<T>(path: string): Promise<ApiResponse<T>> {
    console.log("[apiClient] GET", path, "(mock)");
    await delay(400);
    return { ok: true, status: 200 };
  },

  async post<T>(path: string, body: unknown): Promise<ApiResponse<T>> {
    console.log("[apiClient] POST", path, body, "(mock)");
    await delay(600);
    return { ok: true, status: 200 };
  },
};
