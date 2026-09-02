import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const isOut = product.stock === 0;

  return (
    <div className="ticket">
      <div style={{ padding: "18px 18px 14px" }}>
        <div className="row-between" style={{ marginBottom: 6 }}>
          <span className="eyebrow">{product.category}</span>
          {isOut ? (
            <span className="pill pill-out">Sold out</span>
          ) : product.stock < 10 ? (
            <span className="pill pill-low">Low stock</span>
          ) : (
            <span className="pill pill-ok">In stock</span>
          )}
        </div>
        <h3 style={{ fontSize: "1.15rem", marginBottom: 2 }}>{product.name}</h3>
        <p className="muted" style={{ marginBottom: 10 }}>Grown by {product.sellerName}</p>
        <div className="row-between">
          <span className="mono" style={{ fontSize: "1.3rem", fontWeight: 500, color: "var(--color-clay)" }}>
            ₹{product.price}
            <span className="muted" style={{ fontSize: "0.8rem" }}>/{product.unit}</span>
          </span>
        </div>
      </div>
      <div className="ticket-perf" />
      <div style={{ padding: 14 }}>
        <button
          className="btn btn-gold btn-block"
          disabled={isOut}
          onClick={() => addToCart(product)}
        >
          {isOut ? "Unavailable" : "Add to cart"}
        </button>
      </div>
    </div>
  );
}
