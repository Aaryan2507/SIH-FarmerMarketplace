import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Package, ShoppingCart, TrendingUp, IndianRupee, Plus, ArrowRight, AlertTriangle } from "lucide-react"
import { useAuth } from "../../context/AuthContext"
import { Card, CardContent } from "../../components/ui/Card"
import { Button } from "../../components/ui/Button"
import { Skeleton } from "../../components/ui/Skeleton"
import { OrderStatusBadge } from "../../components/orders/OrderStatusBadge"
import * as productService from "../../services/productService"
import * as orderService from "../../services/orderService"
import { getTopDemandProducts } from "../../data/mockDemand"
import { formatCurrency, formatDate } from "../../utils/format"

export default function FarmerDashboard() {
  const { user } = useAuth()
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let active = true
    async function load() {
      setIsLoading(true)
      const [productList, orderList] = await Promise.all([
        productService.listProducts({ farmerId: user.id }),
        orderService.listOrdersForFarmer(user.id),
      ])
      if (!active) return
      setProducts(productList)
      setOrders(orderList)
      setIsLoading(false)
    }
    load()
    return () => {
      active = false
    }
  }, [user.id])

  const lowStock = products.filter((p) => p.stockStatus === "low-stock" || p.stockStatus === "out-of-stock")
  const pendingOrders = orders.filter((o) => o.status === "pending" || o.status === "confirmed")
  const revenue = orders
    .filter((o) => o.status === "completed" || o.status === "processing")
    .reduce((sum, o) => sum + o.total, 0)
  const demandHighlights = getTopDemandProducts(3)

  const stats = [
    { label: "Active listings", value: products.length, icon: Package, color: "text-primary bg-primary/10" },
    { label: "Pending orders", value: pendingOrders.length, icon: ShoppingCart, color: "text-accent-foreground bg-accent/15" },
    { label: "Revenue (recent)", value: formatCurrency(revenue, { compact: true }), icon: IndianRupee, color: "text-success bg-success/10" },
    { label: "Low stock alerts", value: lowStock.length, icon: AlertTriangle, color: "text-destructive bg-destructive/10" },
  ]

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 lg:px-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-foreground">Welcome back, {user.name.split(" ")[0]}</h1>
          <p className="mt-1 text-sm text-muted-foreground">Here&apos;s what&apos;s happening with your farm today.</p>
        </div>
        <Button asChild>
          <Link to="/farmer/inventory/new">
            <Plus className="h-4 w-4" /> Add product
          </Link>
        </Button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)
          : stats.map(({ label, value, icon: Icon, color }) => (
              <Card key={label}>
                <CardContent className="flex items-center gap-4">
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-heading text-xl font-semibold text-foreground">{value}</p>
                    <p className="text-xs text-muted-foreground">{label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between p-5 pb-0">
            <h2 className="font-heading text-base font-semibold text-foreground">Recent orders</h2>
            <Link to="/farmer/orders" className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <CardContent>
            {isLoading ? (
              <div className="flex flex-col gap-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 rounded-lg" />
                ))}
              </div>
            ) : orders.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">No orders yet. Once buyers order from you, they&apos;ll show up here.</p>
            ) : (
              <div className="flex flex-col divide-y divide-border">
                {orders.slice(0, 4).map((order) => (
                  <Link
                    key={order.id}
                    to={`/farmer/orders/${order.id}`}
                    className="flex items-center justify-between gap-3 py-3 first:pt-0 hover:bg-muted/40 rounded-lg px-2 -mx-2"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{order.id} · {order.buyerName}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{formatDate(order.createdAt)} · {order.items.length} item(s)</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-sm font-semibold text-foreground">{formatCurrency(order.total)}</span>
                      <OrderStatusBadge status={order.status} />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <div className="flex items-center justify-between p-5 pb-0">
            <h2 className="font-heading text-base font-semibold text-foreground">Demand insights</h2>
            <Link to="/farmer/demand-insights" className="text-sm font-medium text-primary hover:underline">
              See more
            </Link>
          </div>
          <CardContent className="flex flex-col gap-3">
            {demandHighlights.map((d) => (
              <div key={d.productName} className="flex items-start gap-3 rounded-lg bg-muted/50 p-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">{d.productName}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{d.suggestion}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {lowStock.length > 0 && (
        <Card className="mt-5 border-destructive/30 bg-destructive/5">
          <CardContent className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <p className="text-sm text-foreground">
                <strong>{lowStock.length}</strong> product{lowStock.length > 1 ? "s" : ""} running low or out of stock.
              </p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link to="/farmer/inventory">Review inventory</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
