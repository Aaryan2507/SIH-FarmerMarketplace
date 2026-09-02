import { useEffect, useMemo, useState } from "react";
import { fetchAllProducts } from "../../api/products";
import ProductCard from "../../components/ProductCard";

export default function CustomerHome() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    fetchAllProducts()
      .then(setProducts)
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(
    () => ["All", ...new Set(products.map((p) => p.category))],
    [products]
  );

  const filtered = products.filter((p) => {
    const matchesQuery = p.name.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = category === "All" || p.category === category;
    return matchesQuery && matchesCategory;
  });

  return (
    <div className="main">
      <div className="container">
        <div className="row-between" style={{ marginBottom: 20, flexWrap: "wrap", gap: 14 }}>
          <div>
            <span className="eyebrow">Today's stock</span>
            <h1 style={{ fontSize: "1.8rem" }}>Browse fresh produce</h1>
          </div>
          <input
            placeholder="Search tomatoes, rice, dal…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              padding: "11px 16px",
              borderRadius: 999,
              border: "1.5px solid var(--color-line)",
              minWidth: 260,
              background: "var(--color-surface)",
            }}
          />
        </div>

        <div className="row" style={{ gap: 8, marginBottom: 26, flexWrap: "wrap" }}>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={c === category ? "btn btn-primary" : "btn btn-ghost"}
              style={{ padding: "7px 16px", fontSize: "0.85rem" }}
            >
              {c}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="muted">Loading stock…</p>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <h3>No produce matches that search</h3>
            <p className="muted">Try a different name or category.</p>
          </div>
        ) : (
          <div className="grid grid-3">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
