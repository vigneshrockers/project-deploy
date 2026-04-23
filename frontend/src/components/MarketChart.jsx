import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function MarketChart({ candles }) {
  const data = (candles || []).map((c) => ({
    time: formatX(c.timestamp),
    close: Number(c.close),
  }));

  if (!data.length) return <div className="small">No candle data.</div>;

  return (
    <div style={{ width: "100%", height: 320 }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <XAxis dataKey="time" tick={{ fill: "#a7b0c0" }} />
          <YAxis tick={{ fill: "#a7b0c0" }} domain={["auto", "auto"]} />
          <Tooltip />
          <Line type="monotone" dataKey="close" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function formatX(ts) {
  const d = new Date(ts);
  if (!Number.isNaN(d.getTime())) {
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  return "";
}