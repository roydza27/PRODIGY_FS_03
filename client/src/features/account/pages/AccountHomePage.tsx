"use client";

import { useEffect, useState, useMemo } from "react";
// ADD THE ICONS HERE:
import { Package, Heart, ShoppingCart } from "lucide-react"; 

import AccountHero from "../components/account-home/AccountHero";
import AccountStatsGrid from "../components/account-home/AccountStatsGrid";
import RecentOrdersSection from "../components/account-home/RecentOrdersSection";
import WishlistPreviewSection from "../components/account-home/WishlistPreviewSection";
import QuickActionsSection from "../components/account-home/QuickActionsSection";

import { useAuthStore } from "@/app/store/auth.store";
import { useWishlist } from "@/features/wishlist/context/WishlistContext";
import { useCart } from "@/features/cart/context/CartContext";
import { orderService } from "../services/order.service";

export default function AccountHomePage() {
  const user = useAuthStore((state) => state.user);
  
  const wishlistContext = useWishlist();
  const wishlistItems = wishlistContext?.items || [];
  
  const cartContext = useCart();
  const cartItems = (cartContext as any)?.items || (cartContext as any)?.cartItems || [];

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadOrders = async () => {
      try {
        const res = await orderService.getAll();
        
        let fetchedOrders = [];
        if (Array.isArray(res)) {
          fetchedOrders = res;
        } else if (res && typeof res === 'object') {
          fetchedOrders = (res as any).orders || (res as any).data || [];
        }
        
        if (mounted) setOrders(fetchedOrders);
      } catch (error) {
        console.error("Failed to load recent orders", error);
        if (mounted) setOrders([]); 
      } finally {
        if (mounted) setLoading(false);
      }
    };

    void loadOrders();

    return () => {
      mounted = false;
    };
  }, []);

  const homeData = useMemo(() => {

    const firstName = user?.name 
      ? user.name.split(" ")[0] 
      : user?.email 
        ? user.email.split("@")[0] 
        : "Shopper";

    return {
      hero: {
        badge: "Account",
        title: `Welcome back, ${firstName}`,
        description: "Track your orders, wishlist, and account activity.",
        primaryAction: { label: "Browse Products", href: "/products" },
        secondaryAction: { label: "View Orders", href: "/account/orders" },
      },
      stats: [
        { label: "Total Orders", value: orders.length.toString(), icon: Package },
        { label: "Wishlist Saved", value: wishlistItems.length.toString(), icon: Heart },
        { label: "Items in Cart", value: cartItems.length.toString(), icon: ShoppingCart },
      ],
      recentOrders: [...orders].reverse().slice(0, 3), 
      wishlistPreview: [...wishlistItems].reverse().slice(0, 4), 
      
      quickActions: [
        { label: "Browse Products", href: "/products" },
        { label: "View Orders", href: "/account/orders" },
        { label: "Wishlist", href: "/account/wishlist" },
      ],
    };
  }, [user, orders, wishlistItems, cartItems]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090B] px-4 py-8 text-white md:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="h-40 animate-pulse rounded-[28px] bg-white/5" />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 animate-pulse rounded-3xl bg-white/5" />
            ))}
          </div>
          <div className="grid gap-6 lg:grid-cols-[1.45fr_0.85fr]">
            <div className="h-80 animate-pulse rounded-3xl bg-white/5" />
            <div className="space-y-6">
              <div className="h-56 animate-pulse rounded-3xl bg-white/5" />
              <div className="h-44 animate-pulse rounded-3xl bg-white/5" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090B] px-4 py-8 text-white md:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-8">
        
        <AccountHero hero={homeData.hero} />
        <AccountStatsGrid stats={homeData.stats} />

        <div className="grid gap-6 lg:grid-cols-[1.45fr_0.85fr]">
          <RecentOrdersSection orders={homeData.recentOrders} />

          <div className="space-y-6">
            <WishlistPreviewSection items={homeData.wishlistPreview} />
            <QuickActionsSection actions={homeData.quickActions} />
          </div>
        </div>
        
      </div>
    </div>
  );
}