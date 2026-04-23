import React from "react";

export default function ProfileCard({ user }) {
  return (
    <div>
      <div className="section-title">My Profile</div>
      <div className="list-item">
        <div style={{ fontWeight: 900, fontSize: 16 }}>
          {user?.full_name || user?.name || "User"}
        </div>
        <div className="small">{user?.email || "-"}</div>
      </div>
    </div>
  );
}