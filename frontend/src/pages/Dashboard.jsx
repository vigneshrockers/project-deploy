import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
  AreaChart,
  Area,
  ComposedChart,
  Bar,
  Legend,
} from "recharts";

export default function Dashboard() {
  const navigate = useNavigate();

  const [selectedPair, setSelectedPair] = useState("USD/INR");
  const [livePrice, setLivePrice] = useState("--");
  const [liveTime, setLiveTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [chartData, setChartData] = useState([]);

  const currencyPairs = ["EUR/USD", "USD/JPY", "GBP/USD", "AUD/USD", "USD/INR"];

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setLiveTime(
        now.toLocaleString("en-US", {
          weekday: "short",
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchMarketData();

    const interval = setInterval(() => {
      fetchMarketData();
    }, 15000);

    return () => clearInterval(interval);
  }, [selectedPair]);

  async function fetchMarketData() {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(
        `http://localhost:8000/market-data?symbol=${encodeURIComponent(selectedPair)}&interval=5min&outputsize=60`
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch market data");
      }

      const cleaned = (data.data || []).filter(
        (item) =>
          item.price !== null &&
          item.price !== undefined
      );

      setChartData(cleaned);

      if (cleaned.length > 0) {
        setLivePrice(cleaned[cleaned.length - 1].price);
      } else {
        setLivePrice("--");
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
      setChartData([]);
      setLivePrice("--");
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    navigate("/logout");
  }

  const rsiData = useMemo(() => {
    return chartData.filter((item) => item.rsi !== null);
  }, [chartData]);

  const macdData = useMemo(() => {
    return chartData.filter(
      (item) =>
        item.macd !== null &&
        item.signal !== null &&
        item.histogram !== null
    );
  }, [chartData]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#081a4b",
        color: "white",
        padding: "20px",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          background: "#0b1f5e",
          borderRadius: "16px",
          padding: "24px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
            marginBottom: "24px",
          }}
        >
          <h2 style={{ margin: 0 }}>Live Forex Dashboard</h2>

          <button
            onClick={handleLogout}
            style={{
              padding: "10px 16px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Logout
          </button>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label
            htmlFor="pair-select"
            style={{ fontWeight: "bold", marginRight: "10px" }}
          >
            Currency Pair:
          </label>

          <select
            id="pair-select"
            value={selectedPair}
            onChange={(e) => setSelectedPair(e.target.value)}
            style={{
              padding: "10px 12px",
              borderRadius: "8px",
              border: "none",
              fontWeight: "bold",
              minWidth: "220px",
            }}
          >
            {currencyPairs.map((pair) => (
              <option key={pair} value={pair}>
                {pair}
              </option>
            ))}
          </select>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <div style={cardStyle}>
            <p style={labelStyle}>Selected Pair</p>
            <h3 style={{ margin: 0 }}>{selectedPair}</h3>
          </div>

          <div style={cardStyle}>
            <p style={labelStyle}>Live Price</p>
            <h1 style={{ margin: 0, fontSize: "40px" }}>
              {loading ? "Loading..." : livePrice}
            </h1>
          </div>

          <div style={cardStyle}>
            <p style={labelStyle}>Live Time</p>
            <h3 style={{ margin: 0 }}>{liveTime}</h3>
          </div>
        </div>

        {error && (
          <div
            style={{
              background: "#7a1f1f",
              padding: "12px",
              borderRadius: "10px",
              marginBottom: "20px",
            }}
          >
            {error}
          </div>
        )}

        <h3 style={sectionTitle}>Price Chart</h3>
        <div style={chartBoxStyle}>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#29407a" />
              <XAxis dataKey="time" stroke="#ffffff" />
              <YAxis stroke="#ffffff" domain={["auto", "auto"]} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#67a4ff"
                strokeWidth={2}
                dot={false}
                name="Close Price"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <h3 style={sectionTitle}>RSI Indicator</h3>
        <div style={chartBoxStyle}>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={rsiData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#29407a" />
              <XAxis dataKey="time" stroke="#ffffff" />
              <YAxis stroke="#ffffff" domain={[0, 100]} />
              <Tooltip />
              <ReferenceLine y={70} stroke="#ff6b6b" strokeDasharray="5 5" />
              <ReferenceLine y={30} stroke="#4cd964" strokeDasharray="5 5" />
              <Area
                type="monotone"
                dataKey="rsi"
                stroke="#d0b3ff"
                fill="#d0b3ff"
                fillOpacity={0.08}
                strokeWidth={2}
                dot={false}
                name="RSI"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <h3 style={sectionTitle}>MACD Indicator</h3>
        <div style={chartBoxStyle}>
          <ResponsiveContainer width="100%" height={240}>
            <ComposedChart data={macdData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#29407a" />
              <XAxis dataKey="time" stroke="#ffffff" />
              <YAxis stroke="#ffffff" domain={["auto", "auto"]} />
              <Tooltip />
              <Legend />
              <ReferenceLine y={0} stroke="#cccccc" />
              <Bar dataKey="histogram" fill="#7fd1ff" name="Histogram" />
              <Line
                type="monotone"
                dataKey="macd"
                stroke="#00d2ff"
                strokeWidth={2}
                dot={false}
                name="MACD"
              />
              <Line
                type="monotone"
                dataKey="signal"
                stroke="#ff6f91"
                strokeWidth={2}
                dot={false}
                name="Signal"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

const cardStyle = {
  background: "#13286d",
  borderRadius: "14px",
  padding: "20px",
};

const labelStyle = {
  margin: "0 0 10px 0",
  color: "#cfd8ff",
};

const sectionTitle = {
  marginBottom: "10px",
};

const chartBoxStyle = {
  background: "#13286d",
  borderRadius: "14px",
  padding: "16px",
  marginBottom: "24px",
};
