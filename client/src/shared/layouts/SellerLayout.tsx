import * as React from "react";
import { Outlet } from "react-router-dom";

import { AppSidebar } from "@/shared/components/layout/app-sidebar";
import { SiteHeader } from "@/shared/components/layout/site-header";
import { SidebarInset, SidebarProvider } from "@/shared/components/ui/sidebar";
import { TooltipProvider } from "@/shared/components/ui/tooltip";
import { sellerSidebarData } from "@/shared/constants/sidebar.constants";

export default function SellerLayout() {
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
            "--sidebar-width": "calc(var(--spacing) * 80)",
            "--sidebar-width-icon": "calc(var(--spacing) * 15)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar
          onLogout={handleLogout}
          sidebarData={sellerSidebarData}
          variant="inset"
        />

        <SidebarInset className="min-h-screen rounded text-[#FAFAFA]">
          <SiteHeader />
          <main className="flex flex-1 flex-col">
            <Outlet />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
