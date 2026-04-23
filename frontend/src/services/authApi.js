import { apiFetch } from "./api";
import { setToken } from "./auth";

export async function register(payload) {
  const data = await apiFetch("/api/auth/register", {
    method: "POST",
    body: payload,
  });

  if (data?.access_token) {
    setToken(data.access_token);
  }

  return data;
}

export async function login(payload) {
  const data = await apiFetch("/api/auth/login", {
    method: "POST",
    body: payload,
  });

  if (data?.access_token) {
    setToken(data.access_token);
  }

  return data;
}

export async function me() {
  return apiFetch("/api/users/me", { auth: true });
}

export async function forgotPassword(payload) {
  return apiFetch("/api/auth/forgot-password", {
    method: "POST",
    body: payload,
  });
}

export async function resetPassword(payload) {
  return apiFetch("/api/auth/reset-password", {
    method: "POST",
    body: payload,
  });
}
