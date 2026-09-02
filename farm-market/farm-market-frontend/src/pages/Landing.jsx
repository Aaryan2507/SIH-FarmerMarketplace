import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="main">
      <div className="container">
        <div className="furrows" style={{ borderRadius: 20, padding: "72px 40px", textAlign: "center", background: "var(--color-bg-soft)" }}>
          <span className="eyebrow">Direct from the field</span>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)", maxWidth: 720, margin: "10px auto 16px" }}>
            Produce sold by the farmer who grew it.
          </h1>
          <p style={{ maxWidth: 560, margin: "0 auto 30px", fontSize: "1.05rem" }}>
            Kisaan Direct cuts out the middle chain between farm and kitchen —
            growers set their own prices and stock, customers buy fresh.
          </p>
          <div className="row" style={{ justifyContent: "center", gap: 14 }}>
            <Link to="/shop">
              <button className="btn btn-gold">Browse as a customer</button>
            </Link>
            <Link to="/login?role=seller">
              <button className="btn btn-clay">I'm a farmer, list my produce</button>
            </Link>
          </div>
        </div>

        <div className="grid grid-3" style={{ marginTop: 40 }}>
          <div className="card">
            <span className="eyebrow">01 — List</span>
            <h3 style={{ fontSize: "1.05rem" }}>Sellers post stock</h3>
            <p className="muted">Farmers list what's ready to harvest, set a price per unit, and update stock as it moves.</p>
          </div>
          <div className="card">
            <span className="eyebrow">02 — Browse</span>
            <h3 style={{ fontSize: "1.05rem" }}>Customers shop fresh</h3>
            <p className="muted">Search by category, add to cart, and check out — no distributor markup in between.</p>
          </div>
          <div className="card">
            <span className="eyebrow">03 — Earn</span>
            <h3 style={{ fontSize: "1.05rem" }}>Sellers track earnings</h3>
            <p className="muted">A running view of demand and payouts, so restocking decisions are never a guess.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
