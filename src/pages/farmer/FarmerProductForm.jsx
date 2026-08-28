import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { useAuth } from "../../context/AuthContext"
import { Card, CardContent } from "../../components/ui/Card"
import { Input } from "../../components/ui/Input"
import { Select } from "../../components/ui/Select"
import { Textarea } from "../../components/ui/Textarea"
import { Button } from "../../components/ui/Button"
import { LoadingSpinner } from "../../components/ui/LoadingSpinner"
import * as productService from "../../services/productService"
import { CATEGORIES, UNITS } from "../../data/mockProducts"

const IMAGE_OPTIONS = [
  "/images/products/tomatoes.png",
  "/images/products/potatoes.png",
  "/images/products/onions.png",
  "/images/products/mangoes.png",
  "/images/products/apples.png",
  "/images/products/basmati-rice.png",
  "/images/products/wheat.png",
  "/images/products/toor-dal.png",
  "/images/products/cauliflower.png",
  "/images/products/carrots.png",
  "/images/products/milk.png",
  "/images/products/chilli.png",
]

const EMPTY_FORM = {
  name: "",
  category: "vegetables",
  description: "",
  price: "",
  unit: "kg",
  quantity: "",
  minOrderQty: "",
  bulkPrice: "",
  image: IMAGE_OPTIONS[0],
}

export default function FarmerProductForm() {
  const { productId } = useParams()
  const isEdit = Boolean(productId)
  const navigate = useNavigate()
  const { user } = useAuth()

  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState("")
  const [isLoading, setIsLoading] = useState(isEdit)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!isEdit) return
    let active = true
    productService.getProduct(productId).then((product) => {
      if (!active) return
      setForm({
        name: product.name,
        category: product.category,
        description: product.description,
        price: String(product.price),
        unit: product.unit,
        quantity: String(product.quantity),
        minOrderQty: String(product.minOrderQty),
        bulkPrice: String(product.bulkPrice || ""),
        image: product.image,
      })
      setIsLoading(false)
    })
    return () => {
      active = false
    }
  }, [isEdit, productId])

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function validate() {
    const next = {}
    if (!form.name.trim()) next.name = "Product name is required"
    if (!form.price || Number(form.price) <= 0) next.price = "Enter a valid price"
    if (!form.quantity || Number(form.quantity) < 0) next.quantity = "Enter a valid quantity"
    if (!form.description.trim()) next.description = "Add a short description"
    return next
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    setIsSubmitting(true)
    setFormError("")
    try {
      const payload = {
        name: form.name.trim(),
        category: form.category,
        description: form.description.trim(),
        price: form.price,
        unit: form.unit,
        quantity: form.quantity,
        minOrderQty: form.minOrderQty || 5,
        bulkPrice: form.bulkPrice || undefined,
        image: form.image,
        farmerId: user.id,
        farmerName: user.name,
        location: user.location,
        harvestDate: new Date().toISOString().slice(0, 10),
        freshness: "Freshly listed",
      }
      if (isEdit) {
        await productService.updateProduct(productId, payload)
      } else {
        await productService.createProduct(payload)
      }
      navigate("/farmer/inventory")
    } catch (err) {
      setFormError(err.message || "Unable to save product")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner size={32} />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 lg:px-8">
      <button
        type="button"
        onClick={() => navigate("/farmer/inventory")}
        className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to inventory
      </button>

      <h1 className="font-heading text-2xl font-semibold text-foreground">{isEdit ? "Edit product" : "Add new product"}</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {isEdit ? "Update your listing details below." : "Fill in the details to list a new product for sale."}
      </p>

      <Card className="mt-6">
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              label="Product name"
              placeholder="e.g. Vine-Ripened Tomatoes"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              error={errors.name}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <Select label="Category" value={form.category} onChange={(e) => update("category", e.target.value)}>
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </Select>
              <Select label="Unit" value={form.unit} onChange={(e) => update("unit", e.target.value)}>
                {UNITS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </Select>
            </div>

            <Textarea
              label="Description"
              placeholder="Describe your product, growing method, and quality"
              rows={3}
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              error={errors.description}
            />

            <div className="grid gap-4 sm:grid-cols-3">
              <Input
                label="Price per unit"
                type="number"
                min="0"
                prefix="₹"
                value={form.price}
                onChange={(e) => update("price", e.target.value)}
                error={errors.price}
              />
              <Input
                label="Available quantity"
                type="number"
                min="0"
                value={form.quantity}
                onChange={(e) => update("quantity", e.target.value)}
                error={errors.quantity}
              />
              <Input
                label="Min. order qty"
                type="number"
                min="1"
                placeholder="5"
                value={form.minOrderQty}
                onChange={(e) => update("minOrderQty", e.target.value)}
              />
            </div>

            <Input
              label="Bulk price (optional, for wholesale orders)"
              type="number"
              min="0"
              prefix="₹"
              placeholder="Leave blank to auto-calculate"
              value={form.bulkPrice}
              onChange={(e) => update("bulkPrice", e.target.value)}
            />

            <div>
              <p className="mb-2 text-sm font-medium text-foreground">Product photo</p>
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                {IMAGE_OPTIONS.map((src) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => update("image", src)}
                    className={`aspect-square overflow-hidden rounded-lg border-2 transition-colors ${
                      form.image === src ? "border-primary" : "border-transparent"
                    }`}
                  >
                    <img src={src || "/placeholder.svg"} alt="" className="h-full w-full object-cover" crossOrigin="anonymous" />
                  </button>
                ))}
              </div>
            </div>

            {formError && <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{formError}</p>}

            <div className="flex justify-end gap-3">
              <Button type="button" variant="secondary" onClick={() => navigate("/farmer/inventory")}>
                Cancel
              </Button>
              <Button type="submit" isLoading={isSubmitting}>
                {isEdit ? "Save changes" : "Add product"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
