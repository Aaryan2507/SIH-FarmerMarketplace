import { simulateLatency } from "./api"
import { mockDemand } from "@/data/mockDemand"

export async function listDemandInsights() {
  await simulateLatency()
  return mockDemand
}
