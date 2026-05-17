import {
  IconDashboard,
  IconFolder,
  IconChartBar,
  IconReport,
  IconUsers,
  IconFileWord,
  IconDatabase,
  IconFileDescription,
  IconSettings,
  IconHelp,
  IconSearch,
  IconPackage,
  IconShoppingCart,
  IconClipboardList,
  IconUserCog,
  IconTruckDelivery,
} from "@tabler/icons-react";

import type { SidebarData } from "@/shared/types/sidebar";

export const userSidebarData: SidebarData = {
  brandName: "LocalStore",
  user: {
    name: "John Doe",
    email: "john@example.com",
    avatar: "/avatars/john.jpg",
  },

  navMain: [
    {
      title: "Dashboard",
      url: "/account",
      icon: IconDashboard,
      isActive: true,
    },
    {
      title: "Orders",
      url: "/account/orders",
      icon: IconFolder,
    },
    {
      title: "Wishlist",
      url: "/account/wishlist",
      icon: IconChartBar,
    },
    {
      title: "Reviews",
      url: "/account/reviews",
      icon: IconReport,
    },
    {
      title: "Profile",
      url: "/account/profile",
      icon: IconUsers,
    },
  ],

  documents: [
    {
      name: "Invoices",
      url: "/account/invoices",
      icon: IconFileWord,
    },
    {
      name: "Purchase History",
      url: "/account/history",
      icon: IconDatabase,
    },
    {
      name: "Saved Items",
      url: "/account/saved",
      icon: IconFileDescription,
    },
  ],

  navSecondary: [
    {
      title: "Settings",
      url: "/account/settings",
      icon: IconSettings,
    },
    {
      title: "Support",
      url: "/support",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "/search",
      icon: IconSearch,
    },
  ],
};

export const adminSidebarData: SidebarData = {
  brandName: "LocalStore Admin",

  user: {
    name: "Admin User",
    email: "admin@localstore.com",
    avatar: "/avatars/admin.jpg",
  },

  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: IconDashboard,
      isActive: true,
    },
    {
      title: "Products",
      url: "/admin/products",
      icon: IconPackage,
    },
    {
      title: "Orders",
      url: "/admin/orders",
      icon: IconShoppingCart,
    },
    {
      title: "Customers",
      url: "/admin/customers",
      icon: IconUsers,
    },
    {
      title: "Analytics",
      url: "/admin/analytics",
      icon: IconChartBar,
    },
  ],

  documents: [
    {
      name: "Inventory",
      url: "/admin/inventory",
      icon: IconClipboardList,
    },
    {
      name: "Reports",
      url: "/admin/reports",
      icon: IconReport,
    },
    {
      name: "Shipments",
      url: "/admin/shipments",
      icon: IconTruckDelivery,
    },
  ],

  navSecondary: [
    {
      title: "Admin Settings",
      url: "/admin/settings",
      icon: IconSettings,
    },
    {
      title: "Manage Staff",
      url: "/admin/staff",
      icon: IconUserCog,
    },
    {
      title: "Support",
      url: "/admin/support",
      icon: IconHelp,
    },
  ],
};