import { apiClient } from "./client";
import { clearToken, setToken } from "./token";
import type { User } from "@/types/user";

export async function fetchMe(): Promise<User> {
  const { data } = await apiClient.get<{ data: User }>("/me");
  return data.data;
}

export async function login(email: string, password: string): Promise<User> {
  const { data } = await apiClient.post<{ data: User; token: string }>("/login", {
    email,
    password,
  });
  setToken(data.token);
  return data.data;
}

export async function register(payload: {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}): Promise<User> {
  const { data } = await apiClient.post<{ data: User; token: string }>("/register", payload);
  setToken(data.token);
  return data.data;
}

export async function logout(): Promise<void> {
  try {
    await apiClient.post("/logout");
  } finally {
    clearToken();
  }
}
