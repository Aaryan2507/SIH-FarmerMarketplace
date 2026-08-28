import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ShieldCheck, CheckCircle2 } from "lucide-react"
import { AuthLayout } from "../../components/layout/AuthLayout"
import { Input } from "../../components/ui/Input"
import { Button } from "../../components/ui/Button"
import { useAuth } from "../../context/AuthContext"

export default function AadhaarVerifyPage() {
  const navigate = useNavigate()
  const { verifyAadhaar, role } = useAuth()
  const [lastFour, setLastFour] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [verified, setVerified] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)
    try {
      await verifyAadhaar(lastFour)
      setVerified(true)
      setTimeout(() => navigate(`/${role}`, { replace: true }), 1200)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout tagline="Trusted identity, verified transactions.">
      <div className="animate-fade-up">
        {verified ? (
          <div className="flex flex-col items-center py-8 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-success">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h1 className="font-heading text-xl font-semibold text-foreground">Identity verified</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">Taking you to your dashboard...</p>
          </div>
        ) : (
          <>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h1 className="font-heading text-2xl font-semibold text-foreground">Verify your identity</h1>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              For a trusted marketplace, we verify every user with Aadhaar. This is a simulated demo step — no real
              Aadhaar data is collected.
            </p>

            <div className="mt-6 rounded-xl border border-border bg-muted/50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Mock Aadhaar Card</p>
              <p className="mt-2 font-heading text-lg font-semibold text-foreground">XXXX XXXX 8842</p>
              <p className="mt-1 text-xs text-muted-foreground">Government of India · Demo identity document</p>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
              <Input
                label="Confirm last 4 digits"
                inputMode="numeric"
                placeholder="8842"
                value={lastFour}
                onChange={(e) => setLastFour(e.target.value.replace(/\D/g, "").slice(0, 4))}
                error={error}
                className="text-center text-lg tracking-[0.4em]"
              />
              <Button type="submit" isLoading={isSubmitting} className="w-full">
                Verify identity
              </Button>
              <button
                type="button"
                onClick={() => navigate(`/${role}`, { replace: true })}
                className="text-center text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Skip for now
              </button>
            </form>
          </>
        )}
      </div>
    </AuthLayout>
  )
}
