import { Link } from "react-router-dom"
import { Star, MapPin, Plus } from "lucide-react"
import { formatCurrency } from "../../utils/format"
import { StockStatusBadge } from "./StockStatusBadge"
import { useCart } from "../../context/CartContext"
import { useAuth } from "../../context/AuthContext"

export function ProductCard({ product }) {
  const { role } = useAuth()
  const cart = useCart()
  const isConsumer = role === "consumer"
  const outOfStock = product.stockStatus === "out-of-stock"
  const productPath = isConsumer ? `/consumer/products/${product.id}` : `/${role || "consumer"}/marketplace/${product.id}`

  function handleAdd(e) {
    e.preventDefault()
    e.stopPropagation()
    if (outOfStock) return
    cart?.addItem(product, product.minOrderQty || 1)
  }

  return (
    <Link
      to={productPath}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-soft transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        <img
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          crossOrigin="anonymous"
          className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
        />
        <div className="absolute left-2 top-2">
          <StockStatusBadge status={product.stockStatus} />
        </div>
        {isConsumer && (
          <button
            type="button"
            onClick={handleAdd}
            disabled={outOfStock}
            aria-label={`Add ${product.name} to cart`}
            className="absolute bottom-2 right-2 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-soft transition-transform hover:scale-105 disabled:pointer-events-none disabled:opacity-40"
          >
            <Plus className="h-4 w-4" />
          </button>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-3.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 font-heading text-sm font-semibold text-foreground">{product.name}</h3>
          {product.rating > 0 && (
            <span className="flex items-center gap-0.5 text-xs font-medium text-foreground shrink-0">
              <Star className="h-3 w-3 fill-accent text-accent" />
              {product.rating.toFixed(1)}
            </span>
          )}
        </div>
        <p className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3 shrink-0" />
          <span className="line-clamp-1">{product.location}</span>
        </p>
        <div className="mt-1 flex items-baseline gap-1">
          <span className="font-heading text-base font-semibold text-foreground">
            {formatCurrency(product.price)}
          </span>
          <span className="text-xs text-muted-foreground">/{product.unit}</span>
        </div>
        <p className="text-xs text-muted-foreground">by {product.farmerName}</p>
      </div>
    </Link>
  )
}
