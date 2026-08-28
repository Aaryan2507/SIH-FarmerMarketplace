import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { ClipboardList, ChevronRight } from "lucide-react"
import { useAuth } from "../../context/AuthContext"
import { EmptyState } from "../../components/ui/EmptyState"
import { Skeleton } from "../../components/ui/Skeleton"
import { OrderStatusBadge } from "../../components/orders/OrderStatusBadge"
import * as orderService from "../../services/orderService"
import { formatCurrency, formatDate } from "../../utils/format"

export default function WholesalerOrders() { const { user } = useAuth(); const [orders, setOrders] = useState(null); useEffect(() => { orderService.listOrdersForBuyer(user.id).then(setOrders) }, [user.id]); return <div className="mx-auto max-w-5xl px-4 py-6 lg:px-8"><h1 className="font-heading text-2xl font-semibold text-foreground">Wholesale orders</h1><p className="mt-1 text-sm text-muted-foreground">Track your bulk purchases and deliveries.</p><div className="mt-6">{!orders ? <Skeleton className="h-24 rounded-xl" /> : orders.length === 0 ? <EmptyState icon={ClipboardList} title="No wholesale orders" description="Your bulk orders will appear here." /> : <div className="flex flex-col gap-3">{orders.map((order) => <Link key={order.id} to={`/wholesaler/orders/${order.id}`} className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-4 shadow-soft hover:border-primary/30"><div><div className="flex items-center gap-2"><p className="font-heading text-sm font-semibold text-foreground">{order.id}</p><OrderStatusBadge status={order.status} /></div><p className="mt-1 text-xs text-muted-foreground">{order.items.length} item(s) · {formatDate(order.createdAt)}</p></div><div className="flex items-center gap-3"><span className="font-heading font-semibold text-foreground">{formatCurrency(order.total)}</span><ChevronRight className="h-4 w-4 text-muted-foreground" /></div></Link>)}</div>}</div></div> }