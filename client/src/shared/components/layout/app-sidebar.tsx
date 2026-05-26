"use client";

import * as React from "react";
import { Link } from "react-router-dom";
import { IconInnerShadowTop, IconSparkles } from "@tabler/icons-react";
import { Store } from "lucide-react";

import { SidebarNavItem } from "@/shared/components/layout/sidebar-nav-item";
import { SidebarSection } from "@/shared/components/layout/sidebar-section";
import { NavUser } from "@/shared/components/layout/nav-user";
import { useAuthStore } from "@/app/store/auth.store";

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
  // 2. Grab the real, logged-in user from context
  const authUser = useAuthStore((state) => state.user);

  const {
    brandName,
    navMain,
    documents,
    navSecondary,
    userMenu,
  } = sidebarData;

  // 3. Format the dynamic auth data so <NavUser> never receives undefined
  const navUserData = {
    name: authUser?.name || "User",
    email: authUser?.email || "",
    avatar: authUser?.avatar || "",
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="border-b border-white/5 px-3 py-4">
        {/* ... (Header code remains exactly the same) ... */}
        <SidebarMenu className="gap-2">
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip={brandName}
              className="h-12 rounded-2xl px-3 transition-colors hover:bg-white/5"
            >
              <Link
                to="/"
                className="flex items-center gap-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#DB4444]/60"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
                  <Store className="h-5 w-5 text-[#DB4444]" />
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-semibold tracking-tight text-white">
                    {brandName || "LocalStore"}
                  </p>
                  <p className="text-xs text-zinc-500">E-commerce platform</p>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem className="group-data-[collapsible=icon]:hidden">
            <SidebarMenuButton
              asChild
              className="h-12 px-3 transition-colors bg-[#DB4444] px-3 text-black text-white hover:bg-[#c53a3a]"
            >
              <Link to="/products">
                <IconSparkles className="size-5" />
                <span className="font-medium ">Browse store</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        {/* ... (SidebarContent code remains exactly the same) ... */}
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
        <SidebarMenu>
          <SidebarMenuItem>
            {/* 4. Pass the real user data into the NavUser component */}
            <NavUser
              user={navUserData}
              onLogout={onLogout}
              items={userMenu ?? []}
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}