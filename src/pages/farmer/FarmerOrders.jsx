import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { ShoppingCart, ChevronRight } from "lucide-react"
import { useAuth } from "../../context/AuthContext"
import { Skeleton } from "../../components/ui/Skeleton"
import { EmptyState } from "../../components/ui/EmptyState"
import { Tabs } from "../../components/ui/Tabs"
import { OrderStatusBadge } from "../../components/orders/OrderStatusBadge"
import * as orderService from "../../services/orderService"
import { formatCurrency, formatDate } from "../../utils/format"

const TABS = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "processing", label: "Processing" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
]

export default function FarmerOrders() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [status, setStatus] = useState("all")

  useEffect(() => {
    let active = true
    setIsLoading(true)
    orderService.listOrdersForFarmer(user.id, status).then((list) => {
      if (active) {
        setOrders(list)
        setIsLoading(false)
      }
    })
    return () => {
      active = false
    }
  }, [user.id, status])

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 lg:px-8">
      <h1 className="font-heading text-2xl font-semibold text-foreground">Orders</h1>
      <p className="mt-1 text-sm text-muted-foreground">Track and fulfill orders placed by consumers and wholesalers.</p>

      <div className="mt-5">
        <Tabs tabs={TABS} value={status} onChange={setStatus} />
      </div>

      <div className="mt-5">
        {isLoading ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-xl" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <EmptyState icon={ShoppingCart} title="No orders found" description="Orders matching this filter will appear here." />
        ) : (
          <div className="flex flex-col gap-3">
            {orders.map((order) => (
              <Link
                key={order.id}
                to={`/farmer/orders/${order.id}`}
                className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-4 shadow-soft transition-colors hover:border-primary/30"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-heading text-sm font-semibold text-foreground">{order.id}</p>
                    <OrderStatusBadge status={order.status} />
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {order.buyerName} · {order.buyerType === "wholesaler" ? "Wholesaler" : "Consumer"}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {order.items.length} item(s) · {formatDate(order.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-heading text-base font-semibold text-foreground">{formatCurrency(order.total)}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
