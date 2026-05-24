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
  IconCreditCard,
  IconMapPin,
} from "@tabler/icons-react";

import type { SidebarData } from "@/shared/types/sidebar";

export const userSidebarData: SidebarData = {
  brandName: "LocalStore",

  // In a real app, this user object would be fetched from your auth provider
  user: {
    name: "John Doe",
    email: "john@example.com",
    avatar: "/avatars/john.jpg",
  },

  // Primary Navigation
  navMain: [
    { title: "Featured", url: "/products", icon: IconSparkles },
    { title: "Categories", url: "/products?view=categories", icon: IconCategory },
    { title: "Trending", url: "/products?sort=trending", icon: IconStar },
    { title: "Sale", url: "/products?onSale=1", icon: IconDiscount2 },
    { title: "Shop All", url: "/products", icon: IconPackage },
  ],

  // Curated Collections (mapped as 'documents' in your types)
  documents: [
    { name: "New Arrivals", url: "/products?sort=newest", icon: IconLayoutGrid },
    { name: "Everyday Essentials", url: "/products?collection=essentials", icon: IconTag },
    { name: "Ready to Ship", url: "/products?freeShipping=1", icon: IconTruck },
  ],

  // Utility / Secondary
  navSecondary: [
    { title: "Search", url: "/search", icon: IconSearch },
    { title: "Help & Support", url: "/support", icon: IconMessageCircle },
  ],

  // User Dropdown / Account Menu
  userMenu: [
    { label: "Dashboard", url: "/account", icon: IconLayoutGrid },
    { label: "Order History", url: "/account/orders", icon: IconHistory },
    { label: "Wishlist", url: "/account/wishlist", icon: IconHeart },
    { label: "Saved Addresses", url: "/account/addresses", icon: IconMapPin },
    { label: "Payment Methods", url: "/account/billing", icon: IconCreditCard },
    { label: "Invoices", url: "/account/invoices", icon: IconReceipt2 },
    { label: "Profile", url: "/account/profile", icon: IconUserCircle },
    { label: "Settings", url: "/account/settings", icon: IconSettings },
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

