import { useEffect, useState } from "react";
import { fetchMyProducts, createProduct, updateProduct, deleteProduct } from "../../api/products";

const CATEGORY_OPTIONS = ["vegetables", "fruits", "grains", "dairy", "other"];
const UNIT_OPTIONS = ["kg", "liter", "dozen", "unit", "bundle"];

const EMPTY_FORM = { name: "", category: "vegetables", unit: "kg", price: "", stock: "" };

export default function ListProduce() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  function load() {
    fetchMyProducts()
      .then(setProducts)
      .finally(() => setLoading(false));
  }

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function startEdit(product) {
    setEditingId(product.id);
    setForm({ name: product.name, category: product.category, unit: product.unit, price: product.price, stock: product.stock });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      ...form,
      category: String(form.category).trim().toLowerCase(),
      unit: String(form.unit).trim().toLowerCase(),
      price: Number(form.price),
      stock: Number(form.stock),
    };

    if (editingId) {
      const updated = await updateProduct(editingId, payload);
      setProducts((prev) => prev.map((p) => (p.id === editingId ? { ...p, ...updated } : p)));
    } else {
      const created = await createProduct(payload);
      setProducts((prev) => [...prev, created]);
    }
    setForm(EMPTY_FORM);
    setEditingId(null);
  }

  async function handleDelete(id) {
    await deleteProduct(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="main">
      <div className="container">
        <span className="eyebrow">Manage stock</span>
        <h1 style={{ fontSize: "1.8rem", marginBottom: 24 }}>List & edit produce</h1>

        <div className="grid" style={{ gridTemplateColumns: "340px 1fr", alignItems: "start" }}>
          <form className="card" onSubmit={handleSubmit}>
            <h3 style={{ fontSize: "1rem", marginBottom: 14 }}>{editingId ? "Edit listing" : "New listing"}</h3>
            <div className="field">
              <label>Produce name</label>
              <input value={form.name} onChange={(e) => update("name", e.target.value)} required />
            </div>
            <div className="field">
              <label>Category</label>
              <select value={form.category} onChange={(e) => update("category", e.target.value)} required>
                {CATEGORY_OPTIONS.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div className="row" style={{ gap: 10 }}>
              <div className="field" style={{ flex: 1 }}>
                <label>Unit</label>
                <select value={form.unit} onChange={(e) => update("unit", e.target.value)}>
                  {UNIT_OPTIONS.map((unit) => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>
              <div className="field" style={{ flex: 1 }}>
                <label>Price (₹)</label>
                <input type="number" min="0" value={form.price} onChange={(e) => update("price", e.target.value)} required />
              </div>
            </div>
            <div className="field">
              <label>Stock quantity</label>
              <input type="number" min="0" value={form.stock} onChange={(e) => update("stock", e.target.value)} required />
            </div>
            <button className="btn btn-clay btn-block">{editingId ? "Save changes" : "Add listing"}</button>
            {editingId && (
              <button
                type="button"
                className="btn btn-ghost btn-block"
                style={{ marginTop: 8 }}
                onClick={() => {
                  setEditingId(null);
                  setForm(EMPTY_FORM);
                }}
              >
                Cancel edit
              </button>
            )}
          </form>

          <div>
            {loading ? (
              <p className="muted">Loading your listings…</p>
            ) : products.length === 0 ? (
              <div className="empty-state">
                <h3>No listings yet</h3>
                <p className="muted">Add your first product using the form.</p>
              </div>
            ) : (
              <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                {products.map((p, idx) => (
                  <div
                    key={p.id}
                    className="row-between"
                    style={{ padding: "14px 20px", borderBottom: idx < products.length - 1 ? "1px solid var(--color-line)" : "none" }}
                  >
                    <div>
                      <strong>{p.name}</strong>
                      <p className="muted" style={{ margin: "2px 0 0" }}>
                        ₹{p.price}/{p.unit} · {p.stock} in stock
                      </p>
                    </div>
                    <div className="row" style={{ gap: 10 }}>
                      <button className="btn btn-ghost" style={{ padding: "6px 14px" }} onClick={() => startEdit(p)}>Edit</button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        style={{ background: "none", border: "none", color: "var(--color-danger)", fontSize: "0.85rem" }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
