import { NavLink } from "react-router-dom"
import { LogOut } from "lucide-react"
import { Logo } from "@/components/layout/Logo"
import { NAV_CONFIG } from "@/components/layout/navConfig"
import { useAuth } from "@/context/AuthContext"
import { cn } from "@/utils/cn"

export function Sidebar() {
  const { role, user, logout } = useAuth()
  const config = NAV_CONFIG[role]
  if (!config) return null

  return (
    <aside className="hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-card lg:flex">
      <div className="p-5">
        <Logo />
      </div>
      <nav className="flex-1 space-y-1 px-3" aria-label="Primary navigation">
        {config.sidebar.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === config.homePath}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isActive ? "bg-primary/10 text-primary-dark" : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )
            }
          >
            <item.icon className="h-4.5 w-4.5" aria-hidden="true" />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-border p-4">
        <div className="mb-3 flex items-center gap-3 rounded-lg bg-muted px-3 py-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15 font-heading text-sm font-semibold text-primary-dark">
            {user?.name?.charAt(0) || "U"}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">{user?.name}</p>
            <p className="truncate text-xs capitalize text-muted-foreground">{role}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Log out
        </button>
      </div>
    </aside>
  )
}
