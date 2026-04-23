import React, { useEffect, useState } from "react";

export default function Clock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <div>
      <div className="section-title">Current Time</div>
      <div className="list-item">
        <div style={{ fontWeight: 900, fontSize: 18 }}>
          {now.toLocaleTimeString()}
        </div>
        <div className="small">{now.toLocaleDateString()} • {tz}</div>
      </div>
    </div>
  );
}