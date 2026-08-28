import { Sprout } from "lucide-react"
import { cn } from "@/utils/cn"

export function Logo({ className, iconOnly = false }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Sprout className="h-4.5 w-4.5" aria-hidden="true" />
      </span>
      {!iconOnly && <span className="font-heading text-lg font-bold tracking-tight text-foreground">AgriLink</span>}
    </div>
  )
}
