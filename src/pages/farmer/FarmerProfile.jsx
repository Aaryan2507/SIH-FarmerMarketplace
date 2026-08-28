import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { User, Phone, Mail, MapPin, Sprout, ShieldCheck, LogOut, Save } from "lucide-react"
import { useAuth } from "../../context/AuthContext"
import { Card, CardContent } from "../../components/ui/Card"
import { Input } from "../../components/ui/Input"
import { Button } from "../../components/ui/Button"
import { Badge } from "../../components/ui/Badge"
import * as userService from "../../services/userService"

export default function FarmerProfile() {
  const { user, logout, refreshUser } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: user.name,
    email: user.email || "",
    location: user.location || "",
    farmName: user.farmName || "",
  })
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSave(e) {
    e.preventDefault()
    setIsSaving(true)
    setSaved(false)
    try {
      const updated = await userService.updateProfile(form)
      refreshUser(updated)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } finally {
      setIsSaving(false)
    }
  }

  async function handleLogout() {
    await logout()
    navigate("/login", { replace: true })
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 lg:px-8">
      <h1 className="font-heading text-2xl font-semibold text-foreground">My profile</h1>
      <p className="mt-1 text-sm text-muted-foreground">Manage your account details and farm information.</p>

      <Card className="mt-6">
        <CardContent className="flex flex-wrap items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xl font-heading font-semibold text-primary">
            {user.name.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-heading text-lg font-semibold text-foreground">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.farmName || "Farmer"}</p>
          </div>
          <Badge variant={user.aadhaarVerified ? "success" : "warning"}>
            <ShieldCheck className="h-3 w-3" />
            {user.aadhaarVerified ? "Aadhaar verified" : "Not verified"}
          </Badge>
        </CardContent>
      </Card>

      <Card className="mt-5">
        <CardContent>
          <h2 className="font-heading text-base font-semibold text-foreground">Account details</h2>
          <form onSubmit={handleSave} className="mt-4 flex flex-col gap-4">
            <Input label="Full name" icon={User} value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            <Input label="Mobile number" icon={Phone} value={user.phone} disabled />
            <Input
              label="Email"
              icon={Mail}
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            />
            <Input
              label="Location"
              icon={MapPin}
              value={form.location}
              onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
            />
            <Input
              label="Farm name"
              icon={Sprout}
              value={form.farmName}
              onChange={(e) => setForm((f) => ({ ...f, farmName: e.target.value }))}
            />

            {saved && <p className="rounded-lg bg-success/10 px-3 py-2 text-sm text-success">Profile updated successfully.</p>}

            <div className="flex justify-end">
              <Button type="submit" isLoading={isSaving}>
                <Save className="h-4 w-4" /> Save changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="mt-5">
        <CardContent className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">Log out</p>
            <p className="text-xs text-muted-foreground">You&apos;ll need to log back in to access your account.</p>
          </div>
          <Button variant="destructive" onClick={handleLogout}>
            <LogOut className="h-4 w-4" /> Log out
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
