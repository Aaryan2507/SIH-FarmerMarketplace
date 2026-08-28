// Simulated mandi (market) price trends per product over the last 7 data points.
// In production this would be sourced from the Django /api/market-prices/ endpoint.

function buildTrend(base, volatility) {
  const points = []
  let value = base
  for (let i = 6; i >= 0; i -= 1) {
    const drift = (Math.sin(i * 1.3) * volatility) + (Math.random() - 0.5) * volatility * 0.6
    value = Math.max(5, base + drift)
    const d = new Date()
    d.setDate(d.getDate() - i)
    points.push({ date: d.toISOString().slice(0, 10), price: Math.round(value) })
  }
  return points
}

export const mockMarketPrices = [
  {
    productId: "p-001",
    productName: "Vine-Ripened Tomatoes",
    market: "Nashik APMC Mandi",
    marketPrice: 35,
    farmerPrice: 32,
    trend: buildTrend(34, 5),
  },
  {
    productId: "p-002",
    productName: "Farm Fresh Potatoes",
    market: "Agra Mandi",
    marketPrice: 24,
    farmerPrice: 22,
    trend: buildTrend(23, 2.5),
  },
  {
    productId: "p-003",
    productName: "Red Onions",
    market: "Lasalgaon Mandi",
    marketPrice: 30,
    farmerPrice: 28,
    trend: buildTrend(29, 4),
  },
  {
    productId: "p-006",
    productName: "Basmati Rice (Unpolished)",
    market: "Amritsar Grain Market",
    marketPrice: 98,
    farmerPrice: 95,
    trend: buildTrend(96, 3),
  },
  {
    productId: "p-007",
    productName: "Durum Wheat",
    market: "Indore Grain Market",
    marketPrice: 27,
    farmerPrice: 26,
    trend: buildTrend(26.5, 1.5),
  },
  {
    productId: "p-008",
    productName: "Toor Dal (Split)",
    market: "Latur APMC Mandi",
    marketPrice: 138,
    farmerPrice: 130,
    trend: buildTrend(134, 6),
  },
]

export function getMarketPriceForProduct(productId) {
  return mockMarketPrices.find((m) => m.productId === productId) || null
}
