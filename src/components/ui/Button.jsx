import { forwardRef, cloneElement, isValidElement } from "react"
import { Loader2 } from "lucide-react"
import { cn } from "@/utils/cn"

const VARIANTS = {
  primary: "bg-primary text-primary-foreground hover:bg-primary-dark shadow-soft",
  accent: "bg-accent text-accent-foreground hover:opacity-90 shadow-soft",
  secondary: "bg-card text-foreground border border-border hover:bg-muted",
  ghost: "bg-transparent text-foreground hover:bg-muted",
  outline: "bg-transparent border border-primary text-primary hover:bg-primary/5",
  destructive: "bg-destructive text-destructive-foreground hover:opacity-90",
  link: "bg-transparent text-primary underline-offset-4 hover:underline p-0 h-auto",
}

const SIZES = {
  sm: "h-9 px-3 text-sm rounded-lg gap-1.5",
  md: "h-11 px-5 text-sm rounded-lg gap-2",
  lg: "h-12 px-6 text-base rounded-xl gap-2",
  icon: "h-10 w-10 rounded-lg",
}

export const Button = forwardRef(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      isLoading = false,
      asChild = false,
      disabled,
      children,
      type = "button",
      ...props
    },
    ref,
  ) => {
    const busy = loading || isLoading
    const classes = cn(
      "inline-flex items-center justify-center font-medium transition-colors duration-150 whitespace-nowrap",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      "disabled:opacity-50 disabled:cursor-not-allowed",
      VARIANTS[variant],
      variant !== "link" && SIZES[size],
      className,
    )

    if (asChild && isValidElement(children)) {
      return cloneElement(children, {
        ref,
        className: cn(classes, children.props.className),
        ...props,
      })
    }

    return (
      <button ref={ref} type={type} disabled={disabled || busy} className={classes} {...props}>
        {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
        {children}
      </button>
    )
  },
)
Button.displayName = "Button"
