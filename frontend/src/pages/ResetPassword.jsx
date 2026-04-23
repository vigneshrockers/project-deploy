import React, { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../services/authApi";

export default function ResetPassword() {
  const [search] = useSearchParams();
  const nav = useNavigate();

  const [token, setToken] = useState(search.get("token") || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setMsg("");
    setErr("");

    if (password !== confirmPassword) {
      setErr("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await resetPassword({ token, new_password: password });
      setMsg(res?.message || "Password reset successful.");
      setTimeout(() => nav("/login"), 1200);
    } catch (error) {
      setErr(error.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-wrap">
      <div className="card auth-card">
        <div className="auth-title">Reset Password</div>
        <div className="auth-sub">Enter the passcode sent to your email and set a new password.</div>

        {err ? <div className="alert">{err}</div> : null}
        {msg ? <div className="list-item">{msg}</div> : null}

        <form onSubmit={onSubmit}>
          <div className="field">
            <label>Reset Passcode</label>
            <input
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Enter 6-digit code"
              required
            />
          </div>

          <div className="field">
            <label>New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label>Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" style={{ width: "100%" }}>
            {loading ? "Updating..." : "Reset Password"}
          </button>
        </form>

        <div className="auth-foot">
          <Link to="/forgot-password">Request a new passcode</Link>
          <br />
          <br />
          <Link to="/login">Back to Login</Link>
        </div>
      </div>
    </div>
  );
}
