import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Plus, Pencil, Trash2, Package, Search } from "lucide-react"
import { useAuth } from "../../context/AuthContext"
import { Button } from "../../components/ui/Button"
import { Input } from "../../components/ui/Input"
import { Skeleton } from "../../components/ui/Skeleton"
import { EmptyState } from "../../components/ui/EmptyState"
import { ConfirmDialog } from "../../components/ui/ConfirmDialog"
import { StockStatusBadge } from "../../components/product/StockStatusBadge"
import * as productService from "../../services/productService"
import { formatCurrency, formatDate } from "../../utils/format"

export default function FarmerInventory() {
  const { user } = useAuth()
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState("")

  async function load() {
    setIsLoading(true)
    setError("")
    try {
      const list = await productService.listProducts({ farmerId: user.id })
      setProducts(list)
    } catch {
      setError("Unable to load your inventory right now.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id])

  const filtered = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
  const customIds = new Set(productService.getCustomProductIds())

  async function handleDeleteConfirm() {
    setIsDeleting(true)
    try {
      await productService.deleteProduct(deleteTarget.id)
      setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id))
      setDeleteTarget(null)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 lg:px-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-foreground">My inventory</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage the products you have listed for sale.</p>
        </div>
        <Button asChild>
          <Link to="/farmer/inventory/new">
            <Plus className="h-4 w-4" /> Add product
          </Link>
        </Button>
      </div>

      <div className="mt-5 max-w-sm">
        <Input
          placeholder="Search your products..."
          icon={Search}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="mt-5">
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))}
          </div>
        ) : error ? (
          <EmptyState variant="error" title="Something went wrong" description={error} actionLabel="Try again" onAction={load} />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Package}
            title={search ? "No matching products" : "No products listed yet"}
            description={search ? "Try a different search term." : "Add your first product to start selling on KhetLink."}
            actionLabel={search ? undefined : "Add product"}
            onAction={search ? undefined : () => {}}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((product) => {
              const editable = customIds.has(product.id)
              return (
                <div key={product.id} className="overflow-hidden rounded-xl border border-border bg-card shadow-soft">
                  <div className="aspect-[4/3] overflow-hidden bg-muted">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="h-full w-full object-cover"
                      crossOrigin="anonymous"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-heading text-sm font-semibold text-foreground">{product.name}</h3>
                      <StockStatusBadge status={product.stockStatus} />
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{formatCurrency(product.price)}/{product.unit} · {product.quantity} {product.unit} available</p>
                    <p className="mt-1 text-xs text-muted-foreground">Updated {formatDate(product.lastUpdated)}</p>
                    <div className="mt-3 flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        asChild={editable}
                        disabled={!editable}
                        title={!editable ? "Demo seed product — only products you add can be edited" : undefined}
                      >
                        {editable ? (
                          <Link to={`/farmer/inventory/${product.id}/edit`}>
                            <Pencil className="h-3.5 w-3.5" /> Edit
                          </Link>
                        ) : (
                          <span className="inline-flex items-center gap-1.5">
                            <Pencil className="h-3.5 w-3.5" /> Edit
                          </span>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:bg-destructive/10"
                        disabled={!editable}
                        onClick={() => setDeleteTarget(product)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        loading={isDeleting}
        title="Remove this product?"
        description={`"${deleteTarget?.name}" will be removed from your inventory and the marketplace. This cannot be undone.`}
        confirmLabel="Remove"
      />
    </div>
  )
}
