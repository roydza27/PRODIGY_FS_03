"use client";

import * as React from "react";
import { IconInnerShadowTop, IconSparkles } from "@tabler/icons-react";
import { Link } from "react-router-dom";

import { SidebarNavItem } from "@/shared/components/layout/sidebar-nav-item";
import { SidebarSection } from "@/shared/components/layout/sidebar-section";
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
  const { brandName, navMain, documents, navSecondary, user, userMenu } =
    sidebarData;

  return (
    <Sidebar
      collapsible="icon"
      className="items-center"
      {...props}
    >
      <SidebarHeader className="px-3 py-4">
        <SidebarMenu className="gap-2">
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip={brandName}
              className="h-12 rounded-2xl px-3 transition-all duration-200"
            >
              <Link to="/products" className="flex items-center gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-white/10 text-white ring-1 ring-white/10">
                  <IconInnerShadowTop className="size-6" />
                </span>

                <div className="min-w-0 group-data-[collapsible=icon]:hidden">
                  <p className="truncate text-sm font-semibold text-white">
                    {brandName}
                  </p>
                  <p className="truncate text-xs text-zinc-500">
                    Premium storefront
                  </p>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem className="group-data-[collapsible=icon]:hidden">
            <SidebarMenuButton
              asChild
              className="h-11 rounded-2xl bg-white px-3 text-black transition hover:bg-white/90"
            >
              <Link to="/products">
                <IconSparkles className="size-5" />
                <span className="font-medium">Browse store</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-2 py-2">
        <SidebarSection title="Browse">
          {navMain.map((item) => (
            <SidebarNavItem
              key={item.title}
              to={item.url}
              label={item.title}
              icon={item.icon}
              end={item.url === "/products"}
            />
          ))}
        </SidebarSection>

        <SidebarSection title="Collections">
          {documents.map((item) => (
            <SidebarNavItem
              key={item.name}
              to={item.url}
              label={item.name}
              icon={item.icon}
            />
          ))}
        </SidebarSection>

        <SidebarSection title="More">
          {navSecondary.map((item) => (
            <SidebarNavItem
              key={item.title}
              to={item.url}
              label={item.title}
              icon={item.icon}
            />
          ))}
        </SidebarSection>
      </SidebarContent>

      <SidebarFooter className="px-3 pb-3">
        <NavUser user={user} onLogout={onLogout} items={userMenu ?? []} />
      </SidebarFooter>
    </Sidebar>
  );
}