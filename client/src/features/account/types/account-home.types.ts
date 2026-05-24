import type { LucideIcon } from "lucide-react";

export type AccountHomeAction = {
  label: string;
  href: string;
};

export type AccountHomeHero = {
  badge: string;
  title: string;
  description: string;
  primaryAction: AccountHomeAction;
  secondaryAction: AccountHomeAction;
};

export type AccountHomeStat = {
  label: string;
  value: string;
  icon: LucideIcon;
};

export type AccountRecentOrder = {
  id: string;
  title: string;
  date: string;
  status: string;
  amount: string;
  href: string;
};

export type AccountWishlistItem = {
  id: string;
  title: string;
  href: string;
};

export type AccountQuickAction = {
  label: string;
  href: string;
};

export type AccountHomeData = {
  hero: AccountHomeHero;
  stats: AccountHomeStat[];
  recentOrders: AccountRecentOrder[];
  wishlistPreview: AccountWishlistItem[];
  quickActions: AccountQuickAction[];
};