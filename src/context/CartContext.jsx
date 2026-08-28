import { createContext, useContext, useState, useCallback, useMemo, useEffect } from "react"
import { readStorage, writeStorage } from "@/utils/storage"

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => readStorage("cart", []))

  useEffect(() => {
    writeStorage("cart", items)
  }, [items])

  const addItem = useCallback((product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === product.id)
      if (existing) {
        const nextQuantity = Math.min(existing.quantity + quantity, product.quantity)
        return prev.map((i) =>
          i.productId === product.id ? { ...i, quantity: nextQuantity, maxQuantity: product.quantity } : i,
        )
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          image: product.image,
          price: product.price,
          unit: product.unit,
          farmerName: product.farmerName,
          farmerId: product.farmerId,
          maxQuantity: product.quantity,
          quantity: Math.min(quantity, product.quantity),
        },
      ]
    })
  }, [])

  const updateQuantity = useCallback((productId, quantity) => {
    setItems((prev) =>
      prev
        .map((i) =>
          i.productId === productId
            ? { ...i, quantity: Math.min(Math.max(1, quantity), i.maxQuantity ?? quantity) }
            : i,
        )
        .filter((i) => i.quantity > 0),
    )
  }, [])

  const removeItem = useCallback((productId) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId))
  }, [])

  const clearCart = useCallback(() => setItems([]), [])

  const subtotal = useMemo(() => items.reduce((sum, i) => sum + i.price * i.quantity, 0), [items])
  const deliveryFee = useMemo(() => (items.length === 0 ? 0 : subtotal > 500 ? 0 : 30), [items, subtotal])
  const total = subtotal + deliveryFee
  const itemCount = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items])

  const value = useMemo(
    () => ({
      items,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      subtotal,
      deliveryFee,
      total,
      itemCount,
    }),
    [items, addItem, updateQuantity, removeItem, clearCart, subtotal, deliveryFee, total, itemCount],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}
