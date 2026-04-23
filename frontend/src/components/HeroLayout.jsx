import PublicNavbar from "./PublicNavbar";

export default function HeroLayout({ title, subtitle, children }) {
  return (
    <div className="heroPage">
      <div className="heroBg" />
      <div className="heroOverlay" />

      <PublicNavbar />

      <main className="heroContent">
        <div className="heroText">
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>

        <div>{children}</div>
      </main>
    </div>
  );
}