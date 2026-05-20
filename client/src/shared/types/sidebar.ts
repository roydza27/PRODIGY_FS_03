import type { ComponentType } from "react";

export type SidebarIcon = ComponentType<{ className?: string }>;

export type SidebarItem = {
  title: string;
  url: string;
  icon: SidebarIcon;
};

export type SidebarDocumentItem = {
  name: string;
  url: string;
  icon: SidebarIcon;
};

export type SidebarUserAction = {
  label: string;
  url: string;
  icon: SidebarIcon;
};

export type SidebarUser = {
  name: string;
  email: string;
  avatar: string;
};

export type SidebarData = {
  brandName: string;
  user: SidebarUser;
  navMain: SidebarItem[];
  documents: SidebarDocumentItem[];
  navSecondary: SidebarItem[];
  userMenu?: SidebarUserAction[];
};