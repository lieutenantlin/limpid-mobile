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

export const apiClient = {
  baseUrl: BASE_URL,

  async get<T>(path: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(BASE_URL + path, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      let data: T | undefined;
      const text = await response.text();
      if (text) {
        const json = JSON.parse(text);
        if (response.ok) {
          data = json as T;
        } else {
          return { ok: false, status: response.status, error: json?.error };
        }
      }
      return { ok: response.ok, status: response.status, data };
    } catch (e: any) {
      return { ok: false, status: 0, error: e.message };
    }
  },

  async post<T>(path: string, body: unknown): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(BASE_URL + path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      let data: T | undefined;
      const text = await response.text();
      if (text) {
        const json = JSON.parse(text);
        if (response.ok) {
          data = json as T;
        } else {
          return { ok: false, status: response.status, error: json?.error };
        }
      }
      return { ok: response.ok, status: response.status, data };
    } catch (e: any) {
      return { ok: false, status: 0, error: e.message };
    }
  },
};
