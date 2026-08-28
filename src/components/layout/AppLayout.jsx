import { Outlet } from "react-router-dom"
import { Sidebar } from "@/components/layout/Sidebar"
import { BottomNav } from "@/components/layout/BottomNav"
import { Navbar } from "@/components/layout/Navbar"

export function AppLayout() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar />
        <main className="flex-1 pb-20 lg:pb-0">
          <div className="mx-auto w-full max-w-6xl px-4 py-6 lg:px-8 lg:py-8">
            <Outlet />
          </div>
        </main>
      </div>
      <BottomNav />
    </div>
  )
}
