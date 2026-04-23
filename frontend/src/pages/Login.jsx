import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../services/authApi";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await login({ email, password });
      nav("/dashboard");
    } catch (error) {
      setErr(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-wrap">
      <div className="card auth-card">
        <div className="auth-title">Login</div>
        <div className="auth-sub">Sign in to your Trend-Fx account.</div>

        {err ? <div className="alert">{err}</div> : null}

        <form onSubmit={onSubmit}>
          <div className="field">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" style={{ width: "100%" }}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="auth-foot">
          <Link to="/forgot-password">Forgot Password?</Link>
          <br />
          <br />
          Don’t have an account? <Link to="/register">Register</Link>
        </div>
      </div>
    </div>
  );
}