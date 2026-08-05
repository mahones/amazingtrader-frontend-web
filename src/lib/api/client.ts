import axios, { AxiosError } from "axios";
import { clearToken, getToken } from "./token";

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export const apiClient = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    Accept: "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearToken();
    }
    return Promise.reject(error);
  }
);

interface ApiErrorBody {
  message?: string;
  errors?: Record<string, string[]>;
}

export function extractApiError(error: unknown, fallback = "Une erreur est survenue. Veuillez réessayer."): string {
  if (error instanceof AxiosError) {
    const body = error.response?.data as ApiErrorBody | undefined;
    const firstFieldError = body?.errors ? Object.values(body.errors)[0]?.[0] : undefined;
    return firstFieldError ?? body?.message ?? fallback;
  }
  return fallback;
}
