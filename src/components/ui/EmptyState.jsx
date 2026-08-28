import { PackageOpen, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { cn } from "@/utils/cn"

export function EmptyState({
  icon: Icon = PackageOpen,
  title = "Nothing here yet",
  description,
  actionLabel,
  onAction,
  className,
  variant = "empty",
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card px-6 py-14 text-center", className)}>
      <div
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-full",
          variant === "error" ? "bg-destructive/10" : "bg-muted",
        )}
      >
        {variant === "error" ? (
          <AlertTriangle className="h-6 w-6 text-destructive" aria-hidden="true" />
        ) : (
          <Icon className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
        )}
      </div>
      <div className="space-y-1">
        <p className="font-heading text-base font-semibold text-foreground">{title}</p>
        {description && <p className="max-w-sm text-sm text-muted-foreground">{description}</p>}
      </div>
      {actionLabel && onAction && (
        <Button size="sm" variant={variant === "error" ? "secondary" : "primary"} onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
