import {
  IconLayoutGrid,
  IconPackage,
  IconDiscount2,
  IconSparkles,
  IconCategory,
  IconTruck,
  IconStar,
  IconTag,
  IconSearch,
  IconUserCircle,
  IconSettings,
  IconReceipt2,
  IconHeart,
  IconHistory,
  IconMessageCircle,
  IconShoppingCart,
  IconUsers,
  IconChartBar,
  IconClipboardList,
  IconShieldCheck,
  IconFileAnalytics,
  IconUserCog,
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
      title: "Featured",
      url: "/products",
      icon: IconSparkles,
    },
    {
      title: "Categories",
      url: "/products",
      icon: IconCategory,
    },
    {
      title: "Deals",
      url: "/products?onSale=1",
      icon: IconDiscount2,
    },
    {
      title: "Trending",
      url: "/products?sort=price-desc",
      icon: IconStar,
    },
    {
      title: "All Products",
      url: "/products",
      icon: IconPackage,
    },
  ],

  documents: [
    {
      name: "New Arrivals",
      url: "/products?sort=newest",
      icon: IconLayoutGrid,
    },
    {
      name: "Best Value",
      url: "/products?price=budget",
      icon: IconTag,
    },
    {
      name: "Fast Delivery",
      url: "/products?freeShipping=1",
      icon: IconTruck,
    },
  ],

  navSecondary: [
    {
      title: "Search",
      url: "/search",
      icon: IconSearch,
    },
  ],

  userMenu: [
    {
      label: "Account Dashboard",
      url: "/account",
      icon: IconLayoutGrid,
    },
    {
      label: "Orders",
      url: "/account/orders",
      icon: IconShoppingCart,
    },
    {
      label: "Wishlist",
      url: "/account/wishlist",
      icon: IconHeart,
    },
    {
      label: "Reviews",
      url: "/account/reviews",
      icon: IconStar,
    },
    {
      label: "Invoices",
      url: "/account/invoices",
      icon: IconReceipt2,
    },
    {
      label: "Purchase History",
      url: "/account/history",
      icon: IconHistory,
    },
    {
      label: "Saved Items",
      url: "/account/saved",
      icon: IconTag,
    },
    {
      label: "Support",
      url: "/support",
      icon: IconMessageCircle,
    },
    {
      label: "Profile",
      url: "/account/profile",
      icon: IconUserCircle,
    },
    {
      label: "Settings",
      url: "/account/settings",
      icon: IconSettings,
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
      icon: IconLayoutGrid,
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
      icon: IconFileAnalytics,
    },
    {
      name: "Shipments",
      url: "/admin/shipments",
      icon: IconTruck,
    },
  ],

  navSecondary: [
    {
      title: "Settings",
      url: "/admin/settings",
      icon: IconSettings,
    },
    {
      title: "Staff",
      url: "/admin/staff",
      icon: IconUserCog,
    },
    {
      title: "Support",
      url: "/admin/support",
      icon: IconMessageCircle,
    },
  ],

  userMenu: [
    {
      label: "Admin Dashboard",
      url: "/admin",
      icon: IconShieldCheck,
    },
    {
      label: "Products",
      url: "/admin/products",
      icon: IconPackage,
    },
    {
      label: "Orders",
      url: "/admin/orders",
      icon: IconShoppingCart,
    },
    {
      label: "Customers",
      url: "/admin/customers",
      icon: IconUsers,
    },
    {
      label: "Analytics",
      url: "/admin/analytics",
      icon: IconChartBar,
    },
    {
      label: "Inventory",
      url: "/admin/inventory",
      icon: IconClipboardList,
    },
    {
      label: "Shipments",
      url: "/admin/shipments",
      icon: IconTruck,
    },
    {
      label: "Staff",
      url: "/admin/staff",
      icon: IconUserCog,
    },
    {
      label: "Profile",
      url: "/account/profile",
      icon: IconUserCircle,
    },
    {
      label: "Settings",
      url: "/admin/settings",
      icon: IconSettings,
    },
  ],
};