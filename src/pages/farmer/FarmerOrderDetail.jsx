import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, MapPin, User, CreditCard } from "lucide-react"
import { Card, CardContent } from "../../components/ui/Card"
import { Button } from "../../components/ui/Button"
import { LoadingSpinner } from "../../components/ui/LoadingSpinner"
import { OrderStatusBadge } from "../../components/orders/OrderStatusBadge"
import * as orderService from "../../services/orderService"
import { formatCurrency, formatDate } from "../../utils/format"

const NEXT_STATUS = {
  pending: "confirmed",
  confirmed: "processing",
  processing: "completed",
}

const NEXT_LABEL = {
  pending: "Confirm order",
  confirmed: "Mark as processing",
  processing: "Mark as completed",
}

export default function FarmerOrderDetail() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    let active = true
    orderService.getOrder(orderId).then((o) => {
      if (active) {
        setOrder(o)
        setIsLoading(false)
      }
    })
    return () => {
      active = false
    }
  }, [orderId])

  async function handleStatusUpdate(next) {
    setIsUpdating(true)
    try {
      const updated = await orderService.updateOrderStatus(orderId, next)
      setOrder(updated)
    } finally {
      setIsUpdating(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner size={32} />
      </div>
    )
  }

  if (!order) return null

  const nextStatus = NEXT_STATUS[order.status]

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 lg:px-8">
      <button
        type="button"
        onClick={() => navigate("/farmer/orders")}
        className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to orders
      </button>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-foreground">{order.id}</h1>
          <p className="mt-1 text-sm text-muted-foreground">Placed on {formatDate(order.createdAt, { withTime: true })}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <Card className="mt-5">
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="flex items-start gap-3">
            <User className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Buyer</p>
              <p className="text-sm font-medium text-foreground">{order.buyerName}</p>
              <p className="text-xs capitalize text-muted-foreground">{order.buyerType}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CreditCard className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Payment method</p>
              <p className="text-sm font-medium text-foreground">{order.paymentMethod}</p>
            </div>
          </div>
          <div className="flex items-start gap-3 sm:col-span-2">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Delivery address</p>
              <p className="text-sm font-medium text-foreground">{order.address}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-5">
        <CardContent>
          <h2 className="font-heading text-base font-semibold text-foreground">Items</h2>
          <div className="mt-3 flex flex-col divide-y divide-border">
            {order.items.map((item) => (
              <div key={item.productId} className="flex items-center justify-between gap-3 py-3 first:pt-0">
                <div>
                  <p className="text-sm font-medium text-foreground">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.quantity} {item.unit} × {formatCurrency(item.price)}
                  </p>
                </div>
                <span className="text-sm font-semibold text-foreground">{formatCurrency(item.quantity * item.price)}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex flex-col gap-1.5 border-t border-border pt-3 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Delivery fee</span>
              <span>{formatCurrency(order.deliveryFee)}</span>
            </div>
            <div className="flex justify-between font-heading text-base font-semibold text-foreground">
              <span>Total</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {nextStatus && order.status !== "cancelled" && (
        <div className="mt-5 flex flex-wrap justify-end gap-3">
          <Button variant="secondary" disabled={isUpdating} onClick={() => handleStatusUpdate("cancelled")}>
            Cancel order
          </Button>
          <Button isLoading={isUpdating} onClick={() => handleStatusUpdate(nextStatus)}>
            {NEXT_LABEL[order.status]}
          </Button>
        </div>
      )}
    </div>
  )
}
