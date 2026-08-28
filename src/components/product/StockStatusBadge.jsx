import { Badge } from "@/components/ui/Badge"

const CONFIG = {
  "in-stock": { label: "In stock", variant: "success" },
  "low-stock": { label: "Low stock", variant: "warning" },
  "out-of-stock": { label: "Out of stock", variant: "destructive" },
}

export function StockStatusBadge({ status, className }) {
  const config = CONFIG[status] || CONFIG["in-stock"]
  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  )
}
