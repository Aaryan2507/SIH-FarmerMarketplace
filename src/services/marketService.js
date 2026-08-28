import { simulateLatency } from "./api"
import { mockMarketPrices } from "@/data/mockMarketPrices"

export async function listMarketPrices() {
  await simulateLatency()
  return mockMarketPrices
}

export async function getMarketPrice(productId) {
  await simulateLatency()
  return mockMarketPrices.find((m) => m.productId === productId) || null
}
