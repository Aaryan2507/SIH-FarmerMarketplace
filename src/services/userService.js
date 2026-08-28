import { simulateLatency } from "./api"
import { readStorage, writeStorage } from "@/utils/storage"

export async function updateProfile(updates) {
  await simulateLatency(300, 600)
  const current = readStorage("currentUser", null)
  const updated = { ...current, ...updates }
  writeStorage("currentUser", updated)
  return updated
}

export async function addAddress(address) {
  await simulateLatency(300, 500)
  const current = readStorage("currentUser", null)
  const addresses = [...(current?.addresses || [])]
  const newAddress = { id: `addr-${Date.now()}`, isDefault: addresses.length === 0, ...address }
  addresses.push(newAddress)
  const updated = { ...current, addresses }
  writeStorage("currentUser", updated)
  return updated
}
