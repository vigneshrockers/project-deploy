import "../styles/about.css";

export default function Contact() {
  return (
    <div className="info-page">
      <div className="info-container">
        <div className="info-card">
          <h1>Contact Us</h1>
          <p>
            We would be happy to hear from you for project discussion, feedback,
            collaboration, or any general questions related to Trend-Fx.
          </p>

          <div className="contact-box">
            <div className="mini-card">
              <h3>Phone</h3>
              <p>314 246 1711</p>
            </div>

            <div className="mini-card">
              <h3>Email</h3>
              <p>preetsoni969@gmail.com</p>
            </div>
          </div>

          <h2>Why Contact Trend-Fx?</h2>
          <p>
            Trend-Fx focuses on forex learning, market visualization, price
            analysis, and indicator-based understanding. You can reach out for
            questions about the project, feedback about the interface, or ideas
            for future development.
          </p>
        </div>
      </div>
    </div>
  );
}