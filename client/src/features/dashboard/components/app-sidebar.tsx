"use client"

import * as React from "react"
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react"

import { NavDocuments } from "@/features/dashboard/components/nav-documents"
import { NavMain } from "@/features/dashboard/components/nav-main"
import { NavSecondary } from "@/features/dashboard/components/nav-secondary"
import { NavUser } from "@/features/dashboard/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shared/components/ui/sidebar"

const data = {
  user: {
    name: "John Doe",
    email: "john@nexus.app",
    avatar: "/avatars/john.jpg",
  },
  navMain: [
    {
      title: "Overview",
      url: "#",
      icon: <IconDashboard />,
      isActive: true,
    },
    {
      title: "Projects",
      url: "#",
      icon: <IconFolder />,
    },
    {
      title: "Insights",
      url: "#",
      icon: <IconChartBar />,
    },
    {
      title: "Reports",
      url: "#",
      icon: <IconReport />,
    },
    {
      title: "Team Workspace",
      url: "#",
      icon: <IconUsers />,
    },
  ],
  documents: [
    {
      name: "Q3 Marketing Plan",
      url: "#",
      icon: <IconFileWord />,
    },
    {
      name: "Revenue Analytics",
      url: "#",
      icon: <IconDatabase />,
    },
    {
      name: "Design System",
      url: "#",
      icon: <IconFileDescription />,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: <IconSettings />,
    },
    {
      title: "Help & Support",
      url: "#",
      icon: <IconHelp />,
    },
    {
      title: "Search",
      url: "#",
      icon: <IconSearch />,
    },
  ],
}

export function AppSidebar({ onLogout,...props }: React.ComponentProps<typeof Sidebar> & {
  onLogout: () => void
} ) {
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
                <span className="text-base font-semibold">Nexus Platform</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} onLogout={onLogout} />
      </SidebarFooter>
    </Sidebar>
  )
}
