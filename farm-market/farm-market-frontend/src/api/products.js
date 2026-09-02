import api from "./axios";
import { MOCK_PRODUCTS } from "../mockData";

/**
 * USE_MOCKS lets you build and demo the whole UI before Django even
 * exists, then flip one flag to start hitting the real API. This is
 * the easiest way to practice "interfacing" incrementally: get the
 * UI right against fake data, then swap the data source underneath it.
 *
 * Set VITE_USE_MOCKS=false in your .env once your Django endpoints
 * are ready and reachable.
 */
const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== "false";

// Expected Django URLs:
//   GET    /api/products/               -> list (all sellers, for customers)
//   GET    /api/products/mine/          -> list (current seller's own stock)
//   POST   /api/products/               -> create a listing
//   PATCH  /api/products/:id/           -> update stock/price/etc
//   DELETE /api/products/:id/           -> remove a listing
//   GET    /api/products/demand/        -> aggregated order-count per product

export async function fetchAllProducts() {
  if (USE_MOCKS) return delay(MOCK_PRODUCTS);
  const { data } = await api.get("/products/");
  // API returns paginated response {count, next, previous, results: [...]}
  return data.results || data;
}

export async function fetchMyProducts() {
  if (USE_MOCKS) return delay(MOCK_PRODUCTS.filter((p) => p.sellerId === "seller-1"));
  const { data } = await api.get("/products/my_products/");
  // API returns paginated response
  return data.results || data;
}

export async function createProduct(payload) {
  if (USE_MOCKS) return delay({ id: crypto.randomUUID(), ...payload });
  const { data } = await api.post("/products/", payload);
  return data;
}

export async function updateProduct(id, payload) {
  if (USE_MOCKS) return delay({ id, ...payload });
  const { data } = await api.patch(`/products/${id}/`, payload);
  return data;
}

export async function deleteProduct(id) {
  if (USE_MOCKS) return delay({ id });
  await api.delete(`/products/${id}/`);
}

export async function fetchDemandStats() {
  if (USE_MOCKS) {
    return delay(
      MOCK_PRODUCTS.map((p) => ({
        productId: p.id,
        name: p.name,
        unitsRequested: Math.floor(Math.random() * 40) + 5,
      }))
    );
  }
  // Get all products and extract demand info
  const { data } = await api.get("/products/");
  const products = data.results || data;
  return products.map((p) => ({
    productId: p.id,
    name: p.name,
    unitsRequested: p.demand ? p.demand.total_ordered : 0,
  }));
}

function delay(value, ms = 300) {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}
