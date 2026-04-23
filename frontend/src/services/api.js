import { getToken, logout } from "./auth";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

function toErrorMessage(detail, fallback) {
  if (!detail) return fallback;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    return detail
      .map((item) => {
        if (typeof item === "string") return item;
        if (item?.msg) return item.msg;
        return JSON.stringify(item);
      })
      .join(", ");
  }
  if (typeof detail === "object") {
    if (detail.msg) return detail.msg;
    return JSON.stringify(detail);
  }
  return fallback;
}

export async function apiFetch(path, { method = "GET", body, auth = false } = {}) {
  const headers = { "Content-Type": "application/json" };

  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401) logout();

  const text = await res.text();
  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    const msg = toErrorMessage(data?.detail ?? data, `Request failed (${res.status})`);
    throw new Error(msg);
  }

  return data;
}
