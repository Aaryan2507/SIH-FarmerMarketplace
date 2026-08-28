import { useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { User, Phone, Mail, MapPin, Sprout, ShoppingBasket, Warehouse } from "lucide-react"
import { AuthLayout } from "../../components/layout/AuthLayout"
import { Input } from "../../components/ui/Input"
import { Button } from "../../components/ui/Button"
import { useAuth } from "../../context/AuthContext"
import { isValidPhone, isValidEmail } from "../../utils/validators"

const ROLE_META = {
  farmer: { label: "Farmer", icon: Sprout },
  consumer: { label: "Consumer", icon: ShoppingBasket },
  wholesaler: { label: "Wholesaler", icon: Warehouse },
}

export default function SignupPage() {
  const [searchParams] = useSearchParams()
  const initialRole = searchParams.get("role") || "consumer"
  const navigate = useNavigate()
  const { signup } = useAuth()

  const [role, setRole] = useState(initialRole)
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    location: "",
    farmName: "",
    businessName: "",
  })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const nextErrors = {}
    if (!form.name.trim()) nextErrors.name = "Full name is required"
    if (!isValidPhone(form.phone)) nextErrors.phone = "Enter a valid 10-digit mobile number"
    if (form.email && !isValidEmail(form.email)) nextErrors.email = "Enter a valid email address"
    if (!form.location.trim()) nextErrors.location = "Location is required"
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    setIsSubmitting(true)
    setFormError("")
    try {
      await signup({
        name: form.name.trim(),
        phone: form.phone,
        email: form.email.trim(),
        location: form.location.trim(),
        role,
        ...(role === "farmer" ? { farmName: form.farmName.trim() } : {}),
        ...(role === "wholesaler" ? { businessName: form.businessName.trim() } : {}),
      })
      navigate("/aadhaar-verify")
    } catch (err) {
      setFormError(err.message || "Unable to create account")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout tagline="Join thousands connecting farms to markets.">
      <div className="animate-fade-up">
        <h1 className="font-heading text-2xl font-semibold text-foreground">Create your account</h1>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          Set up your KhetLink profile in a couple of minutes.
        </p>

        <div className="mt-5 flex gap-2">
          {Object.entries(ROLE_META).map(([id, { label, icon: Icon }]) => (
            <button
              key={id}
              type="button"
              onClick={() => setRole(id)}
              className={`flex flex-1 flex-col items-center gap-1.5 rounded-lg border px-2 py-2.5 text-xs font-medium transition-colors ${
                role === id
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/30"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
          <Input
            label="Full name"
            icon={User}
            placeholder="Your full name"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            error={errors.name}
          />
          <Input
            label="Mobile number"
            type="tel"
            inputMode="numeric"
            icon={Phone}
            placeholder="98765 43210"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
            error={errors.phone}
          />
          <Input
            label="Email (optional)"
            type="email"
            icon={Mail}
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            error={errors.email}
          />
          <Input
            label="Location"
            icon={MapPin}
            placeholder="City, State"
            value={form.location}
            onChange={(e) => update("location", e.target.value)}
            error={errors.location}
          />
          {role === "farmer" && (
            <Input
              label="Farm name (optional)"
              icon={Sprout}
              placeholder="e.g. Patil Farms"
              value={form.farmName}
              onChange={(e) => update("farmName", e.target.value)}
            />
          )}
          {role === "wholesaler" && (
            <Input
              label="Business name (optional)"
              icon={Warehouse}
              placeholder="e.g. Mehta Traders & Co."
              value={form.businessName}
              onChange={(e) => update("businessName", e.target.value)}
            />
          )}

          {formError && <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{formError}</p>}

          <Button type="submit" isLoading={isSubmitting} className="mt-1 w-full">
            Create account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
