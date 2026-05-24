import { Headphones, Heart, Package, UserCircle2 } from "lucide-react";
import type { AccountHomeData } from "../types/account-home.types";

export const accountHomeData: AccountHomeData = {
  hero: {
    badge: "Customer Account",
    title: "Welcome back, John.",
    description:
      "Manage your orders, wishlist, profile settings, and support requests from one clean dashboard.",
    primaryAction: {
      label: "Continue shopping",
      href: "/products",
    },
    secondaryAction: {
      label: "View orders",
      href: "/account/orders",
    },
  },
  stats: [
    { label: "Total Orders", value: "12", icon: Package },
    { label: "Wishlist Items", value: "8", icon: Heart },
    { label: "Support Tickets", value: "2", icon: Headphones },
    { label: "Profile Complete", value: "85%", icon: UserCircle2 },
  ],
  recentOrders: [
    {
      id: "ORD-1024",
      title: "Noise Cancelling Headphones",
      date: "17 May 2026",
      status: "Delivered",
      amount: "₹5,499",
      href: "/account/orders/ORD-1024",
    },
    {
      id: "ORD-1023",
      title: "Smart Watch",
      date: "12 May 2026",
      status: "Shipped",
      amount: "₹7,999",
      href: "/account/orders/ORD-1023",
    },
    {
      id: "ORD-1022",
      title: "Gaming Mouse",
      date: "09 May 2026",
      status: "Processing",
      amount: "₹1,499",
      href: "/account/orders/ORD-1022",
    },
  ],
  wishlistPreview: [
    { id: "wish-1", title: "Wireless Keyboard", href: "/products" },
    { id: "wish-2", title: "Smart Watch", href: "/products" },
    { id: "wish-3", title: "Backpack", href: "/products" },
    { id: "wish-4", title: "Gaming Mouse", href: "/products" },
  ],
  quickActions: [
    { label: "Edit profile", href: "/account/profile" },
    { label: "Track orders", href: "/account/orders" },
    { label: "Contact support", href: "/support" },
  ],
};