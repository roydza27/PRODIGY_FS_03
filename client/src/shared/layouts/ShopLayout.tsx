import * as React from "react";
import { Outlet } from "react-router-dom";

import { AppSidebar } from "@/shared/components/layout/app-sidebar";
import { SiteHeader } from "@/shared/components/layout/site-header";
import { SidebarInset, SidebarProvider } from "@/shared/components/ui/sidebar";
import { TooltipProvider } from "@/shared/components/ui/tooltip";
import { userSidebarData } from "@/shared/constants/sidebar.constants";

export default function ShopLayout() {
  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    window.location.replace("/login");
  };

  return (
    <TooltipProvider delayDuration={0}>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--sidebar-width-icon": "77px",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar
          onLogout={handleLogout}
          sidebarData={userSidebarData}
          variant="inset"
        />

        <SidebarInset className="min-h-screen w-full min-w-0 rounded-none text-[#FAFAFA] md:rounded">
          <SiteHeader />
          <main className="flex min-h-[calc(100vh-var(--header-height))] flex-1 flex-col overflow-x-hidden">
            <div className="mx-auto w-full max-w-[1600px] px-3 py-4 sm:px-4 sm:py-6 lg:px-8">
              <Outlet />
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}