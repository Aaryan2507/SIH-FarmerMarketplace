import { useEffect, useState } from "react";
import { fetchMyProducts, fetchDemandStats } from "../../api/products";

export default function StockDemand() {
  const [products, setProducts] = useState([]);
  const [demand, setDemand] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchMyProducts(), fetchDemandStats()]).then(([p, d]) => {
      setProducts(p);
      setDemand(d);
      setLoading(false);
    });
  }, []);

  const demandByProduct = Object.fromEntries(demand.map((d) => [d.productId, d.unitsRequested]));

  return (
    <div className="main">
      <div className="container">
        <span className="eyebrow">Plan ahead</span>
        <h1 style={{ fontSize: "1.8rem", marginBottom: 24 }}>Stock vs. demand</h1>

        {loading ? (
          <p className="muted">Crunching numbers…</p>
        ) : (
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <div className="row-between" style={{ padding: "12px 20px", background: "var(--color-bg-soft)" }}>
              <span className="muted" style={{ flex: 2 }}>Produce</span>
              <span className="muted" style={{ flex: 1, textAlign: "right" }}>In stock</span>
              <span className="muted" style={{ flex: 1, textAlign: "right" }}>Units requested (30d)</span>
              <span className="muted" style={{ flex: 1, textAlign: "right" }}>Status</span>
            </div>
            {products.map((p, idx) => {
              const requested = demandByProduct[p.id] ?? 0;
              const shortfall = requested > p.stock;
              return (
                <div
                  key={p.id}
                  className="row-between"
                  style={{ padding: "14px 20px", borderTop: "1px solid var(--color-line)" }}
                >
                  <strong style={{ flex: 2 }}>{p.name}</strong>
                  <span className="mono" style={{ flex: 1, textAlign: "right" }}>{p.stock}</span>
                  <span className="mono" style={{ flex: 1, textAlign: "right" }}>{requested}</span>
                  <span style={{ flex: 1, textAlign: "right" }}>
                    {shortfall ? (
                      <span className="pill pill-low">Restock soon</span>
                    ) : (
                      <span className="pill pill-ok">Healthy</span>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
