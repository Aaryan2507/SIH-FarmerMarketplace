import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

export default function Cart() {
  const { items, updateQty, removeFromCart, total } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="main">
        <div className="container empty-state">
          <h3>Your cart is empty</h3>
          <p className="muted">Add some fresh produce to get started.</p>
          <Link to="/shop">
            <button className="btn btn-gold">Browse produce</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="main">
      <div className="container" style={{ maxWidth: 720 }}>
        <h1 style={{ fontSize: "1.8rem", marginBottom: 20 }}>Your cart</h1>

        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          {items.map((item, idx) => (
            <div
              key={item.id}
              className="row-between"
              style={{ padding: "16px 20px", borderBottom: idx < items.length - 1 ? "1px solid var(--color-line)" : "none" }}
            >
              <div>
                <strong>{item.name}</strong>
                <p className="muted" style={{ margin: "2px 0 0" }}>
                  ₹{item.price}/{item.unit} · {item.sellerName}
                </p>
              </div>
              <div className="row" style={{ gap: 14 }}>
                <div className="row" style={{ gap: 8 }}>
                  <button className="btn btn-ghost" style={{ padding: "4px 12px" }} onClick={() => updateQty(item.id, item.qty - 1)}>−</button>
                  <span className="mono">{item.qty}</span>
                  <button className="btn btn-ghost" style={{ padding: "4px 12px" }} onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
                </div>
                <span className="mono" style={{ minWidth: 70, textAlign: "right" }}>₹{item.price * item.qty}</span>
                <button
                  onClick={() => removeFromCart(item.id)}
                  style={{ background: "none", border: "none", color: "var(--color-danger)", fontSize: "0.85rem" }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="row-between" style={{ marginTop: 24 }}>
          <span className="muted">Subtotal</span>
          <span className="stat-num">₹{total}</span>
        </div>

        <button className="btn btn-gold btn-block" style={{ marginTop: 20 }} onClick={() => navigate("/checkout")}>
          Proceed to checkout
        </button>
      </div>
    </div>
  );
}
