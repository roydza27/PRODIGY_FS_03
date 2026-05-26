import { useEffect, useState } from "react";
import AccountHero from "../components/account-home/AccountHero";
import AccountStatsGrid from "../components/account-home/AccountStatsGrid";
import RecentOrdersSection from "../components/account-home/RecentOrdersSection";
import WishlistPreviewSection from "../components/account-home/WishlistPreviewSection";
import QuickActionsSection from "../components/account-home/QuickActionsSection";
import { getAccountHomeData } from "../services/account-home.service";
import type { AccountHomeData } from "../types/account-home.types";

const EMPTY_HOME: AccountHomeData = {
  hero: {
    badge: "Account",
    title: "Welcome back",
    description: "Track your orders, wishlist, and account activity.",
    primaryAction: { label: "Browse Products", href: "/products" },
    secondaryAction: { label: "View Orders", href: "/account/orders" },
  },
  stats: [],
  recentOrders: [],
  wishlistPreview: [],
  quickActions: [
    { label: "Browse Products", href: "/products" },
    { label: "View Orders", href: "/account/orders" },
    { label: "Wishlist", href: "/account/wishlist" },
  ],
};

export default function AccountHomePage() {
  const [home, setHome] = useState<AccountHomeData>(EMPTY_HOME);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const data = await getAccountHomeData();
        if (mounted) setHome(data);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    void load();

    return () => {
      mounted = false;
    };
  }, []);

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
        <AccountHero hero={home.hero} />
        <AccountStatsGrid stats={home.stats} />

        <div className="grid gap-6 lg:grid-cols-[1.45fr_0.85fr]">
          <RecentOrdersSection orders={home.recentOrders} />

          <div className="space-y-6">
            <WishlistPreviewSection items={home.wishlistPreview} />
            <QuickActionsSection actions={home.quickActions} />
          </div>
        </div>
      </div>
    </div>
  );
}