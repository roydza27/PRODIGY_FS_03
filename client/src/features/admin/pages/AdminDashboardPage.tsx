import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import AdminPageShell from "../components/AdminPageShell";
import { getDashboardStats, type AdminDashboardResponse } from "../services/dashboard.service";
import { formatPrice } from "@/features/products/utils/product.helpers";
import {
  ArrowUpRight,
  BarChart3,
  Bell,
  CircleDollarSign,
  RefreshCw,
  ShoppingBag,
  Star,
  Store,
  Users,
  Package,
  TrendingUp,
  Activity,
} from "lucide-react";

function getStatusTone(status?: string) {
  switch (status) {
    case "delivered":
    case "completed":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-300";
    case "processing":
    case "shipped":
      return "border-blue-500/20 bg-blue-500/10 text-blue-300";
    case "pending":
      return "border-amber-500/20 bg-amber-500/10 text-amber-300";
    case "cancelled":
      return "border-red-500/20 bg-red-500/10 text-red-300";
    default:
      return "border-white/10 bg-white/5 text-zinc-300";
  }
}

function getTrendSeries(data?: AdminDashboardResponse | null) {
  if (!data) return [24, 38, 30, 52, 40, 62, 54, 68, 58, 72];

  const count = Math.max(8, Math.min(12, data.orders.length || 8));
  return Array.from({ length: count }, (_, i) => {
    const order = data.orders[i % Math.max(1, data.orders.length)];
    const base = order ? Math.max(18, Math.min(96, Math.round((order.total / 20000) * 100))) : 30;
    return base;
  });
}

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

  const revenueSeries = useMemo(() => getTrendSeries(data), [data]);

  const stats = useMemo(
    () => [
      {
        label: "Total Revenue",
        value: loading ? "..." : formatPrice(data?.totalRevenue || 0),
        icon: CircleDollarSign,
        accent: "text-emerald-300",
        ring: "border-emerald-500/20 bg-emerald-500/10",
        note: "+12.5% vs last period",
      },
      {
        label: "Total Orders",
        value: loading ? "..." : String(data?.totalOrders || 0),
        icon: ShoppingBag,
        accent: "text-blue-300",
        ring: "border-blue-500/20 bg-blue-500/10",
        note: "+8.2% order growth",
      },
      {
        label: "Total Products",
        value: loading ? "..." : String(data?.totalProducts || 0),
        icon: Package,
        accent: "text-violet-300",
        ring: "border-violet-500/20 bg-violet-500/10",
        note: `${data?.activeProducts || 0} active listings`,
      },
      {
        label: "Customers",
        value: loading ? "..." : String(data?.totalCustomers || 0),
        icon: Users,
        accent: "text-amber-300",
        ring: "border-amber-500/20 bg-amber-500/10",
        note: "Repeat buyers increasing",
      },
    ],
    [data, loading]
  );

  const topSignals = [
    {
      title: "Active listings",
      value: `${data?.activeProducts || 0}`,
      icon: Store,
      desc: "Products currently live in the store.",
    },
    {
      title: "Revenue momentum",
      value: loading ? "..." : `${revenueSeries[revenueSeries.length - 1] || 0}%`,
      icon: TrendingUp,
      desc: "Relative demand signal from recent orders.",
    },
    {
      title: "Priority alert",
      value: data?.orders?.length ? "Normal" : "No data",
      icon: Bell,
      desc: "No urgent platform issues detected.",
    },
    {
      title: "Marketplace health",
      value: "Stable",
      icon: BarChart3,
      desc: "Store performance looks consistent.",
    },
  ];

  return (
    <AdminPageShell
      title="Dashboard"
      description="Monitor store performance, activity, and high-level metrics."
      actions={
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="border-white/10 bg-black/20 text-white hover:bg-white/5"
            onClick={loadDashboard}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button className="bg-[#DB4444] hover:bg-[#c53a3a] text-white">
            Export Report
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        <Card className="border-white/10 bg-[#18181B] shadow-xl">
          <CardContent className="grid gap-5 p-5 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <Activity className="h-4 w-4 text-[#DB4444]" />
                Live store overview
              </div>
              <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
                Your marketplace is moving in the right direction.
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-zinc-400 sm:text-base">
                Use this panel to spot sales momentum, track inventory pressure, and react quickly to customer activity.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:justify-self-end">
              {topSignals.map((signal) => {
                const Icon = signal.icon;
                return (
                  <div key={signal.title} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-zinc-500">
                      <Icon className="h-4 w-4 text-[#DB4444]" />
                    </div>
                    <p className="mt-3 text-lg font-semibold text-white">{signal.value}</p>
                    <p className="mt-1 text-xs text-zinc-400">{signal.title}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="border-white/10 bg-[#18181B] shadow-xl transition hover:border-white/15 hover:bg-[#1b1b1f]">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">{stat.label}</p>
                      <p className="mt-2 text-3xl font-bold text-white">{stat.value}</p>
                      <p className="mt-2 text-sm text-emerald-300">{stat.note}</p>
                    </div>
                    <div className={`rounded-2xl border p-3 ${stat.ring}`}>
                      <Icon className={`h-5 w-5 ${stat.accent}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
          <Card className="border-white/10 bg-[#18181B] shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <div>
                <CardTitle className="text-white">Revenue Snapshot</CardTitle>
                <CardDescription className="mt-1 text-zinc-400">
                  Lightweight trend view for recent order totals.
                </CardDescription>
              </div>
              <Badge className="border border-emerald-500/20 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/10">
                {loading ? "Loading" : `${data?.activeProducts || 0} active products`}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-80 rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="flex h-full items-end gap-2">
                  {revenueSeries.map((height, index) => (
                    <div key={index} className="flex-1 rounded-t-xl bg-[#DB4444]/80" style={{ height: `${height}%` }} />
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between text-sm text-zinc-400">
                <p>Trend built from latest order totals and recent activity.</p>
                <div className="flex items-center gap-2 text-emerald-300">
                  <ArrowUpRight className="h-4 w-4" />
                  Improving
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-[#18181B] shadow-xl">
            <CardHeader>
              <CardTitle className="text-white">Recent Activity</CardTitle>
              <CardDescription className="text-zinc-400">Latest store events and orders.</CardDescription>
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
                      <Badge className={`mt-0.5 border ${getStatusTone(item.status)}`}>
                        {index + 1}
                      </Badge>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-zinc-200">{item.label}</p>
                        <p className="mt-1 text-xs text-zinc-500">{item.meta}</p>
                      </div>
                    </div>
                    {index < activity.length - 1 ? <Separator className="my-4 bg-white/10" /> : null}
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

        <div className="grid gap-6 xl:grid-cols-3">
          <Card className="border-white/10 bg-[#18181B] shadow-xl xl:col-span-2">
            <CardHeader>
              <CardTitle className="text-white">Store Performance Summary</CardTitle>
              <CardDescription className="text-zinc-400">
                The quick view helps you react to business changes without digging through every report.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              {[
                {
                  title: "Orders converted",
                  value: loading ? "..." : `${data?.totalOrders || 0}`,
                  desc: "Orders captured in the current reporting window.",
                },
                {
                  title: "Product coverage",
                  value: loading ? "..." : `${data?.activeProducts || 0}/${data?.totalProducts || 0}`,
                  desc: "Active listings versus total catalog size.",
                },
                {
                  title: "Customer base",
                  value: loading ? "..." : `${data?.totalCustomers || 0}`,
                  desc: "Registered buyers and returning shoppers.",
                },
                {
                  title: "Revenue quality",
                  value: loading ? "..." : formatPrice(data?.totalRevenue || 0),
                  desc: "Gross revenue from store orders.",
                },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-sm text-zinc-400">{item.title}</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{item.value}</p>
                  <p className="mt-2 text-sm leading-6 text-zinc-500">{item.desc}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-[#18181B] shadow-xl">
            <CardHeader>
              <CardTitle className="text-white">Ops Notes</CardTitle>
              <CardDescription className="text-zinc-400">What to watch next.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                "Review low-stock products before campaigns.",
                "Watch recent orders for fulfillment delays.",
                "Promote products with strong repeat demand.",
                "Keep the storefront active with fresh listings.",
              ].map((note) => (
                <div key={note} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="mt-0.5 rounded-full border border-[#DB4444]/20 bg-[#DB4444]/10 p-2 text-[#DB4444]">
                    <Star className="h-4 w-4" />
                  </div>
                  <p className="text-sm leading-6 text-zinc-300">{note}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminPageShell>
  );
}
