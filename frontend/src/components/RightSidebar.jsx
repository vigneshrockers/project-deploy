import React from "react";
import ProfileCard from "./ProfileCard.jsx";
import Clock from "./Clock.jsx";

export default function RightSidebar({ user }) {
  return (
    <div className="card" style={{ height: "fit-content" }}>
      <ProfileCard user={user} />
      <div style={{ height: 12 }} />
      <Clock />
    </div>
  );
}