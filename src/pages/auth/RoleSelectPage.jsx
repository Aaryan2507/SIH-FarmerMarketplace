import { useNavigate } from "react-router-dom"
import { Sprout, ShoppingBasket, Warehouse, ChevronRight } from "lucide-react"
import { AuthLayout } from "../../components/layout/AuthLayout"

const ROLES = [
  {
    id: "farmer",
    label: "I'm a Farmer",
    description: "List your harvest, track mandi prices, and sell direct.",
    icon: Sprout,
  },
  {
    id: "consumer",
    label: "I'm a Consumer",
    description: "Shop fresh produce and staples straight from farms.",
    icon: ShoppingBasket,
  },
  {
    id: "wholesaler",
    label: "I'm a Wholesaler",
    description: "Source bulk produce and manage large orders.",
    icon: Warehouse,
  },
]

export default function RoleSelectPage() {
  const navigate = useNavigate()

  return (
    <AuthLayout tagline="One platform connecting farms to every table.">
      <div className="animate-fade-up">
        <h1 className="font-heading text-2xl font-semibold text-foreground">Welcome to KhetLink</h1>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          Tell us who you are so we can set up the right experience for you.
        </p>

        <div className="mt-7 flex flex-col gap-3">
          {ROLES.map(({ id, label, description, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => navigate(`/signup?role=${id}`)}
              className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 text-left shadow-soft transition-all hover:border-primary/40 hover:shadow-card"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-heading text-sm font-semibold text-foreground">{label}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{description}</p>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
            </button>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <button type="button" onClick={() => navigate("/login")} className="font-medium text-primary hover:underline">
            Log in
          </button>
        </p>
      </div>
    </AuthLayout>
  )
}
