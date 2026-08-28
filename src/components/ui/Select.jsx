import { forwardRef, useId } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/utils/cn"

export const Select = forwardRef(({ className, label, error, hint, id, children, ...props }, ref) => {
  const generatedId = useId()
  const inputId = id || generatedId
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={inputId}
          className={cn(
            "h-11 w-full appearance-none rounded-lg border border-border bg-card px-3.5 pr-10 text-sm text-foreground",
            "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-primary",
            error ? "border-destructive focus-visible:ring-destructive" : "",
            className,
          )}
          aria-invalid={Boolean(error)}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
      </div>
      {error && <p className="mt-1.5 text-sm text-destructive">{error}</p>}
      {!error && hint && <p className="mt-1.5 text-sm text-muted-foreground">{hint}</p>}
    </div>
  )
})
Select.displayName = "Select"
