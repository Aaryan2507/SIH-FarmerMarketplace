import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { LogOut, Mail, MapPin, Phone, Save, User } from "lucide-react"
import { useAuth } from "../../context/AuthContext"
import { Card, CardContent } from "../../components/ui/Card"
import { Input } from "../../components/ui/Input"
import { Button } from "../../components/ui/Button"
import * as userService from "../../services/userService"

export default function ConsumerProfile() {
  const { user, logout, refreshUser } = useAuth(); const navigate = useNavigate(); const [form, setForm] = useState({ name: user.name, email: user.email || "", location: user.location || "" }); const [saving, setSaving] = useState(false); const [saved, setSaved] = useState(false)
  async function save(event) { event.preventDefault(); setSaving(true); const updated = await userService.updateProfile(form); refreshUser(updated); setSaved(true); setSaving(false) }
  async function signOut() { await logout(); navigate("/login", { replace: true }) }
  return <div className="mx-auto max-w-3xl px-4 py-6 lg:px-8"><h1 className="font-heading text-2xl font-semibold text-foreground">My profile</h1><p className="mt-1 text-sm text-muted-foreground">Manage your account and delivery details.</p><Card className="mt-6"><CardContent><form onSubmit={save} className="flex flex-col gap-4"><Input label="Full name" icon={User} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /><Input label="Mobile number" icon={Phone} value={user.phone} disabled /><Input label="Email" icon={Mail} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /><Input label="Location" icon={MapPin} value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />{saved && <p className="rounded-lg bg-success/10 px-3 py-2 text-sm text-success">Profile updated successfully.</p>}<div className="flex justify-end"><Button type="submit" isLoading={saving}><Save className="h-4 w-4" /> Save changes</Button></div></form></CardContent></Card><Card className="mt-5"><CardContent className="flex items-center justify-between"><div><p className="text-sm font-medium text-foreground">Log out</p><p className="text-xs text-muted-foreground">End this session on this device.</p></div><Button variant="destructive" onClick={signOut}><LogOut className="h-4 w-4" /> Log out</Button></CardContent></Card></div>
}