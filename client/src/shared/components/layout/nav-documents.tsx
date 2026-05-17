"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/shared/components/ui/sidebar";
import type { SidebarDocumentItem } from "@/shared/types/sidebar";
import { MoreHorizontalIcon, FolderIcon, ShareIcon, Trash2Icon } from "lucide-react";

export function NavDocuments({ items }: { items: SidebarDocumentItem[] }) {
  const { isMobile } = useSidebar();

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel className="text-sm text-slate-400!">
        Workspaces
      </SidebarGroupLabel>

      <SidebarMenu>
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild>
                <a href={item.url}>
                  <Icon className="size-4" />
                  <span>{item.name}</span>
                </a>
              </SidebarMenuButton>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuAction
                    showOnHover
                    className="rounded-md data-[state=open]:bg-[#18181B]"
                  >
                    <MoreHorizontalIcon className="size-4" />
                    <span className="sr-only">More</span>
                  </SidebarMenuAction>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  className="w-24 rounded-xl"
                  side={isMobile ? "bottom" : "right"}
                  align={isMobile ? "end" : "start"}
                >
                  <DropdownMenuItem>
                    <FolderIcon className="size-4" />
                    <span>Open</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <ShareIcon className="size-4" />
                    <span>Share</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive">
                    <Trash2Icon className="size-4" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          );
        })}

        <SidebarMenuItem>
          <SidebarMenuButton className="text-[#A1A1AA]">
            <MoreHorizontalIcon className="size-4 text-[#A1A1AA]" />
            <span>More</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}