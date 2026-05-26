import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { sellerService } from "../services/seller.service";
import type { SellerDashboard } from "../types/seller.types";

interface StatCardProps {
  title: string;
  value: string | number | React.ReactNode;
  description?: string;
  trend?: "up" | "down";
  icon?: React.ReactNode;
}

function StatCard({ title, value, description, icon }: StatCardProps) {
  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-zinc-300 flex items-center justify-between">
          {title}
          {icon && <div className="text-blue-500">{icon}</div>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-white">{value}</div>
        {description && <p className="text-xs text-zinc-400 mt-1">{description}</p>}
      </CardContent>
    </Card>
  );
}

export default function SellerDashboardOverview() {
  const [dashboard, setDashboard] = useState<SellerDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await sellerService.getSellerDashboard();
        setDashboard(data);
      } catch (error) {
        console.error("Failed to fetch seller dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-white">Loading dashboard...</div>;
  }

  const stats = dashboard?.stats || {
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    averageRating: 0,
    totalReviews: 0,
  };

  const sellerStatus = dashboard?.seller?.sellerStatus || "Unknown";

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-white">Seller Dashboard</h1>
        <p className="text-zinc-400 mt-2">Welcome back{dashboard?.seller?.name ? `, ${dashboard.seller.name}` : ""}! Here's your sales overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          description="Active listings"
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          description="All time"
        />
        <StatCard
          title="Total Revenue"
          value={`₹${stats.totalRevenue.toLocaleString()}`}
          description="Total revenue"
        />
        <StatCard
          title="Avg. Rating"
          value={stats.averageRating}
          description={`(${stats.totalReviews} reviews)`}
        />
        <StatCard
          title="Shop Status"
          value={
            <Badge className={sellerStatus === "approved" ? "bg-green-600 text-white" : "bg-yellow-600 text-white"}>
              {sellerStatus.charAt(0).toUpperCase() + sellerStatus.slice(1)}
            </Badge>
          }
          description={dashboard?.seller?.shopName || "Verified seller"}
        />
      </div>

      {/* Recent Activity Section */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Your latest sales activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between py-3 border-b border-zinc-800 last:border-0"
              >
                <div>
                  <p className="font-medium text-white">Order #100{i}</p>
                  <p className="text-sm text-zinc-400">2 items • ₹{2000 + i * 100}</p>
                </div>
                <Badge variant="outline" className="border-green-600 text-green-200">
                  Delivered
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 cursor-pointer transition">
          <CardHeader>
            <CardTitle className="text-base">Add New Product</CardTitle>
            <CardDescription>List a new product on your store</CardDescription>
          </CardHeader>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 cursor-pointer transition">
          <CardHeader>
            <CardTitle className="text-base">View Analytics</CardTitle>
            <CardDescription>Track your sales and performance</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
