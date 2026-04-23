import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../services/auth";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    logout();
    const timer = setTimeout(() => {
      navigate("/login", { replace: true });
    }, 900);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="auth-wrap">
      <div className="card auth-card auth-status-card">
        <div className="auth-title">Logged out</div>
        <div className="auth-sub">
          Your session has ended. Redirecting you back to login.
        </div>
        <div className="list-item">You can sign in again whenever you are ready.</div>
        <div className="auth-foot">
          <Link to="/login">Go to Login now</Link>
        </div>
      </div>
    </div>
  );
}
