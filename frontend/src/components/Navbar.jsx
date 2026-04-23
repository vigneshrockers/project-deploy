import { Link } from "react-router-dom";
import { getToken } from "../services/auth";
import "../styles/navbar.css";

export default function Navbar() {
  const isLoggedIn = !!getToken();

  return (
    <nav className="tf-navbar">
      <div className="tf-navbar-inner">
        <Link to="/" className="tf-brand">
          <div className="tf-logo-box">TF</div>
          <span className="tf-brand-text">Trend-Fx</span>
        </Link>

        <div className="tf-nav-links">
          <Link to="/about">About</Link>
          <Link to="/converter">Currency Converter</Link>
          <Link to="/contact">Contact Us</Link>

          {isLoggedIn && <Link to="/dashboard">Dashboard</Link>}
          {isLoggedIn ? (
            <Link to="/logout" className="tf-logout-link">
              Logout
            </Link>
          ) : (
            <Link to="/login">Register / Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
