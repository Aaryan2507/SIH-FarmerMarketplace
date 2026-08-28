import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, Star, MapPin, Calendar, Minus, Plus, ShoppingCart, ShieldCheck } from "lucide-react"
import { Button } from "../../components/ui/Button"
import { Skeleton } from "../../components/ui/Skeleton"
import { StockStatusBadge } from "../../components/product/StockStatusBadge"
import { useCart } from "../../context/CartContext"
import * as productService from "../../services/productService"
import { formatCurrency, formatDate } from "../../utils/format"

export default function ConsumerProductDetail() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const cart = useCart()
  const [product, setProduct] = useState(null)
  const [qty, setQty] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    productService
      .getProduct(productId)
      .then((p) => {
        setProduct(p)
        setQty(p.minOrderQty || 1)
      })
      .finally(() => setIsLoading(false))
  }, [productId])

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2">
          <Skeleton className="aspect-square rounded-xl" />
          <div className="space-y-3">
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) return null

  const outOfStock = product.stockStatus === "out-of-stock"
  const step = product.minOrderQty || 1

  function handleAddToCart() {
    cart.addItem(product, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  function handleBuyNow() {
    cart.addItem(product, qty)
    navigate("/consumer/cart")
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 lg:px-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div className="grid gap-8 sm:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            crossOrigin="anonymous"
            className="h-full w-full object-cover"
          />
          <div className="absolute left-3 top-3">
            <StockStatusBadge status={product.stockStatus} />
          </div>
        </div>

        <div className="flex flex-col">
          <h1 className="font-heading text-2xl font-semibold text-foreground text-balance">{product.name}</h1>
          <div className="mt-2 flex items-center gap-3 text-sm text-muted-foreground">
            {product.rating > 0 && (
              <span className="flex items-center gap-1 font-medium text-foreground">
                <Star className="h-3.5 w-3.5 fill-accent text-accent" /> {product.rating.toFixed(1)}
              </span>
            )}
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" /> {product.location}
            </span>
          </div>

          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-heading text-3xl font-semibold text-foreground">
              {formatCurrency(product.price)}
            </span>
            <span className="text-sm text-muted-foreground">/{product.unit}</span>
          </div>
          {product.bulkPrice && (
            <p className="mt-1 text-xs text-accent-foreground/80">
              Bulk price {formatCurrency(product.bulkPrice)}/{product.unit} for {product.minOrderQty}+ {product.unit}
            </p>
          )}

          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{product.description}</p>

          <div className="mt-4 flex flex-wrap gap-4 text-sm text-foreground">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-primary" /> {product.freshness}
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-primary" /> Sold by {product.farmerName}
            </span>
          </div>

          <div className="mt-6 rounded-xl border border-border bg-card p-4">
            <p className="text-xs font-medium text-muted-foreground">
              Minimum order: {product.minOrderQty} {product.unit}
            </p>
            <div className="mt-3 flex items-center gap-4">
              <div className="flex items-center rounded-lg border border-border">
                <button
                  onClick={() => setQty((q) => Math.max(step, q - step))}
                  disabled={outOfStock}
                  className="flex h-10 w-10 items-center justify-center text-foreground disabled:opacity-40"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-14 text-center text-sm font-medium text-foreground">
                  {qty} {product.unit}
                </span>
                <button
                  onClick={() => setQty((q) => Math.min(product.quantity, q + step))}
                  disabled={outOfStock}
                  className="flex h-10 w-10 items-center justify-center text-foreground disabled:opacity-40"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <p className="text-sm font-medium text-foreground">Subtotal: {formatCurrency(qty * product.price)}</p>
            </div>

            <div className="mt-4 flex gap-3">
              <Button variant="secondary" className="flex-1 gap-2" onClick={handleAddToCart} disabled={outOfStock}>
                <ShoppingCart className="h-4 w-4" /> {added ? "Added!" : "Add to Cart"}
              </Button>
              <Button className="flex-1" onClick={handleBuyNow} disabled={outOfStock}>
                Buy Now
              </Button>
            </div>
            {outOfStock && <p className="mt-2 text-xs text-destructive">This item is currently out of stock.</p>}
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            Last updated {formatDate(product.lastUpdated)} ·{" "}
            <Link to="/consumer/marketplace" className="text-primary hover:underline">
              Continue shopping
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
