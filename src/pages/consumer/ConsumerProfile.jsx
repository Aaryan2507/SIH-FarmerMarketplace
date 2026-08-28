import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Home, LogOut, Mail, MapPin, Phone, Plus, Save, User } from "lucide-react"
import { useAuth } from "../../context/AuthContext"
import { Card, CardContent } from "../../components/ui/Card"
import { Input } from "../../components/ui/Input"
import { Button } from "../../components/ui/Button"
import * as userService from "../../services/userService"

export default function ConsumerProfile() {
  const { user, logout, refreshUser } = useAuth(); const navigate = useNavigate(); const [form, setForm] = useState({ name: user.name, email: user.email || "", location: user.location || "" }); const [saving, setSaving] = useState(false); const [saved, setSaved] = useState(false)
    const [newAddress, setNewAddress] = useState({ label: "", line1: "", line2: "", city: "", state: "", pincode: "" })
    const [addingAddress, setAddingAddress] = useState(false)
    const addresses = user.addresses || []

    async function save(event) {
      event.preventDefault()
      setSaving(true)
      try {
        const updated = await userService.updateProfile(form)
        refreshUser(updated)
        setSaved(true)
      } finally {
        setSaving(false)
      }
    }

    async function addAddress(event) {
      event.preventDefault()
      if (!newAddress.line1.trim() || !newAddress.city.trim() || !newAddress.pincode.trim()) return
      setAddingAddress(true)
      try {
        const updated = await userService.addAddress({
          ...newAddress,
          label: newAddress.label.trim() || "Address",
          line1: newAddress.line1.trim(),
          city: newAddress.city.trim(),
          state: newAddress.state.trim(),
          pincode: newAddress.pincode.trim(),
        })
        refreshUser(updated)
        setNewAddress({ label: "", line1: "", line2: "", city: "", state: "", pincode: "" })
      } finally {
        setAddingAddress(false)
      }
    }
    const addressSection = <Card className="mt-5"><CardContent><div className="flex items-center justify-between gap-3"><div><h2 className="font-heading text-base font-semibold text-foreground">Saved addresses</h2><p className="mt-1 text-xs text-muted-foreground">Use these for faster checkout.</p></div><Home className="h-5 w-5 text-primary" /></div><div className="mt-4 flex flex-col gap-3">{addresses.map((address) => <div key={address.id} className="rounded-lg border border-border bg-muted/40 p-3"><div className="flex items-center justify-between gap-2"><p className="text-sm font-medium text-foreground">{address.label}</p>{address.isDefault && <span className="text-xs font-medium text-primary">Default</span>}</div><p className="mt-1 text-sm text-muted-foreground">{address.line1}{address.line2 ? `, ${address.line2}` : ""}, {address.city}, {address.state} {address.pincode}</p></div>)}{addresses.length === 0 && <p className="text-sm text-muted-foreground">No saved addresses yet.</p>}</div><form onSubmit={addAddress} className="mt-5 grid gap-3 sm:grid-cols-2"><Input label="Label" placeholder="Home, office..." value={newAddress.label} onChange={(event) => setNewAddress({ ...newAddress, label: event.target.value })} /><Input label="Address line" placeholder="House and street" value={newAddress.line1} onChange={(event) => setNewAddress({ ...newAddress, line1: event.target.value })} required /><Input label="Area (optional)" placeholder="Locality" value={newAddress.line2} onChange={(event) => setNewAddress({ ...newAddress, line2: event.target.value })} /><Input label="City" placeholder="City" value={newAddress.city} onChange={(event) => setNewAddress({ ...newAddress, city: event.target.value })} required /><Input label="State" placeholder="State" value={newAddress.state} onChange={(event) => setNewAddress({ ...newAddress, state: event.target.value })} /><Input label="Pincode" inputMode="numeric" placeholder="411045" value={newAddress.pincode} onChange={(event) => setNewAddress({ ...newAddress, pincode: event.target.value.replace(/\D/g, "").slice(0, 6) })} required /><Button type="submit" isLoading={addingAddress} className="sm:col-span-2"><Plus className="h-4 w-4" /> Add address</Button></form></CardContent></Card>
  async function signOut() { await logout(); navigate("/login", { replace: true }) }
    return <div className="mx-auto max-w-3xl px-4 py-6 lg:px-8"><h1 className="font-heading text-2xl font-semibold text-foreground">My profile</h1><p className="mt-1 text-sm text-muted-foreground">Manage your account and delivery details.</p><Card className="mt-6"><CardContent><form onSubmit={save} className="flex flex-col gap-4"><Input label="Full name" icon={User} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /><Input label="Mobile number" icon={Phone} value={user.phone} disabled /><Input label="Email" icon={Mail} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /><Input label="Location" icon={MapPin} value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />{saved && <p className="rounded-lg bg-success/10 px-3 py-2 text-sm text-success">Profile updated successfully.</p>}<div className="flex justify-end"><Button type="submit" isLoading={saving}><Save className="h-4 w-4" /> Save changes</Button></div></form></CardContent></Card>{addressSection}<Card className="mt-5"><CardContent className="flex items-center justify-between"><div><p className="text-sm font-medium text-foreground">Log out</p><p className="text-xs text-muted-foreground">End this session on this device.</p></div><Button variant="destructive" onClick={signOut}><LogOut className="h-4 w-4" /> Log out</Button></CardContent></Card></div>
}