import { simulateLatency, ApiError } from "./api"
import { mockOrders } from "@/data/mockOrders"
import { readStorage, writeStorage } from "@/utils/storage"

const CUSTOM_KEY = "customOrders"

function loadCustomOrders() {
  return readStorage(CUSTOM_KEY, [])
}

function saveCustomOrders(list) {
  writeStorage(CUSTOM_KEY, list)
}

function allOrders() {
  return [...loadCustomOrders(), ...mockOrders]
}

export async function listOrdersForFarmer(farmerId, status) {
  await simulateLatency()
  let items = allOrders().filter((o) => o.farmerId === farmerId)
  if (status && status !== "all") items = items.filter((o) => o.status === status)
  return items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

export async function listOrdersForBuyer(buyerId, status) {
  await simulateLatency()
  let items = allOrders().filter((o) => o.buyerId === buyerId)
  if (status && status !== "all") items = items.filter((o) => o.status === status)
  return items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

export async function getOrder(id) {
  await simulateLatency()
  const order = allOrders().find((o) => o.id === id)
  if (!order) throw new ApiError("Order not found.", 404)
  return order
}

export async function createOrder(payload) {
  await simulateLatency(500, 900)
  const order = {
    id: `ORD-${Math.floor(10000 + Math.random() * 89999)}`,
    status: "pending",
    createdAt: new Date().toISOString(),
    estimatedDelivery: new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10),
    ...payload,
  }
  const list = loadCustomOrders()
  list.unshift(order)
  saveCustomOrders(list)
  return order
}

export async function updateOrderStatus(id, status) {
  await simulateLatency(300, 500)
  const list = loadCustomOrders()
  const idx = list.findIndex((o) => o.id === id)
  if (idx !== -1) {
    list[idx] = { ...list[idx], status }
    saveCustomOrders(list)
    return list[idx]
  }
  // For seed demo orders we can't persist, but return an optimistic object.
  const seed = mockOrders.find((o) => o.id === id)
  if (!seed) throw new ApiError("Order not found.", 404)
  return { ...seed, status }
}
