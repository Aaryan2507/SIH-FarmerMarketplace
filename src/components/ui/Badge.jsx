import { cn } from "@/utils/cn"

const VARIANTS = {
  default: "bg-muted text-muted-foreground",
  primary: "bg-primary/10 text-primary-dark",
  accent: "bg-accent/15 text-accent-foreground",
  success: "bg-success/10 text-success",
  warning: "bg-accent/15 text-[hsl(32_82%_38%)]",
  destructive: "bg-destructive/10 text-destructive",
}

export function Badge({ className, variant = "default", children, ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
        VARIANTS[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}
