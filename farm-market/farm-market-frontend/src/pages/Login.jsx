import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [params] = useSearchParams();
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [role, setRole] = useState(params.get("role") === "seller" ? "seller" : "customer");
  const [form, setForm] = useState({ username: "", password: "", email: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "register") {
        await register({ ...form, role });
        setMode("login");
        setError("Account created — log in below.");
      } else {
        const data = await login(form);
        navigate((data.role || role) === "seller" ? "/seller" : "/shop");
      }
    } catch (err) {
      // Handle validation errors from Django
      const data = err.response?.data;
      let errorMsg = "Something went wrong. Is the Django server running?";
      
      if (data?.detail) {
        errorMsg = data.detail;
      } else if (typeof data === "object" && data !== null) {
        // Handle validation errors (e.g., {"username": ["..."], "email": ["..."]})
        const firstError = Object.values(data)[0];
        if (Array.isArray(firstError)) {
          errorMsg = firstError[0];
        } else if (typeof firstError === "string") {
          errorMsg = firstError;
        }
      }
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="main">
      <div className="container" style={{ maxWidth: 420 }}>
        <div className="card">
          <span className="eyebrow">{role === "seller" ? "Seller account" : "Customer account"}</span>
          <h2 style={{ marginBottom: 4 }}>{mode === "login" ? "Log in" : "Create an account"}</h2>
          <p className="muted" style={{ marginBottom: 20 }}>
            {mode === "login" ? "Welcome back to Kisaan Direct." : "Set up your marketplace account."}
          </p>

          <div className="row" style={{ gap: 8, marginBottom: 20 }}>
            <button
              type="button"
              className={role === "customer" ? "btn btn-primary" : "btn btn-ghost"}
              onClick={() => setRole("customer")}
            >
              Customer
            </button>
            <button
              type="button"
              className={role === "seller" ? "btn btn-primary" : "btn btn-ghost"}
              onClick={() => setRole("seller")}
            >
              Seller
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>Username</label>
              <input value={form.username} onChange={(e) => update("username", e.target.value)} required />
            </div>
            {mode === "register" && (
              <div className="field">
                <label>Email</label>
                <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} required />
              </div>
            )}
            <div className="field">
              <label>Password</label>
              <input type="password" value={form.password} onChange={(e) => update("password", e.target.value)} required />
            </div>

            {error && <p style={{ color: "var(--color-danger)", fontSize: "0.88rem" }}>{error}</p>}

            <button className="btn btn-primary btn-block" disabled={loading}>
              {loading ? "Please wait…" : mode === "login" ? "Log in" : "Create account"}
            </button>
          </form>

          <p className="muted" style={{ textAlign: "center", marginTop: 16 }}>
            {mode === "login" ? "New here? " : "Already registered? "}
            <button
              type="button"
              onClick={() => setMode(mode === "login" ? "register" : "login")}
              style={{ background: "none", border: "none", color: "var(--color-clay)", fontWeight: 600, padding: 0 }}
            >
              {mode === "login" ? "Create an account" : "Log in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
