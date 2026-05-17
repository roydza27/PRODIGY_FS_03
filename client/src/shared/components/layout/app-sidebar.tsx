"use client";

import * as React from "react";
import {
  IconInnerShadowTop,
} from "@tabler/icons-react";

import { NavDocuments } from "@/shared/components/layout/nav-documents";
import { NavMain } from "@/shared/components/layout/nav-main";
import { NavSecondary } from "@/shared/components/layout/nav-secondary";
import { NavUser } from "@/shared/components/layout/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shared/components/ui/sidebar";
import type { SidebarData } from "@/shared/types/sidebar";

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  onLogout: () => void;
  sidebarData: SidebarData;
};

export function AppSidebar({
  onLogout,
  sidebarData,
  ...props
}: AppSidebarProps) {
  const { brandName, navMain, documents, navSecondary, user } = sidebarData;

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="#">
                <IconInnerShadowTop className="size-5!" />
                <span className="text-base font-semibold">{brandName}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={navMain} />
        <NavDocuments items={documents} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={user} onLogout={onLogout} />
      </SidebarFooter>
    </Sidebar>
  );
}