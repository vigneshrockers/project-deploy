import "../styles/about.css";

export default function About() {
  return (
    <div className="info-page">
      <div className="info-container">
        <div className="info-card">
          <h1>About the Forex Market</h1>
          <p>
            The foreign exchange market, commonly called Forex or FX, is the
            global market where different currencies are bought and sold. It is
            the largest financial market in the world and operates twenty-four
            hours a day across major trading sessions such as Sydney, Tokyo,
            London, and New York.
          </p>

          <h2>History of Forex</h2>
          <p>
            The history of forex started with currency exchange for trade, but
            the modern market developed after the Bretton Woods system ended in
            1971. After that, currencies were allowed to float more freely,
            which created the modern exchange-rate system used today. Over time,
            technology and online platforms made forex trading faster and more
            accessible around the world.
          </p>

          <h2>How the Forex Market Works</h2>
          <p>
            Forex is traded in pairs such as EUR/USD or USD/JPY. The first
            currency is called the base currency and the second is the quote
            currency. The price tells how much of the quote currency is needed
            to buy one unit of the base currency. Prices change continuously
            because of supply and demand in the international market.
          </p>

          <h2>What Affects Forex Prices</h2>
          <div className="info-grid">
            <div className="mini-card">
              <h3>Interest Rates</h3>
              <p>
                Central bank decisions strongly influence the value of a
                currency and investor demand.
              </p>
            </div>
            <div className="mini-card">
              <h3>Inflation</h3>
              <p>
                Lower inflation usually supports stronger currency value over
                time compared to weaker economies.
              </p>
            </div>
            <div className="mini-card">
              <h3>Economic Growth</h3>
              <p>
                GDP, employment, and trade reports can push prices up or down
                quickly.
              </p>
            </div>
            <div className="mini-card">
              <h3>Political Events</h3>
              <p>
                Elections, policies, conflicts, and uncertainty can create
                volatility in forex prices.
              </p>
            </div>
          </div>

          <h2>Objectives of the Forex Market</h2>
          <p>
            The forex market supports international trade, allows currency
            conversion for businesses and travelers, creates liquidity in the
            financial system, and gives investors and traders opportunities to
            manage risk or benefit from price movement.
          </p>

          <h2>About Trend-Fx</h2>
          <p>
            Trend-Fx is an AI-based Forex Prediction Website built to help users
            understand live currency prices, study technical indicators, and
            analyze market trends in a simple and visual dashboard. The project
            is designed for learning, research, and practical understanding of
            forex market behavior.
          </p>
        </div>
      </div>
    </div>
  );
}