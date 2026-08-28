import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { ChevronRight, ShoppingBag } from "lucide-react"
import { useAuth } from "../../context/AuthContext"
import { EmptyState } from "../../components/ui/EmptyState"
import { Skeleton } from "../../components/ui/Skeleton"
import { Tabs } from "../../components/ui/Tabs"
import { OrderStatusBadge } from "../../components/orders/OrderStatusBadge"
import * as orderService from "../../services/orderService"
import { formatCurrency, formatDate } from "../../utils/format"

const TABS = [{ value: "all", label: "All" }, { value: "pending", label: "Pending" }, { value: "processing", label: "Processing" }, { value: "completed", label: "Completed" }]

export default function ConsumerOrders() {
  const { user } = useAuth(); const [orders, setOrders] = useState([]); const [status, setStatus] = useState("all"); const [loading, setLoading] = useState(true)
  useEffect(() => { let active = true; setLoading(true); orderService.listOrdersForBuyer(user.id, status).then((list) => { if (active) { setOrders(list); setLoading(false) } }); return () => { active = false } }, [user.id, status])
  return <div className="mx-auto max-w-5xl px-4 py-6 lg:px-8"><h1 className="font-heading text-2xl font-semibold text-foreground">My orders</h1><p className="mt-1 text-sm text-muted-foreground">Track your purchases from local farmers.</p><div className="mt-5"><Tabs tabs={TABS} value={status} onChange={setStatus} /></div><div className="mt-5">{loading ? <div className="flex flex-col gap-3">{[1, 2, 3].map((item) => <Skeleton key={item} className="h-20 rounded-xl" />)}</div> : orders.length === 0 ? <EmptyState icon={ShoppingBag} title="No orders found" description="Your completed and active orders will appear here." /> : <div className="flex flex-col gap-3">{orders.map((order) => <Link key={order.id} to={`/consumer/orders/${order.id}`} className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-4 shadow-soft hover:border-primary/30"><div><div className="flex items-center gap-2"><p className="font-heading text-sm font-semibold text-foreground">{order.id}</p><OrderStatusBadge status={order.status} /></div><p className="mt-1 text-xs text-muted-foreground">{order.items.length} item(s) · {formatDate(order.createdAt)}</p></div><div className="flex items-center gap-3"><span className="font-heading font-semibold text-foreground">{formatCurrency(order.total)}</span><ChevronRight className="h-4 w-4 text-muted-foreground" /></div></Link>)}</div>}</div></div>
}