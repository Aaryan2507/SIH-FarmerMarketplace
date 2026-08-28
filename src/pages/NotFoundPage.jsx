import { Link } from "react-router-dom"
import { Leaf } from "lucide-react"
import { Button } from "../components/ui/Button"

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Leaf className="h-7 w-7" />
      </div>
      <h1 className="font-heading text-3xl font-semibold text-foreground">Page not found</h1>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Button asChild className="mt-6">
        <Link to="/">Back to home</Link>
      </Button>
    </div>
  )
}
