// Simplified demand signals shown to farmers to help decide what to grow/stock.

export const mockDemand = [
  { productName: "Tomatoes", category: "vegetables", demandLevel: "high", trend: "up", weeklySearches: 1240, suggestion: "Stock up — demand rising 18% this week" },
  { productName: "Onions", category: "vegetables", demandLevel: "high", trend: "up", weeklySearches: 1180, suggestion: "Strong local demand, prices trending upward" },
  { productName: "Potatoes", category: "vegetables", demandLevel: "medium", trend: "flat", weeklySearches: 860, suggestion: "Stable demand, maintain current stock levels" },
  { productName: "Basmati Rice", category: "grains", demandLevel: "high", trend: "up", weeklySearches: 990, suggestion: "Wholesalers actively sourcing — consider bulk listing" },
  { productName: "Wheat", category: "grains", demandLevel: "low", trend: "down", weeklySearches: 310, suggestion: "Demand softening, hold off on new stock" },
  { productName: "Alphonso Mangoes", category: "fruits", demandLevel: "high", trend: "up", weeklySearches: 1420, suggestion: "Peak season — highest demand of the year" },
  { productName: "Cauliflower", category: "vegetables", demandLevel: "medium", trend: "up", weeklySearches: 540, suggestion: "Slight increase, good time to list more" },
  { productName: "Toor Dal", category: "pulses", demandLevel: "medium", trend: "flat", weeklySearches: 610, suggestion: "Consistent demand from local households" },
]

export function getTopDemandProducts(limit = 5) {
  const order = { high: 0, medium: 1, low: 2 }
  return [...mockDemand].sort((a, b) => order[a.demandLevel] - order[b.demandLevel]).slice(0, limit)
}
