import { useState } from "react";
import "../styles/converter.css";

const API_KEY = import.meta.env.VITE_TWELVE_DATA_API_KEY;

export default function Converter() {
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");
  const [amount, setAmount] = useState(1);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function convertCurrency() {
    try {
      setLoading(true);
      setError("");
      setResult("");

      if (!API_KEY) {
        throw new Error("Missing API key");
      }

      const response = await fetch(
        `https://api.twelvedata.com/exchange_rate?symbol=${from}/${to}&apikey=${API_KEY}`
      );

      const data = await response.json();
      console.log("Converter response:", data);

      if (!response.ok || data.status === "error" || !data.rate) {
        throw new Error(data.message || "Conversion failed");
      }

      const convertedAmount = Number(amount) * Number(data.rate);
      setResult(convertedAmount.toFixed(4));
    } catch (err) {
      console.error("Converter error:", err);
      setError(err.message || "Conversion failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="converter-page">
      <h1>Currency Converter</h1>

      <div className="converter-box">
        <div className="converter-row">
          <label>Amount</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <div className="converter-row">
          <div className="converter-field">
            <label>From</label>
            <select value={from} onChange={(e) => setFrom(e.target.value)}>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="INR">INR</option>
              <option value="JPY">JPY</option>
              <option value="GBP">GBP</option>
              <option value="AUD">AUD</option>
              <option value="CAD">CAD</option>
            </select>
          </div>

          <div className="converter-arrow">→</div>

          <div className="converter-field">
            <label>To</label>
            <select value={to} onChange={(e) => setTo(e.target.value)}>
              <option value="EUR">EUR</option>
              <option value="USD">USD</option>
              <option value="INR">INR</option>
              <option value="JPY">JPY</option>
              <option value="GBP">GBP</option>
              <option value="AUD">AUD</option>
              <option value="CAD">CAD</option>
            </select>
          </div>
        </div>

        <button onClick={convertCurrency} disabled={loading}>
          {loading ? "Converting..." : "Convert"}
        </button>

        {result && (
          <p className="converter-result">
            Result: {amount} {from} = {result} {to}
          </p>
        )}

        {error && <p className="error-text">{error}</p>}
      </div>
    </div>
  );
}