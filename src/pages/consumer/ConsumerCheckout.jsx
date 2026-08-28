import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, CreditCard, MapPin } from "lucide-react"
import { useAuth } from "../../context/AuthContext"
import { useCart } from "../../context/CartContext"
import { Button } from "../../components/ui/Button"
import { Card, CardContent } from "../../components/ui/Card"
import { Input } from "../../components/ui/Input"
import * as orderService from "../../services/orderService"
import { formatCurrency } from "../../utils/format"

export default function ConsumerCheckout() {
  const { user } = useAuth()
  const cart = useCart()
  const navigate = useNavigate()
  const defaultAddress = user.addresses?.find((address) => address.isDefault)
  const [address, setAddress] = useState(defaultAddress?.line1 || user.location || "")
  const [paymentMethod, setPaymentMethod] = useState("UPI")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    if (!address.trim()) {
      setError("Delivery address is required")
      return
    }
    setIsSubmitting(true)
    setError("")
    try {
      const itemsByFarmer = cart.items.reduce((groups, item) => {
        const key = item.farmerId || "unknown"
        groups[key] = groups[key] || []
        groups[key].push(item)
        return groups
      }, {})
      const orders = await Promise.all(
        Object.values(itemsByFarmer).map((items) => {
          const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
          const deliveryFee = subtotal > 500 ? 0 : 30
          return orderService.createOrder({
            buyerId: user.id,
            buyerName: user.name,
            buyerType: user.role,
            farmerId: items[0].farmerId,
            farmerName: items[0].farmerName,
            items,
            subtotal,
            deliveryFee,
            total: subtotal + deliveryFee,
            paymentMethod,
            address: address.trim(),
          })
        }),
      )
      cart.clearCart()
      navigate(`/consumer/orders/${orders[0].id}/confirmation`, { state: { orders } })
    } catch (err) {
      setError(err.message || "Unable to place order")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (cart.items.length === 0) {
    navigate("/consumer/cart", { replace: true })
    return null
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 lg:px-8">
      <button type="button" onClick={() => navigate("/consumer/cart")} className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to cart
      </button>
      <h1 className="font-heading text-2xl font-semibold text-foreground">Checkout</h1>
      <p className="mt-1 text-sm text-muted-foreground">Confirm delivery and payment details.</p>
      <form onSubmit={handleSubmit} className="mt-6 grid gap-5 lg:grid-cols-[1fr_300px]">
        <Card><CardContent className="flex flex-col gap-5">
          <div><h2 className="font-heading text-base font-semibold text-foreground">Delivery address</h2><Input className="mt-3" icon={MapPin} value={address} onChange={(event) => setAddress(event.target.value)} placeholder="House, street, city" error={error} /></div>
          <div><h2 className="font-heading text-base font-semibold text-foreground">Payment method</h2><div className="mt-3 grid gap-2 sm:grid-cols-3">{["UPI", "Card", "Cash on Delivery"].map((method) => <label key={method} className={`flex cursor-pointer items-center gap-2 rounded-lg border p-3 text-sm ${paymentMethod === method ? "border-primary bg-primary/5" : "border-border"}`}><input type="radio" name="payment" value={method} checked={paymentMethod === method} onChange={(event) => setPaymentMethod(event.target.value)} /><CreditCard className="h-4 w-4 text-muted-foreground" /> {method}</label>)}</div></div>
        </CardContent></Card>
        <Card><CardContent><h2 className="font-heading text-base font-semibold text-foreground">Order summary</h2><div className="mt-4 space-y-2 text-sm"><div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>{formatCurrency(cart.subtotal)}</span></div><div className="flex justify-between text-muted-foreground"><span>Delivery</span><span>{cart.deliveryFee ? formatCurrency(cart.deliveryFee) : "Free"}</span></div><div className="flex justify-between border-t border-border pt-2 font-heading text-base font-semibold text-foreground"><span>Total</span><span>{formatCurrency(cart.total)}</span></div></div><Button type="submit" isLoading={isSubmitting} className="mt-5 w-full">Place order</Button></CardContent></Card>
      </form>
    </div>
  )
}