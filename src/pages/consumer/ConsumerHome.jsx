import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Search, ArrowRight, Sprout, Truck, ShieldCheck } from "lucide-react"
import { useAuth } from "../../context/AuthContext"
import { Skeleton } from "../../components/ui/Skeleton"
import { ProductCard } from "../../components/product/ProductCard"
import * as productService from "../../services/productService"
import { CATEGORIES } from "../../data/mockProducts"

const PERKS = [
  { icon: Sprout, label: "Straight from the farm" },
  { icon: Truck, label: "Fast local delivery" },
  { icon: ShieldCheck, label: "Verified farmers" },
]

export default function ConsumerHome() {
  const { user } = useAuth()
  const [featured, setFeatured] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    productService.listProducts({ inStockOnly: true, sortBy: "rating" }).then((list) => {
      setFeatured(list.slice(0, 6))
      setIsLoading(false)
    })
  }, [])

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 lg:px-8">
      <div className="relative overflow-hidden rounded-2xl bg-primary-dark">
        <img
          src="/images/hero-market.png"
          alt="Assorted fresh vegetables and fruits"
          className="absolute inset-0 h-full w-full object-cover opacity-30"
          crossOrigin="anonymous"
        />
        <div className="relative flex flex-col gap-4 p-6 sm:p-10">
          <h1 className="max-w-md font-heading text-2xl font-semibold text-primary-foreground text-balance sm:text-3xl">
            Hey {user.name.split(" ")[0]}, what's fresh today?
          </h1>
          <p className="max-w-sm text-sm text-primary-foreground/80">
            Shop produce, grains, and staples delivered directly from verified farmers near you.
          </p>
          <Link
            to="/consumer/marketplace"
            className="inline-flex w-fit items-center gap-2 rounded-lg bg-primary-foreground px-4 py-2.5 text-sm font-medium text-primary-dark shadow-soft"
          >
            <Search className="h-4 w-4" /> Browse marketplace
          </Link>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3">
        {PERKS.map(({ icon: Icon, label }) => (
          <div key={label} className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 text-center shadow-soft">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon className="h-4.5 w-4.5" />
            </div>
            <p className="text-xs font-medium text-foreground">{label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="font-heading text-lg font-semibold text-foreground">Shop by category</h2>
        <div className="mt-3 flex gap-3 overflow-x-auto pb-1 no-scrollbar">
          {CATEGORIES.map((c) => (
            <Link
              key={c.id}
              to={`/consumer/marketplace?category=${c.id}`}
              className="shrink-0 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:border-primary/40 hover:text-primary"
            >
              {c.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold text-foreground">Top picks for you</h2>
          <Link to="/consumer/marketplace" className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-64 rounded-xl" />)
            : featured.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </div>
    </div>
  )
}
