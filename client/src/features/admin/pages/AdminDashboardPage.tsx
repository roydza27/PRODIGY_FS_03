import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import AdminPageShell from "../components/AdminPageShell";
import { getDashboardStats, type AdminDashboardResponse } from "../services/dashboard.service";
import { formatPrice } from "@/features/products/utils/product.helpers";

export default function AdminDashboardPage() {
  const [data, setData] = useState<AdminDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const stats = await getDashboardStats();
      setData(stats);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const activity = useMemo(() => {
    if (!data) return [];

    const latestOrders = [...data.orders]
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
      .slice(0, 5);

    return latestOrders.map((order) => ({
      id: order._id,
      label: `${order.shippingAddress?.fullName || "Customer"} placed an order`,
      meta: `${new Date(order.createdAt).toLocaleDateString()} · ${formatPrice(order.total)}`,
      status: order.status,
    }));
  }, [data]);

  const revenueSeries = useMemo(() => {
    if (!data) return [20, 34, 28, 45, 31, 55, 48];
    const count = Math.max(7, Math.min(12, data.orders.length || 7));
    return Array.from({ length: count }, (_, i) => {
      const order = data.orders[i % data.orders.length];
      const base = order ? Math.max(18, Math.min(92, Math.round((order.total / 20000) * 100))) : 30;
      return base;
    });
  }, [data]);

  return (
    <AdminPageShell
      title="Dashboard"
      description="Monitor store performance, activity, and high-level metrics."
      actions={
        <Button
          onClick={loadDashboard}
          className="rounded-xl bg-red-500 hover:bg-red-600"
        >
          Refresh
        </Button>
      }
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="border-white/10 bg-white/5 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {loading ? "..." : formatPrice(data?.totalRevenue || 0)}
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/5 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">
              Total Orders
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {loading ? "..." : data?.totalOrders || 0}
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/5 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">
              Total Products
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {loading ? "..." : data?.totalProducts || 0}
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/5 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">
              Customers
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {loading ? "..." : data?.totalCustomers || 0}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
        <Card className="border-white/10 bg-white/5 text-white">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Revenue Snapshot</CardTitle>
              <p className="mt-1 text-sm text-zinc-400">
                Lightweight trend view for recent order totals.
              </p>
            </div>
            <Badge className="border border-emerald-500/20 bg-emerald-500/15 text-emerald-400">
              {loading ? "Loading" : `${data?.activeProducts || 0} active products`}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="flex h-72 items-end gap-3 rounded-2xl border border-white/10 bg-black/20 p-4">
              {revenueSeries.map((height, index) => (
                <div
                  key={index}
                  className="flex-1 rounded-t-xl bg-red-500/80"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
            <p className="mt-3 text-sm text-zinc-400">
              Placeholder chart built from the latest order totals.
            </p>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/5 text-white">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, idx) => (
                  <div key={idx} className="h-14 rounded-2xl bg-black/20" />
                ))}
              </div>
            ) : activity.length > 0 ? (
              activity.map((item, index) => (
                <div key={item.id}>
                  <div className="flex items-start gap-3">
                    <Badge className="mt-0.5 border border-white/10 bg-zinc-800 text-zinc-100 hover:bg-zinc-800">
                      {index + 1}
                    </Badge>
                    <div className="min-w-0">
                      <p className="text-sm text-zinc-200">{item.label}</p>
                      <p className="mt-1 text-xs text-zinc-500">{item.meta}</p>
                    </div>
                  </div>
                  {index < activity.length - 1 ? (
                    <Separator className="my-4 bg-white/10" />
                  ) : null}
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-white/10 bg-black/20 p-6 text-center text-zinc-400">
                No recent activity found.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminPageShell>
  );
}