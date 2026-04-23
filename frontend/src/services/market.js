import { apiFetch } from "./api";

export async function getLive(pair = "EURUSD") {
  return apiFetch(`/api/market/live?pair=${encodeURIComponent(pair)}`);
}

export async function getCandles(pair = "EURUSD", limit = 120) {
  const data = await apiFetch(`/api/market/candles?pair=${encodeURIComponent(pair)}&limit=${limit}`);
  return data?.candles || [];
}