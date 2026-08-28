import { Link, useLocation } from "react-router-dom"
import { CheckCircle2, Package } from "lucide-react"
import { Button } from "../../components/ui/Button"

export default function ConsumerOrderConfirmation() {
  const { state } = useLocation()
  return <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-16 text-center lg:px-8"><div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-success"><CheckCircle2 className="h-8 w-8" /></div><h1 className="mt-5 font-heading text-2xl font-semibold text-foreground">Order placed</h1><p className="mt-2 text-sm leading-relaxed text-muted-foreground">Your order {state?.order?.id ? <strong className="text-foreground">{state.order.id}</strong> : "is confirmed"} is on its way to the farmer.</p><div className="mt-6 flex gap-3"><Button asChild><Link to="/consumer/orders"><Package className="h-4 w-4" /> View orders</Link></Button><Button asChild variant="outline"><Link to="/consumer/marketplace">Continue shopping</Link></Button></div></div>
}