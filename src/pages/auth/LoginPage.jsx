import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Phone, Lock } from "lucide-react"
import { AuthLayout } from "../../components/layout/AuthLayout"
import { Input } from "../../components/ui/Input"
import { Button } from "../../components/ui/Button"
import { useAuth } from "../../context/AuthContext"
import { isValidPhone } from "../../utils/validators"

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState("")

  async function handleSubmit(e) {
    e.preventDefault()
    const nextErrors = {}
    if (!isValidPhone(phone)) nextErrors.phone = "Enter a valid 10-digit mobile number"
    if (!password) nextErrors.password = "Password is required"
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    setIsSubmitting(true)
    setFormError("")
    try {
      const { role } = await login({ phone, password })
      navigate(`/${role}`, { replace: true })
    } catch (err) {
      setFormError(err.message || "Invalid phone number or password")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout>
      <div className="animate-fade-up">
        <h1 className="font-heading text-2xl font-semibold text-foreground">Welcome back</h1>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          Log in to manage your harvest, orders, and marketplace activity.
        </p>

        <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-4">
          <Input
            label="Mobile number"
            type="tel"
            inputMode="numeric"
            placeholder="98765 43210"
            icon={Phone}
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
            error={errors.phone}
          />
          <div>
            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              icon={Lock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
            />
            <div className="mt-2 text-right">
              <Link to="/otp-login" className="text-xs font-medium text-primary hover:underline">
                Log in with OTP instead
              </Link>
            </div>
          </div>

          {formError && (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{formError}</p>
          )}

          <Button type="submit" isLoading={isSubmitting} className="mt-1 w-full">
            Log in
          </Button>
        </form>

        <p className="mt-6 rounded-lg bg-muted px-3 py-2 text-center text-xs leading-relaxed text-muted-foreground">
          Demo tip: use phone <strong className="text-foreground">9876543210</strong> (farmer),{" "}
          <strong className="text-foreground">9123456780</strong> (consumer), or{" "}
          <strong className="text-foreground">9988776655</strong> (wholesaler) with any password.
        </p>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          New to KhetLink?{" "}
          <Link to="/signup" className="font-medium text-primary hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
