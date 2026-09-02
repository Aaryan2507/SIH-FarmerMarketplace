import api from "./axios";

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== "false";

// Expected Django URLs:
//   POST /api/orders/checkout/     {items: [{productId, qty}], ...} -> order + payment intent
//   GET  /api/orders/mine/         -> customer's own order history
//   GET  /api/orders/earnings/     -> seller's earnings summary (sum of their sold items)

export async function checkout({ items, paymentMethod }) {
  if (USE_MOCKS) {
    return new Promise((resolve) =>
      setTimeout(
        () =>
          resolve({
            orderId: crypto.randomUUID(),
            status: "confirmed",
            total: items.reduce((sum, i) => sum + i.price * i.qty, 0),
            paymentMethod,
          }),
        500
      )
    );
  }
  // Transform frontend format (productId, qty) to backend format (product_id, quantity)
  const transformedItems = items.map((item) => ({
    product_id: item.productId,
    quantity: item.qty,
  }));
  const { data } = await api.post("/orders/checkout/", { items: transformedItems });
  // Transform backend response format (id, total_price) to frontend format (orderId, total)
  return {
    orderId: data.id,
    status: data.status,
    total: parseFloat(data.total_price),
    paymentMethod,
  };
}

export async function fetchMyOrders() {
  if (USE_MOCKS) return [];
  const { data } = await api.get("/orders/my_orders/");
  // API returns paginated response
  return data.results || data;
}

export async function fetchEarnings() {
  if (USE_MOCKS) {
    return {
      totalEarnings: 18420,
      pendingPayout: 3200,
      last30Days: [1200, 900, 1500, 2000, 1100, 1800, 2400, 1700, 1600, 2100],
    };
  }
  const { data } = await api.get("/orders/earnings/");
  // Transform backend format to frontend format
  // Backend returns: total_earnings, total_orders, total_items_sold, products_sold
  // Frontend expects: totalEarnings, pendingPayout, last30Days
  return {
    totalEarnings: data.total_earnings,
    pendingPayout: 0, // Backend doesn't track pending payouts
    last30Days: data.products_sold
      ? data.products_sold.map((p) => p.revenue || 0).slice(0, 10)
      : [data.total_earnings],
  };
}
