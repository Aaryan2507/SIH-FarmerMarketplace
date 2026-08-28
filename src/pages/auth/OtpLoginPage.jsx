import { useEffect, useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Phone, ArrowLeft } from "lucide-react"
import { AuthLayout } from "../../components/layout/AuthLayout"
import { Input } from "../../components/ui/Input"
import { Button } from "../../components/ui/Button"
import { useAuth } from "../../context/AuthContext"
import * as authService from "../../services/authService"
import { isValidPhone } from "../../utils/validators"

export default function OtpLoginPage() {
  const navigate = useNavigate()
  const { loginWithOtp } = useAuth()
  const [step, setStep] = useState("phone")
  const [phone, setPhone] = useState("")
  const [otp, setOtp] = useState("")
  const [demoOtp, setDemoOtp] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [resendIn, setResendIn] = useState(0)
  const timerRef = useRef(null)

  useEffect(() => {
    if (resendIn <= 0) return
    timerRef.current = setTimeout(() => setResendIn((s) => s - 1), 1000)
    return () => clearTimeout(timerRef.current)
  }, [resendIn])

  async function handleSendOtp(e) {
    e.preventDefault()
    if (!isValidPhone(phone)) {
      setError("Enter a valid 10-digit mobile number")
      return
    }
    setError("")
    setIsSubmitting(true)
    try {
      const res = await authService.requestOtp(phone)
      setDemoOtp(res.demoOtp)
      setStep("otp")
      setResendIn(30)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleVerify(e) {
    e.preventDefault()
    if (otp.length !== 6) {
      setError("Enter the 6-digit OTP")
      return
    }
    setError("")
    setIsSubmitting(true)
    try {
      await authService.verifyOtp(phone, otp)
      const { role } = await loginWithOtp({ phone })
      navigate(`/${role}`, { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout>
      <div className="animate-fade-up">
        {step === "otp" && (
          <button
            type="button"
            onClick={() => setStep("phone")}
            className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
        )}

        <h1 className="font-heading text-2xl font-semibold text-foreground">
          {step === "phone" ? "Log in with OTP" : "Verify your number"}
        </h1>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          {step === "phone"
            ? "We'll send a one-time password to verify it's you."
            : `Enter the 6-digit code sent to +91 ${phone}`}
        </p>

        {step === "phone" ? (
          <form onSubmit={handleSendOtp} className="mt-7 flex flex-col gap-4">
            <Input
              label="Mobile number"
              type="tel"
              inputMode="numeric"
              placeholder="98765 43210"
              icon={Phone}
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
              error={error}
            />
            <Button type="submit" isLoading={isSubmitting} className="w-full">
              Send OTP
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="mt-7 flex flex-col gap-4">
            <Input
              label="OTP code"
              inputMode="numeric"
              placeholder="6-digit code"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              error={error}
              className="text-center text-lg tracking-[0.5em]"
            />
            <div className="rounded-lg bg-muted px-3 py-2 text-center text-xs text-muted-foreground">
              Demo OTP: <strong className="text-foreground">{demoOtp}</strong>
            </div>
            <Button type="submit" isLoading={isSubmitting} className="w-full">
              Verify &amp; log in
            </Button>
            <button
              type="button"
              disabled={resendIn > 0}
              onClick={handleSendOtp}
              className="text-center text-sm font-medium text-primary hover:underline disabled:cursor-not-allowed disabled:text-muted-foreground disabled:no-underline"
            >
              {resendIn > 0 ? `Resend OTP in ${resendIn}s` : "Resend OTP"}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Prefer a password?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Log in instead
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
