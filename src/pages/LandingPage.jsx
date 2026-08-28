import { Link } from "react-router-dom"
import { Leaf, Sprout, ShoppingBasket, Warehouse, TrendingUp, ShieldCheck, Truck, ArrowRight } from "lucide-react"
import { Button } from "../components/ui/Button"

const FEATURES = [
  { icon: TrendingUp, title: "Live mandi prices", description: "Track real-time market rates across regions before you sell or buy." },
  { icon: ShieldCheck, title: "Verified users", description: "Aadhaar-backed verification keeps every transaction trustworthy." },
  { icon: Truck, title: "Direct fulfillment", description: "Farmers ship straight to consumers and wholesalers, cutting out middlemen." },
]

const ROLES = [
  { icon: Sprout, title: "Farmers", description: "List your harvest, watch demand trends, and get fair prices." },
  { icon: ShoppingBasket, title: "Consumers", description: "Buy fresh produce and staples directly from local farms." },
  { icon: Warehouse, title: "Wholesalers", description: "Source bulk quantities with transparent pricing and logistics." },
]

export default function LandingPage() {
  return (
    <div className="bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-card/90 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Leaf className="h-4 w-4" />
            </div>
            <span className="font-heading text-lg font-semibold text-foreground">KhetLink</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Log in
            </Link>
            <Button asChild size="sm">
              <Link to="/signup">Get started</Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-16 lg:grid-cols-2 lg:py-24">
        <div className="animate-fade-up">
          <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            Farm-to-market, digitized
          </span>
          <h1 className="mt-4 font-heading text-4xl font-semibold leading-tight text-foreground text-balance lg:text-5xl">
            Connecting farms directly to every table
          </h1>
          <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
            KhetLink links farmers, consumers, and wholesalers on one transparent marketplace — fair prices, live
            mandi data, and verified trade.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/signup">
                Create free account <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/login">Log in</Link>
            </Button>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-2xl shadow-raised">
          <img
            src="/images/hero-market.png"
            alt="Fresh vegetables and fruits arranged on a wooden table"
            className="h-full w-full object-cover"
            crossOrigin="anonymous"
          />
        </div>
      </section>

      <section className="border-t border-border bg-card py-16">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="font-heading text-2xl font-semibold text-foreground">Built for every role in the chain</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {ROLES.map(({ icon: Icon, title, description }) => (
              <div key={title} className="rounded-xl border border-border bg-background p-5 shadow-soft">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-heading text-base font-semibold text-foreground">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="font-heading text-2xl font-semibold text-foreground">Why KhetLink</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <div key={title} className="rounded-xl bg-card p-5 shadow-soft">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/15 text-accent">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-heading text-base font-semibold text-foreground">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 text-sm text-muted-foreground sm:flex-row">
          <span>© 2026 KhetLink. Built for Smart India Hackathon.</span>
          <div className="flex gap-4">
            <Link to="/login" className="hover:text-foreground">Log in</Link>
            <Link to="/signup" className="hover:text-foreground">Sign up</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
