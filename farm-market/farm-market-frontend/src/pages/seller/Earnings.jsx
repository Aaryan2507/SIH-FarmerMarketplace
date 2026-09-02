import { useEffect, useState } from "react";
import { fetchEarnings } from "../../api/orders";

export default function Earnings() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchEarnings().then(setData);
  }, []);

  if (!data) return <div className="main container"><p className="muted">Loading earnings…</p></div>;

  const max = Math.max(...data.last30Days);

  return (
    <div className="main">
      <div className="container">
        <span className="eyebrow">Payouts</span>
        <h1 style={{ fontSize: "1.8rem", marginBottom: 24 }}>Earnings</h1>

        <div className="grid grid-2" style={{ marginBottom: 30 }}>
          <div className="card">
            <p className="muted" style={{ marginBottom: 6 }}>Total earnings</p>
            <span className="stat-num">₹{data.totalEarnings}</span>
          </div>
          <div className="card">
            <p className="muted" style={{ marginBottom: 6 }}>Pending payout</p>
            <span className="stat-num" style={{ color: "var(--color-clay)" }}>₹{data.pendingPayout}</span>
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontSize: "1rem", marginBottom: 16 }}>Last 10 orders</h3>
          <div className="row" style={{ gap: 8, alignItems: "flex-end", height: 140 }}>
            {data.last30Days.map((val, idx) => (
              <div
                key={idx}
                title={`₹${val}`}
                style={{
                  flex: 1,
                  height: `${(val / max) * 100}%`,
                  background: "var(--color-gold)",
                  borderRadius: "4px 4px 0 0",
                  minHeight: 6,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
