import { Button } from "@/shared/components/ui/button";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shared/components/ui/sidebar";
import type { SidebarItem } from "@/shared/types/sidebar";
import { CirclePlusIcon, MailIcon } from "lucide-react";

export function NavMain({ items }: { items: SidebarItem[] }) {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="New Project"
              className="min-w-8 bg-[#FAFAFA] text-[#09090B] duration-200 ease-linear hover:bg-[#FAFAFA]/90 hover:text-[#09090B] active:bg-[#FAFAFA]/90 active:text-[#09090B]"
            >
              <CirclePlusIcon className="size-4" />
              <span>New Project</span>
            </SidebarMenuButton>

            <Button
              size="icon"
              className="size-8 group-data-[collapsible=icon]:opacity-0"
              variant="outline"
            >
              <MailIcon className="size-4" />
              <span className="sr-only">Notifications</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>

        <SidebarMenu>
          {items.map((item) => {
            const Icon = item.icon;

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton tooltip={item.title} data-active={item.isActive} asChild>
                  <a href={item.url}>
                    <Icon className="size-4" />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}