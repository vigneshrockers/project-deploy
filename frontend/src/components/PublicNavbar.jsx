import React from "react";
import { Link } from "react-router-dom";

export default function PublicNavbar() {
  return (
    <header className="navWrap">
      <div className="navInner">
        <Link to="/" className="logo">
          <span className="logoMark">TF</span>
          <span className="logoText">Trend-Fx</span>
        </Link>

        <nav className="navLinks">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#converter">Currency Converter</a>
          <a href="#contact">Contact Us</a>

          <div className="navDrop">
            <span className="navDropLabel">Register / Login ▾</span>
            <div className="navDropMenu">
              <Link to="/register">Register</Link>
              <Link to="/login">Login</Link>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}