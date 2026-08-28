import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { Search, SlidersHorizontal, X } from "lucide-react"
import { ProductCard } from "../../components/product/ProductCard"
import { Skeleton } from "../../components/ui/Skeleton"
import { EmptyState } from "../../components/ui/EmptyState"
import { Select } from "../../components/ui/Select"
import { Input } from "../../components/ui/Input"
import { Button } from "../../components/ui/Button"
import * as productService from "../../services/productService"
import { CATEGORIES } from "../../data/mockProducts"

const SORT_OPTIONS = [
  { value: "rating", label: "Top rated" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "freshness", label: "Freshest first" },
]

export default function ConsumerMarketplace() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState(searchParams.get("q") || "")
  const [showFilters, setShowFilters] = useState(false)

  const category = searchParams.get("category") || ""
  const sortBy = searchParams.get("sort") || "rating"

  useEffect(() => {
    setIsLoading(true)
    const timeout = setTimeout(() => {
      productService
        .listProducts({ category: category || undefined, search: search || undefined, sortBy })
        .then((list) => {
          setProducts(list)
          setIsLoading(false)
        })
    }, 250)
    return () => clearTimeout(timeout)
  }, [category, search, sortBy])

  function updateParam(key, value) {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    setSearchParams(next)
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 lg:px-8">
      <h1 className="font-heading text-xl font-semibold text-foreground">Marketplace</h1>
      <p className="mt-1 text-sm text-muted-foreground">Fresh produce and staples from verified farmers.</p>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              updateParam("q", e.target.value)
            }}
            placeholder="Search vegetables, fruits, grains..."
            className="pl-9"
          />
        </div>
        <Button
          variant="secondary"
          size="md"
          onClick={() => setShowFilters((s) => !s)}
          className="gap-2 sm:w-auto"
        >
          <SlidersHorizontal className="h-4 w-4" /> Filters
        </Button>
      </div>

      {showFilters && (
        <div className="mt-3 flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center">
          <div className="flex-1">
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Category</label>
            <Select value={category} onChange={(e) => updateParam("category", e.target.value)}>
              <option value="">All categories</option>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Sort by</label>
            <Select value={sortBy} onChange={(e) => updateParam("sort", e.target.value)}>
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
          </div>
        </div>
      )}

      {(category || search) && (
        <div className="mt-3 flex flex-wrap gap-2">
          {category && (
            <button
              onClick={() => updateParam("category", "")}
              className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
            >
              {CATEGORIES.find((c) => c.id === category)?.label} <X className="h-3 w-3" />
            </button>
          )}
        </div>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-64 rounded-xl" />)
          : products.map((product) => <ProductCard key={product.id} product={product} />)}
      </div>

      {!isLoading && products.length === 0 && (
        <EmptyState
          icon={Search}
          title="No products found"
          description="Try adjusting your search or filters to find what you're looking for."
        />
      )}
    </div>
  )
}
