import { Clock, CheckCircle2, PackageSearch, Truck, XCircle } from "lucide-react"
import { Badge } from "@/components/ui/Badge"

const CONFIG = {
  pending: { label: "Pending", variant: "warning", icon: Clock },
  confirmed: { label: "Confirmed", variant: "primary", icon: CheckCircle2 },
  processing: { label: "Processing", variant: "accent", icon: PackageSearch },
  completed: { label: "Completed", variant: "success", icon: Truck },
  cancelled: { label: "Cancelled", variant: "destructive", icon: XCircle },
}

export function OrderStatusBadge({ status, className }) {
  const config = CONFIG[status] || CONFIG.pending
  const Icon = config.icon
  return (
    <Badge variant={config.variant} className={className}>
      <Icon className="h-3 w-3" aria-hidden="true" />
      {config.label}
    </Badge>
  )
}
