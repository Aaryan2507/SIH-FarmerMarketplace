import { cn } from "@/utils/cn"

export function Card({ className, children, ...props }) {
  return (
    <div
      className={cn("rounded-xl border border-border bg-card shadow-soft", className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ className, children, ...props }) {
  return (
    <div className={cn("flex items-start justify-between gap-3 p-5 pb-0", className)} {...props}>
      {children}
    </div>
  )
}

export function CardContent({ className, children, ...props }) {
  return (
    <div className={cn("p-5", className)} {...props}>
      {children}
    </div>
  )
}

export function CardFooter({ className, children, ...props }) {
  return (
    <div className={cn("flex items-center gap-3 border-t border-border p-5", className)} {...props}>
      {children}
    </div>
  )
}
