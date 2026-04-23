import React, { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../services/authApi";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setMsg("");
    setErr("");
    setLoading(true);
    try {
      const res = await forgotPassword({ email });
      setMsg(res?.message || "Reset link request submitted.");
    } catch (error) {
      setErr(error.message || "Request failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-wrap">
      <div className="card auth-card">
        <div className="auth-title">Forgot Password</div>
        <div className="auth-sub">Enter your email to receive a 6-digit reset passcode.</div>

        {err ? <div className="alert">{err}</div> : null}
        {msg ? <div className="list-item">{msg}</div> : null}

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

          <button type="submit" style={{ width: "100%" }}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div className="auth-foot">
          <Link to="/reset-password">Already have a passcode?</Link>
          <br />
          <br />
          <Link to="/login">Back to Login</Link>
        </div>
      </div>
    </div>
  );
}
