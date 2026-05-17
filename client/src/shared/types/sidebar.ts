// src/shared/types/sidebar.ts
import type { ComponentType } from "react";

export type SidebarIcon = ComponentType<{ className?: string }>;

export type SidebarItem = {
  title: string;
  url: string;
  icon: SidebarIcon;
  isActive?: boolean;
};

export type SidebarDocumentItem = {
  name: string;
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
};