import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, MapPin, CreditCard } from "lucide-react"
import { Card, CardContent } from "../../components/ui/Card"
import { LoadingSpinner } from "../../components/ui/LoadingSpinner"
import { OrderStatusBadge } from "../../components/orders/OrderStatusBadge"
import * as orderService from "../../services/orderService"
import { formatCurrency, formatDate } from "../../utils/format"

export default function ConsumerOrderDetail() {
  const { orderId } = useParams(); const navigate = useNavigate(); const [order, setOrder] = useState(null)
  useEffect(() => { orderService.getOrder(orderId).then(setOrder) }, [orderId])
  if (!order) return <div className="flex min-h-[50vh] items-center justify-center"><LoadingSpinner size={32} /></div>
  return <div className="mx-auto max-w-3xl px-4 py-6 lg:px-8"><button type="button" onClick={() => navigate("/consumer/orders")} className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Back to orders</button><div className="flex items-start justify-between gap-3"><div><h1 className="font-heading text-2xl font-semibold text-foreground">{order.id}</h1><p className="mt-1 text-sm text-muted-foreground">Placed on {formatDate(order.createdAt, { withTime: true })}</p></div><OrderStatusBadge status={order.status} /></div><Card className="mt-5"><CardContent className="grid gap-4 sm:grid-cols-2"><div className="flex gap-3"><MapPin className="h-4 w-4 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">Delivery address</p><p className="text-sm font-medium text-foreground">{order.address}</p></div></div><div className="flex gap-3"><CreditCard className="h-4 w-4 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">Payment</p><p className="text-sm font-medium text-foreground">{order.paymentMethod}</p></div></div></CardContent></Card><Card className="mt-5"><CardContent><h2 className="font-heading text-base font-semibold text-foreground">Items</h2><div className="mt-3 divide-y divide-border">{order.items.map((item) => <div key={item.productId} className="flex justify-between gap-3 py-3"><div><p className="text-sm font-medium text-foreground">{item.name}</p><p className="text-xs text-muted-foreground">{item.quantity} {item.unit} × {formatCurrency(item.price)}</p></div><span className="text-sm font-semibold text-foreground">{formatCurrency(item.quantity * item.price)}</span></div>)}</div><div className="mt-3 flex justify-between border-t border-border pt-3 font-heading text-base font-semibold text-foreground"><span>Total</span><span>{formatCurrency(order.total)}</span></div></CardContent></Card></div>
}