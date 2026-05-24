"use client";

import * as React from "react";
import { Link } from "react-router-dom";
import {
  IconInnerShadowTop,
  IconSparkles,
} from "@tabler/icons-react";

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
  const {
    brandName,
    navMain,
    documents,
    navSecondary,
    user,
    userMenu,
  } = sidebarData;

  return (
    <Sidebar
      collapsible="icon"
      {...props}
    >
      <SidebarHeader className="border-b border-white/5 px-3 py-4">
        <SidebarMenu className="gap-2">
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip={brandName}
              className="h-12 rounded-2xl px-3 transition-colors hover:bg-white/5"
            >
              <Link to="/products" className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-white/10">
                  <IconInnerShadowTop className="size-5 text-white" />
                </div>

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
              className="h-11 rounded-2xl bg-white px-3 text-black hover:bg-white/90"
            >
              <Link to="/products">
                <IconSparkles className="size-5" />
                <span className="font-medium">Browse store</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
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

        {documents.length > 0 ? (
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
        ) : null}

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

      <SidebarFooter className="border-t border-white/5 p-3">
        <NavUser
          user={user}
          onLogout={onLogout}
          items={userMenu ?? []}
        />
      </SidebarFooter>
    </Sidebar>
  );
}