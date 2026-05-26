"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Package, TrendingUp, Warehouse, Star, Plus, 
  Store, ChevronRight, Activity, ShoppingBag 
} from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";

import { useAuthStore } from "@/app/store/auth.store";
import { sellerService } from "../services/seller.service";
import { useSellerProducts } from "../hooks/use-seller-products";
import SellerOnboardingChecklist from "../components/SellerOnboardingChecklist";
import type { SellerDashboard } from "../types/seller.types";

export default function SellerDashboardPage() {
  const user = useAuthStore((s) => s.user);
  const authLoading = useAuthStore((s) => s.isLoading);
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState<SellerDashboard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { stats: productStats } = useSellerProducts();

  useEffect(() => {
    sellerService.getSellerDashboard()
      .then(setDashboard)
      .catch(() => toast.error("Failed to load dashboard"))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading || authLoading) return <div className="min-h-screen bg-[#111113] flex items-center justify-center text-zinc-500">Loading dashboard...</div>;

  return (
    <div className="min-h-screen bg-[#111113] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8 text-left">
        
        {/* Header Section */}
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-white">Seller Dashboard</h1>
          <p className="text-zinc-400">Welcome back, {user?.name}. Here is your store performance overview.</p>
        </div>

        {/* Shop Overview Pill */}
        {dashboard && (
          <div className="flex items-center gap-4 rounded-3xl border border-white/10 bg-[#18181B] p-6">
            <div className="h-14 w-14 flex items-center justify-center rounded-2xl bg-[#DB4444]/10 text-[#DB4444]">
              <Store className="h-7 w-7" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">{dashboard.seller.shopName}</h2>
              <Badge className="mt-1 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border-emerald-500/20">
                {dashboard.seller.sellerStatus}
              </Badge>
            </div>
          </div>
        )}

        <SellerOnboardingChecklist />

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Total Products", value: productStats?.totalProducts || 0, icon: Package, color: "text-blue-400" },
            { label: "Active Listings", value: productStats?.activeProducts || 0, icon: TrendingUp, color: "text-green-400" },
            { label: "Total Inventory", value: productStats?.totalStock || 0, icon: Warehouse, color: "text-purple-400" },
            { label: "Avg. Rating", value: typeof productStats?.averageRating === "number" ? productStats.averageRating.toFixed(1) : "N/A", icon: Star, color: "text-yellow-400" },
          ].map((stat, i) => (
            <Card key={i} className="border-white/10 bg-[#18181B]">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-zinc-400">{stat.label}</p>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
                <p className="mt-2 text-2xl font-bold">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions & Recent Orders */}
        <div className="grid gap-8 lg:grid-cols-2">
          
          <Card className="border-white/10 bg-[#18181B]">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              <Button onClick={() => navigate("/seller/products/create")} className="h-14 justify-start rounded-2xl bg-[#DB4444] hover:bg-[#c53a3a]">
                <Plus className="mr-3 h-5 w-5" /> List New Product
              </Button>
              <Button onClick={() => navigate("/seller/products")} variant="outline" className="h-14 justify-between border-white/10 bg-black/20 hover:bg-white/5">
                <span className="flex items-center gap-3"><ShoppingBag className="h-5 w-5" /> Manage Inventory</span>
                <ChevronRight className="h-5 w-5" />
              </Button>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-[#18181B]">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Orders</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate("/seller/orders")}>View All</Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between rounded-xl border border-white/5 bg-black/20 p-4">
                  <div className="flex items-center gap-4">
                    <Activity className="h-8 w-8 text-zinc-700" />
                    <div>
                      <p className="font-medium">Order #100{i}</p>
                      <p className="text-xs text-zinc-500">2 items • ₹2,499</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="border-emerald-500/20 text-emerald-400">Delivered</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}