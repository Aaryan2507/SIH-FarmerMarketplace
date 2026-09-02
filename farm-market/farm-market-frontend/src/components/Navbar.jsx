import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { role, username, isAuthenticated, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header style={{ borderBottom: "1px solid var(--color-line)", background: "var(--color-surface)" }}>
      <div className="container row-between" style={{ height: 68 }}>
        <Link to="/" style={{ textDecoration: "none" }}>
          <div className="row" style={{ gap: 8 }}>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.3rem", color: "var(--color-green)" }}>
              Kisaan Direct
            </span>
          </div>
        </Link>

        <nav className="row" style={{ gap: 18 }}>
          {role === "customer" && (
            <>
              <Link to="/shop" className="muted">Browse</Link>
              <Link to="/cart" className="muted">Cart{count > 0 ? ` (${count})` : ""}</Link>
            </>
          )}
          {role === "seller" && (
            <>
              <Link to="/seller" className="muted">Dashboard</Link>
              <Link to="/seller/listings" className="muted">Listings</Link>
              <Link to="/seller/demand" className="muted">Stock & Demand</Link>
              <Link to="/seller/earnings" className="muted">Earnings</Link>
            </>
          )}

          {isAuthenticated ? (
            <div className="row" style={{ gap: 12 }}>
              <span className="muted">{username}</span>
              <button className="btn btn-ghost" onClick={handleLogout}>Log out</button>
            </div>
          ) : (
            <Link to="/login">
              <button className="btn btn-primary">Log in</button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
