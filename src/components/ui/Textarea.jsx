import { forwardRef, useId } from "react"
import { cn } from "@/utils/cn"

export const Textarea = forwardRef(({ className, label, error, hint, id, ...props }, ref) => {
  const generatedId = useId()
  const inputId = id || generatedId
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={inputId}
        className={cn(
          "w-full rounded-lg border border-border bg-card px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground",
          "min-h-24 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-primary",
          error ? "border-destructive focus-visible:ring-destructive" : "",
          className,
        )}
        aria-invalid={Boolean(error)}
        {...props}
      />
      {error && <p className="mt-1.5 text-sm text-destructive">{error}</p>}
      {!error && hint && <p className="mt-1.5 text-sm text-muted-foreground">{hint}</p>}
    </div>
  )
})
Textarea.displayName = "Textarea"
