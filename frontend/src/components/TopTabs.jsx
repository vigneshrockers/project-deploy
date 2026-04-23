   
import React from "react";

const TABS = ["Market", "News", "Market Timings"];

export default function TopTabs({ active, onChange }) {
  return (
    <div className="tabs">
      {TABS.map((t) => (
        <button
          key={t}
          className={`tab ${active === t ? "tabActive" : ""}`}
          onClick={() => onChange(t)}
        >
          {t}
        </button>
      ))}
    </div>
  );
}