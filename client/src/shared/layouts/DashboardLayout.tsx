import { Outlet } from "react-router-dom"
import { AppSidebar } from "@/features/dashboard/components/app-sidebar"
import { SiteHeader } from "@/features/dashboard/components/site-header"
import { SidebarInset, SidebarProvider } from "@/shared/components/ui/sidebar"
import { TooltipProvider } from "@/shared/components/ui/tooltip"

export default function DashboardLayout() {
  const handleLogout = () => {
    localStorage.removeItem("token")
    sessionStorage.removeItem("token")
    window.location.replace("/login")
  }

  return (
    <TooltipProvider delayDuration={0}>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar onLogout={handleLogout} variant="inset" />

        <SidebarInset className="min-h-screen rounded text-[#FAFAFA]">
          <SiteHeader />

          <main className="flex flex-1 flex-col">
            <Outlet />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}