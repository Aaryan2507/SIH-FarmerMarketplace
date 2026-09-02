import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { checkout } from "../../api/orders";

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const [method, setMethod] = useState("upi");
  const [placing, setPlacing] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [address, setAddress] = useState("");
  const navigate = useNavigate();

  async function handlePlaceOrder() {
    setPlacing(true);
    try {
      const order = await checkout({
        items: items.map((i) => ({ productId: i.id, qty: i.qty, price: i.price })),
        paymentMethod: method,
      });
      setConfirmedOrder(order);
      clearCart();
    } catch (err) {
      alert("Checkout failed — check the Django server / console for details.");
    } finally {
      setPlacing(false);
    }
  }

  if (confirmedOrder) {
    return (
      <div className="main">
        <div className="container" style={{ maxWidth: 480, textAlign: "center" }}>
          <div className="card">
            <span className="pill pill-ok" style={{ marginBottom: 14 }}>Order confirmed</span>
            <h2>Thanks — your order is in.</h2>
            <p className="muted">Order ID: <span className="mono">{confirmedOrder.orderId}</span></p>
            <p className="mono" style={{ fontSize: "1.4rem", color: "var(--color-clay)", margin: "10px 0 20px" }}>
              ₹{confirmedOrder.total}
            </p>
            <button className="btn btn-primary" onClick={() => navigate("/shop")}>Keep browsing</button>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="main">
      <div className="container" style={{ maxWidth: 520 }}>
        <h1 style={{ fontSize: "1.8rem", marginBottom: 20 }}>Checkout</h1>

        <div className="card" style={{ marginBottom: 18 }}>
          <div className="field">
            <label>Delivery address</label>
            <textarea rows={3} value={address} onChange={(e) => setAddress(e.target.value)} placeholder="House no, street, city, PIN" />
          </div>

          <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--color-ink-soft)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
            Payment method
          </label>
          <div className="row" style={{ gap: 8, marginTop: 8, marginBottom: 4 }}>
            {["upi", "card", "cod"].map((m) => (
              <button
                key={m}
                className={method === m ? "btn btn-primary" : "btn btn-ghost"}
                onClick={() => setMethod(m)}
                style={{ textTransform: "uppercase", fontSize: "0.8rem" }}
              >
                {m === "cod" ? "Cash on delivery" : m}
              </button>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="row-between">
            <span className="muted">Items ({items.length})</span>
            <span className="mono">₹{total}</span>
          </div>
          <div className="row-between" style={{ marginTop: 10 }}>
            <strong>Total</strong>
            <span className="stat-num" style={{ fontSize: "1.4rem" }}>₹{total}</span>
          </div>
        </div>

        <button className="btn btn-gold btn-block" style={{ marginTop: 20 }} disabled={placing || !address} onClick={handlePlaceOrder}>
          {placing ? "Placing order…" : `Pay ₹${total} & place order`}
        </button>
      </div>
    </div>
  );
}
