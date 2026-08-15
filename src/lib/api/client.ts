import axios, { AxiosError } from "axios";
import { clearToken, getToken } from "./token";
import { toast } from "@/lib/toast";

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export const SESSION_EXPIRED_EVENT = "auth:session-expired";

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
    const status = error.response?.status;
    const url: string = error.config?.url ?? "";
    const isAuthEndpoint = url.includes("/login") || url.includes("/register") || url.includes("/logout");

    if (status === 401) {
      const hadToken = Boolean(getToken());
      clearToken();
      // A 401 on /login (wrong credentials) or /register is a form-level
      // error already surfaced inline — only a stale/rejected token on an
      // authenticated call warrants the global "session expired" toast.
      if (hadToken && !isAuthEndpoint) {
        toast.warning("Votre session a expiré. Veuillez vous reconnecter.", {
          id: "session-expired",
        });
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
        }
      }
    } else if (!error.response || status >= 500) {
      toast.error("Une erreur est survenue côté serveur. Veuillez réessayer.");
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
