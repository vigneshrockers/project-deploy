import { apiFetch } from "./api";

export async function getLatestNews(pair = "EURUSD", limit = 10) {
  const data = await apiFetch(`/api/news/latest?pair=${encodeURIComponent(pair)}&limit=${limit}`);
  return data?.news || [];
}