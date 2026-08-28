import { forwardRef, useId } from "react"
import { cn } from "@/utils/cn"

export const Input = forwardRef(
  ({ className, label, error, hint, icon: Icon, prefix, id, ...props }, ref) => {
    const generatedId = useId()
    const inputId = id || generatedId
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-foreground">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {Icon && (
            <Icon className="pointer-events-none absolute left-3.5 h-4 w-4 text-muted-foreground" aria-hidden="true" />
          )}
          {prefix && (
            <span className="pointer-events-none absolute left-3.5 text-sm text-muted-foreground">{prefix}</span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "h-11 w-full rounded-lg border border-border bg-card px-3.5 text-sm text-foreground placeholder:text-muted-foreground",
              "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-primary",
              Icon || prefix ? "pl-10" : "",
              error ? "border-destructive focus-visible:ring-destructive" : "",
              className,
            )}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
            {...props}
          />
        </div>
        {error && (
          <p id={`${inputId}-error`} className="mt-1.5 text-sm text-destructive">
            {error}
          </p>
        )}
        {!error && hint && (
          <p id={`${inputId}-hint`} className="mt-1.5 text-sm text-muted-foreground">
            {hint}
          </p>
        )}
      </div>
    )
  },
)
Input.displayName = "Input"
