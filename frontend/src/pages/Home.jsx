import { Link } from "react-router-dom";
import "../styles/home.css";

export default function Home() {
  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-overlay">
          <div className="hero-content">
            <h1>Trend-Fx:Forex Prediction Website</h1>
            <p>
              View live forex prices, charts, market timings, and a simple demo
              dashboard 
            </p>

            <div className="hero-buttons">
              <Link to="/login" className="btn-primary">
                Login
              </Link>
              <Link to="/register" className="btn-secondary">
                Register
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}