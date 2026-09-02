import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchMyProducts } from "../../api/products";
import { fetchEarnings } from "../../api/orders";

export default function SellerDashboard() {
  const [products, setProducts] = useState([]);
  const [earnings, setEarnings] = useState(null);

  useEffect(() => {
    fetchMyProducts().then(setProducts);
    fetchEarnings().then(setEarnings);
  }, []);

  const lowStock = products.filter((p) => p.stock > 0 && p.stock < 10).length;
  const outOfStock = products.filter((p) => p.stock === 0).length;

  return (
    <div className="main">
      <div className="container">
        <span className="eyebrow">Seller dashboard</span>
        <h1 style={{ fontSize: "1.8rem", marginBottom: 24 }}>Welcome back</h1>

        <div className="grid grid-3" style={{ marginBottom: 30 }}>
          <div className="card">
            <p className="muted" style={{ marginBottom: 6 }}>Active listings</p>
            <span className="stat-num">{products.length}</span>
          </div>
          <div className="card">
            <p className="muted" style={{ marginBottom: 6 }}>Low / out of stock</p>
            <span className="stat-num" style={{ color: "var(--color-clay)" }}>{lowStock + outOfStock}</span>
          </div>
          <div className="card">
            <p className="muted" style={{ marginBottom: 6 }}>Earnings to date</p>
            <span className="stat-num">₹{earnings?.totalEarnings ?? "—"}</span>
          </div>
        </div>

        <div className="grid grid-3">
          <Link to="/seller/listings" style={{ textDecoration: "none" }}>
            <div className="card">
              <span className="eyebrow">Manage</span>
              <h3 style={{ fontSize: "1.05rem" }}>List & edit produce</h3>
              <p className="muted">Add new stock or update prices and quantities.</p>
            </div>
          </Link>
          <Link to="/seller/demand" style={{ textDecoration: "none" }}>
            <div className="card">
              <span className="eyebrow">Track</span>
              <h3 style={{ fontSize: "1.05rem" }}>Stock & demand</h3>
              <p className="muted">See what's running low against what customers are ordering.</p>
            </div>
          </Link>
          <Link to="/seller/earnings" style={{ textDecoration: "none" }}>
            <div className="card">
              <span className="eyebrow">Review</span>
              <h3 style={{ fontSize: "1.05rem" }}>Earnings</h3>
              <p className="muted">Payout totals and recent order value.</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
