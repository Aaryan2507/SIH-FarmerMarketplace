import { useNavigate } from "react-router-dom"
import { ShoppingCart, MapPin, LogOut } from "lucide-react"
import { Logo } from "@/components/layout/Logo"
import { useAuth } from "@/context/AuthContext"
import { useCart } from "@/context/CartContext"
import { useLocation as useAppLocation } from "@/context/LocationContext"

export function Navbar() {
  const { role, user, logout } = useAuth()
  const cart = useCart()
  const { location } = useAppLocation()
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-border bg-card/95 px-4 backdrop-blur-sm lg:px-8">
      <div className="flex items-center gap-3 lg:hidden">
        <Logo />
      </div>
      <div className="hidden min-w-0 lg:block" />

      <div className="flex items-center gap-2">
        {role === "consumer" && (
          <button
            type="button"
            className="hidden items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-muted-foreground hover:bg-muted sm:flex"
            aria-label="Change delivery location"
          >
            <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
            {location}
          </button>
        )}
        {role === "consumer" && (
          <button
            type="button"
            onClick={() => navigate("/consumer/cart")}
            aria-label={`Cart, ${cart.itemCount} items`}
            className="relative flex h-10 w-10 items-center justify-center rounded-lg text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ShoppingCart className="h-5 w-5" aria-hidden="true" />
            {cart.itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-accent-foreground">
                {cart.itemCount}
              </span>
            )}
          </button>
        )}
        <div className="hidden items-center gap-2 lg:hidden" />
        <button
          type="button"
          onClick={logout}
          aria-label="Log out"
          className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-destructive lg:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <LogOut className="h-5 w-5" aria-hidden="true" />
        </button>
        <div className="hidden h-9 w-9 items-center justify-center rounded-full bg-primary/15 font-heading text-sm font-semibold text-primary-dark lg:flex">
          {user?.name?.charAt(0) || "U"}
        </div>
      </div>
    </header>
  )
}
