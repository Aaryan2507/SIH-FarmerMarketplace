import { Link, useNavigate } from "react-router-dom"
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react"
import { useCart } from "../../context/CartContext"
import { Button } from "../../components/ui/Button"
import { EmptyState } from "../../components/ui/EmptyState"
import { formatCurrency } from "../../utils/format"

export default function ConsumerCart() {
  const cart = useCart()
  const navigate = useNavigate()
  const { items, subtotal, deliveryFee, total } = cart

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-6 lg:px-8">
        <h1 className="font-heading text-xl font-semibold text-foreground">Your Cart</h1>
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Browse the marketplace and add fresh produce from verified farmers."
          actionLabel="Browse marketplace"
          onAction={() => navigate("/consumer/marketplace")}
          className="mt-6"
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 lg:px-8">
      <h1 className="font-heading text-xl font-semibold text-foreground">Your Cart</h1>
      <p className="mt-1 text-sm text-muted-foreground">{items.length} item(s) from local farmers</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <div
              key={item.productId}
              className="flex gap-3 rounded-xl border border-border bg-card p-3 shadow-soft sm:gap-4 sm:p-4"
            >
              <Link to={`/consumer/marketplace/${item.productId}`} className="shrink-0">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  crossOrigin="anonymous"
                  className="h-20 w-20 rounded-lg object-cover sm:h-24 sm:w-24"
                />
              </Link>
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Link to={`/consumer/marketplace/${item.productId}`}>
                      <h3 className="font-heading text-sm font-semibold text-foreground hover:text-primary sm:text-base">
                        {item.name}
                      </h3>
                    </Link>
                    <p className="text-xs text-muted-foreground">by {item.farmerName}</p>
                  </div>
                  <button
                    onClick={() => cart.removeItem(item.productId)}
                    aria-label={`Remove ${item.name}`}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center rounded-lg border border-border">
                    <button
                      onClick={() => cart.updateQuantity(item.productId, item.quantity - 1)}
                      className="flex h-8 w-8 items-center justify-center text-foreground"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-16 text-center text-xs font-medium text-foreground">
                      {item.quantity} {item.unit}
                    </span>
                    <button
                      onClick={() => cart.updateQuantity(item.productId, item.quantity + 1)}
                      disabled={item.maxQuantity != null && item.quantity >= item.maxQuantity}
                      className="flex h-8 w-8 items-center justify-center text-foreground disabled:opacity-40"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <p className="font-heading text-sm font-semibold text-foreground">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="h-fit rounded-xl border border-border bg-card p-5 shadow-soft">
          <h2 className="font-heading text-base font-semibold text-foreground">Order Summary</h2>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span className="text-foreground">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Delivery fee</span>
              <span className="text-foreground">{deliveryFee === 0 ? "Free" : formatCurrency(deliveryFee)}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-2 font-heading text-base font-semibold text-foreground">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
          <Button className="mt-5 w-full gap-2" onClick={() => navigate("/consumer/checkout")}>
            Proceed to Checkout <ArrowRight className="h-4 w-4" />
          </Button>
          <Link
            to="/consumer/marketplace"
            className="mt-3 block text-center text-sm font-medium text-primary hover:underline"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
