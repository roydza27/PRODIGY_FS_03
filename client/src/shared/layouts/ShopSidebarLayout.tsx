import * as React from "react";
import { Outlet } from "react-router-dom";

import { SiteHeader } from "@/shared/components/layout/site-header";
import { SidebarInset, SidebarProvider } from "@/shared/components/ui/sidebar";
import { TooltipProvider } from "@/shared/components/ui/tooltip";
import ShopFiltersSidebar from "@/features/products/components/ShopFiltersSidebar";
import MobileFiltersBar from "@/features/products/components/MobileFiltersBar";

export default function ShopSidebarLayout() {
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
        <div className="hidden lg:block">
          <ShopFiltersSidebar />
        </div>

        <SidebarInset className="min-h-screen rounded text-[#FAFAFA]">
          <SiteHeader />

          <main className="flex flex-1 flex-col">
            <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
              <div className="mb-4 lg:hidden">
                <MobileFiltersBar />
              </div>

              <Outlet />
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}