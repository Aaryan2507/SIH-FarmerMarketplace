import { simulateLatency, ApiError } from "./api"
import { mockProducts, getProductById as findProduct } from "@/data/mockProducts"
import { readStorage, writeStorage } from "@/utils/storage"

const CUSTOM_KEY = "customProducts"

function loadCustomProducts() {
  return readStorage(CUSTOM_KEY, [])
}

function saveCustomProducts(list) {
  writeStorage(CUSTOM_KEY, list)
}

function allProducts() {
  return [...mockProducts, ...loadCustomProducts()]
}

export async function listProducts(filters = {}) {
  await simulateLatency()
  let items = allProducts()

  if (filters.category) {
    items = items.filter((p) => p.category === filters.category)
  }
  if (filters.search) {
    const q = filters.search.toLowerCase()
    items = items.filter(
      (p) => p.name.toLowerCase().includes(q) || p.farmerName.toLowerCase().includes(q),
    )
  }
  if (filters.location) {
    items = items.filter((p) => p.location.toLowerCase().includes(filters.location.toLowerCase()))
  }
  if (filters.maxPrice) {
    items = items.filter((p) => p.price <= Number(filters.maxPrice))
  }
  if (filters.inStockOnly) {
    items = items.filter((p) => p.stockStatus !== "out-of-stock")
  }
  if (filters.farmerId) {
    items = items.filter((p) => p.farmerId === filters.farmerId)
  }

  if (filters.sortBy === "price-asc") items.sort((a, b) => a.price - b.price)
  if (filters.sortBy === "price-desc") items.sort((a, b) => b.price - a.price)
  if (filters.sortBy === "rating") items.sort((a, b) => (b.rating || 0) - (a.rating || 0))
  if (filters.sortBy === "freshness") items.sort((a, b) => new Date(b.harvestDate) - new Date(a.harvestDate))

  return items
}

export async function getProduct(id) {
  await simulateLatency()
  const product = allProducts().find((p) => p.id === id) || findProduct(id)
  if (!product) {
    throw new ApiError("Product not found.", 404)
  }
  return product
}

export async function createProduct(payload) {
  await simulateLatency(400, 800)
  const list = loadCustomProducts()
  const product = {
    id: `p-custom-${Date.now()}`,
    stockStatus: Number(payload.quantity) === 0 ? "out-of-stock" : Number(payload.quantity) < 20 ? "low-stock" : "in-stock",
    rating: 0,
    lastUpdated: new Date().toISOString(),
    image: payload.image || "/images/products/tomatoes.png",
    ...payload,
    price: Number(payload.price),
    quantity: Number(payload.quantity),
    bulkPrice: payload.bulkPrice ? Number(payload.bulkPrice) : Math.round(Number(payload.price) * 0.85),
    minOrderQty: payload.minOrderQty ? Number(payload.minOrderQty) : 5,
  }
  list.push(product)
  saveCustomProducts(list)
  return product
}

export async function updateProduct(id, updates) {
  await simulateLatency(300, 600)
  const list = loadCustomProducts()
  const idx = list.findIndex((p) => p.id === id)
  if (idx === -1) {
    throw new ApiError("Cannot edit a demo seed product in this prototype. Try editing a product you added.", 400)
  }
  const updated = {
    ...list[idx],
    ...updates,
    lastUpdated: new Date().toISOString(),
  }
  if (updated.quantity !== undefined) {
    const qty = Number(updated.quantity)
    updated.quantity = qty
    updated.stockStatus = qty === 0 ? "out-of-stock" : qty < 20 ? "low-stock" : "in-stock"
  }
  list[idx] = updated
  saveCustomProducts(list)
  return updated
}

export async function deleteProduct(id) {
  await simulateLatency(300, 500)
  const list = loadCustomProducts()
  const next = list.filter((p) => p.id !== id)
  saveCustomProducts(next)
  return { success: true }
}

export function getCustomProductIds() {
  return loadCustomProducts().map((p) => p.id)
}
