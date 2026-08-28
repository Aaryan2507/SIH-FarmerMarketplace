import { Leaf } from "lucide-react"
import { Logo } from "./Logo"

export function AuthLayout({ children, heroImage = "/images/hero-farmer.png", tagline = "Fresh from the field, straight to you." }) {
  return (
    <div className="flex min-h-screen bg-background">
      <div className="relative hidden w-1/2 lg:block">
        <img
          src={heroImage || "/placeholder.svg"}
          alt="Farmer holding fresh produce in a green field"
          className="h-full w-full object-cover"
          crossOrigin="anonymous"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/80 via-primary-dark/10 to-transparent" />
        <div className="absolute bottom-12 left-10 right-10 text-primary-foreground">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-foreground/15 backdrop-blur-sm">
              <Leaf className="h-5 w-5" />
            </div>
            <span className="font-heading text-xl font-semibold">KhetLink</span>
          </div>
          <p className="max-w-sm font-heading text-2xl font-semibold leading-snug text-balance">{tagline}</p>
        </div>
      </div>

      <div className="flex w-full flex-1 items-center justify-center px-6 py-10 lg:w-1/2">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex justify-center lg:hidden">
            <Logo />
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
