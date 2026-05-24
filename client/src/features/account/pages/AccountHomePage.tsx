import AccountHero from "../components/account-home/AccountHero";
import AccountStatsGrid from "../components/account-home/AccountStatsGrid";
import RecentOrdersSection from "../components/account-home/RecentOrdersSection";
import WishlistPreviewSection from "../components/account-home/WishlistPreviewSection";
import QuickActionsSection from "../components/account-home/QuickActionsSection";
import { getAccountHomeData } from "../services/account-home.service";

export default function AccountHomePage() {
  const home = getAccountHomeData();

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