import { NavLink } from "react-router-dom"
import { NAV_CONFIG } from "@/components/layout/navConfig"
import { useAuth } from "@/context/AuthContext"
import { useCart } from "@/context/CartContext"
import { cn } from "@/utils/cn"

export function BottomNav() {
  const { role } = useAuth()
  const cart = useCart()
  const config = NAV_CONFIG[role]
  if (!config) return null

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 flex border-t border-border bg-card/95 backdrop-blur-sm lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Primary navigation"
    >
      {config.bottom.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.path === config.homePath}
          className={({ isActive }) =>
            cn(
              "relative flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors",
              "focus-visible:outline-none",
              isActive ? "text-primary-dark" : "text-muted-foreground",
            )
          }
        >
          {({ isActive }) => (
            <>
              <span className={cn("relative flex h-6 w-6 items-center justify-center")}>
                <item.icon className="h-5 w-5" aria-hidden="true" />
                {item.label === "Cart" && cart?.itemCount > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-accent-foreground">
                    {cart.itemCount}
                  </span>
                )}
              </span>
              {item.label}
              {isActive && <span className="absolute -top-0 h-0.5 w-8 rounded-full bg-primary" />}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
