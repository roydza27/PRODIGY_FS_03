import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import AdminPageShell from "../components/AdminPageShell";
import AnalyticsStatCard from "../components/AnalyticsStatCard";
import RevenueChart from "../components/RevenueChart";
import { getAnalyticsDashboard, type AnalyticsDashboard } from "../services/analytics.service";
import {
  BarChart3,
  Bell,
  CircleDollarSign,
  Download,
  RefreshCw,
  ShoppingBag,
  Sparkles,
  Truck,
  Users,
  Warehouse,
} from "lucide-react";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatStatusLabel(value: string) {
  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const stats = await getAnalyticsDashboard();
      setData(stats);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load analytics";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  const orderStatusData = useMemo(
    () =>
      data?.orderStatusBreakdown.map((item) => ({
        label: formatStatusLabel(item.label),
        value: item.value,
      })) || [],
    [data]
  );

  const shipmentStatusData = useMemo(
    () =>
      data?.shipmentStatusBreakdown.map((item) => ({
        label: formatStatusLabel(item.label),
        value: item.value,
      })) || [],
    [data]
  );

  const supportStatusData = useMemo(
    () =>
      data?.supportStatusBreakdown.map((item) => ({
        label: formatStatusLabel(item.label),
        value: item.value,
      })) || [],
    [data]
  );

  const stats = [
    {
      label: "Total Revenue",
      value: loading ? "..." : formatCurrency(data?.totalRevenue || 0),
      description: "All completed and placed order totals.",
      icon: CircleDollarSign,
      accent: "text-emerald-300",
    },
    {
      label: "Total Orders",
      value: loading ? "..." : data?.totalOrders || 0,
      description: "Orders created through checkout.",
      icon: ShoppingBag,
      accent: "text-blue-300",
    },
    {
      label: "Total Customers",
      value: loading ? "..." : data?.totalCustomers || 0,
      description: "Unique customer email addresses.",
      icon: Users,
      accent: "text-violet-300",
    },
    {
      label: "Low Stock Products",
      value: loading ? "..." : data?.lowStockProducts || 0,
      description: "Products at 5 units or fewer.",
      icon: Warehouse,
      accent: "text-amber-300",
    },
  ] as const;

  const healthCards = [
    {
      title: "Shipments",
      value: loading ? "..." : data?.totalShipments || 0,
      icon: Truck,
      tone: "text-blue-300",
    },
    {
      title: "Open Tickets",
      value: loading ? "..." : data?.openTickets || 0,
      icon: Bell,
      tone: "text-amber-300",
    },
    {
      title: "Product Catalog",
      value: loading ? "..." : data?.totalProducts || 0,
      icon: BarChart3,
      tone: "text-[#DB4444]",
    },
  ] as const;

  return (
    <AdminPageShell
      title="Analytics"
      description="Track revenue, orders, customers, shipments, and support workload."
      actions={
        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={loadAnalytics}
            variant="outline"
            className="rounded-xl border-white/10 bg-black/20 text-white hover:bg-white/5"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button className="rounded-xl bg-[#DB4444] text-white hover:bg-[#c53a3a]">
            <Download className="mr-2 h-4 w-4" />
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
                <Sparkles className="h-4 w-4 text-[#DB4444]" />
                Live store performance
              </div>
              <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
                A quick view of how the store is moving.
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-zinc-400 sm:text-base">
                Use this dashboard to track revenue, conversion signals, operational pressure, and support volume without leaving the admin area.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                <p className="text-[11px] uppercase tracking-[0.16em] text-emerald-200/70">Revenue</p>
                <p className="mt-2 text-lg font-semibold text-white">Healthy</p>
              </div>
              <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 p-4">
                <p className="text-[11px] uppercase tracking-[0.16em] text-blue-200/70">Orders</p>
                <p className="mt-2 text-lg font-semibold text-white">Stable</p>
              </div>
              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
                <p className="text-[11px] uppercase tracking-[0.16em] text-amber-200/70">Stock</p>
                <p className="mt-2 text-lg font-semibold text-white">Watch</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => {
            const Icon = item.icon;
            return (
              <AnalyticsStatCard
                key={item.label}
                label={item.label}
                value={item.value}
                description={item.description}
                icon={<Icon className={`h-5 w-5 ${item.accent}`} />}
              />
            );
          })}
        </div>

        {error ? (
          <Card className="border-red-500/20 bg-red-500/10 text-white">
            <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold">Failed to load analytics</p>
                <p className="mt-1 text-sm text-red-200">{error}</p>
              </div>
              <Button onClick={loadAnalytics} className="rounded-xl bg-red-500 hover:bg-red-600">
                Retry
              </Button>
            </CardContent>
          </Card>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          <RevenueChart
            title="Revenue by Month"
            data={data?.revenueByMonth || []}
            emptyLabel={loading ? "Loading revenue data..." : "No revenue data available yet."}
          />

          <div className="space-y-6">
            <RevenueChart
              title="Orders by Month"
              data={data?.ordersByMonth || []}
              emptyLabel={loading ? "Loading order data..." : "No orders data available yet."}
            />

            <Card className="rounded-3xl border-white/10 bg-[#18181B] text-white shadow-xl">
              <CardHeader>
                <CardTitle>Operational Summary</CardTitle>
                <CardDescription className="text-zinc-400">
                  High-level indicators for store health.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {healthCards.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`rounded-xl border border-white/10 bg-white/5 p-2 ${item.tone}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="text-sm text-zinc-300">{item.title}</span>
                      </div>
                      <span className="text-sm font-semibold text-white">{item.value}</span>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <RevenueChart
            title="Order Status Breakdown"
            data={orderStatusData}
            emptyLabel={loading ? "Loading order status data..." : "No order status data available."}
          />
          <RevenueChart
            title="Shipment Status Breakdown"
            data={shipmentStatusData}
            emptyLabel={loading ? "Loading shipment status data..." : "No shipment status data available."}
          />
          <RevenueChart
            title="Support Status Breakdown"
            data={supportStatusData}
            emptyLabel={loading ? "Loading support ticket data..." : "No support ticket data available."}
          />
        </div>

        <Card className="border-white/10 bg-[#18181B] shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <div>
              <CardTitle className="text-white">Focus Areas</CardTitle>
              <CardDescription className="text-zinc-400">
                What needs attention right now.
              </CardDescription>
            </div>
            <Badge className="border-[#DB4444]/20 bg-[#DB4444]/10 text-[#ffd7d7] hover:bg-[#DB4444]/10">
              Admin overview
            </Badge>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            {[
              {
                title: "Inventory pressure",
                text: "Check low-stock products before pushing traffic from promotions.",
              },
              {
                title: "Fulfillment speed",
                text: "Watch delayed shipments so customer experience stays strong.",
              },
              {
                title: "Support backlog",
                text: "Open tickets should stay visible until resolved and closed.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="font-medium text-white">{item.title}</p>
                <p className="mt-2 text-sm leading-6 text-zinc-400">{item.text}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AdminPageShell>
  );
}
