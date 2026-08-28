import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { PackageSearch, Search } from "lucide-react"
import * as productService from "../../services/productService"
import { ProductCard } from "../../components/product/ProductCard"
import { Input } from "../../components/ui/Input"
import { Skeleton } from "../../components/ui/Skeleton"
import { EmptyState } from "../../components/ui/EmptyState"
import { Button } from "../../components/ui/Button"

export default function WholesalerMarketplace() {
  const [products, setProducts] = useState([]); const [search, setSearch] = useState(""); const [loading, setLoading] = useState(true)
  useEffect(() => { productService.listProducts({ search: search || undefined, inStockOnly: true }).then((list) => { setProducts(list); setLoading(false) }) }, [search])
  return <div className="mx-auto max-w-6xl px-4 py-6 lg:px-8"><div className="flex flex-wrap items-start justify-between gap-4"><div><h1 className="font-heading text-2xl font-semibold text-foreground">Wholesale marketplace</h1><p className="mt-1 text-sm text-muted-foreground">Source fresh produce directly from verified farmers.</p></div><Button asChild variant="outline"><Link to="/wholesaler/bulk-orders"><PackageSearch className="h-4 w-4" /> Bulk order desk</Link></Button></div><div className="mt-5 max-w-md"><Input icon={Search} placeholder="Search products or farmers..." value={search} onChange={(event) => setSearch(event.target.value)} /></div><div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{loading ? [1, 2, 3, 4].map((item) => <Skeleton key={item} className="h-64 rounded-xl" />) : products.map((product) => <div key={product.id}><ProductCard product={product} /><Link to={`/wholesaler/marketplace/${product.id}/bulk-order`} className="mt-2 block text-center text-sm font-medium text-primary hover:underline">Request bulk quantity</Link></div>)}</div>{!loading && products.length === 0 && <EmptyState icon={Search} title="No products found" description="Try a different search term." />}</div>
}