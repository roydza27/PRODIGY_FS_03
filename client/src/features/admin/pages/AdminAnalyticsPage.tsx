import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import AdminPageShell from "../components/AdminPageShell";
import AnalyticsStatCard from "../components/AnalyticsStatCard";
import RevenueChart from "../components/RevenueChart";
import { getAnalyticsDashboard, type AnalyticsDashboard } from "../services/analytics.service";

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

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const stats = await getAnalyticsDashboard();
      setData(stats);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load analytics");
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

  return (
    <AdminPageShell
      title="Analytics"
      description="Track revenue, orders, customers, shipments, and support workload."
      actions={
        <button
          onClick={loadAnalytics}
          className="rounded-xl bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600"
        >
          Refresh
        </button>
      }
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <AnalyticsStatCard
          label="Total Revenue"
          value={loading ? "..." : formatCurrency(data?.totalRevenue || 0)}
          description="All completed and placed order totals."
        />
        <AnalyticsStatCard
          label="Total Orders"
          value={loading ? "..." : data?.totalOrders || 0}
          description="Orders created through checkout."
        />
        <AnalyticsStatCard
          label="Total Customers"
          value={loading ? "..." : data?.totalCustomers || 0}
          description="Unique customer email addresses."
        />
        <AnalyticsStatCard
          label="Low Stock Products"
          value={loading ? "..." : data?.lowStockProducts || 0}
          description="Products at 5 units or fewer."
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
        <RevenueChart
          title="Revenue by Month"
          data={data?.revenueByMonth || []}
          emptyLabel="No revenue data available yet."
        />

        <div className="space-y-6">
          <RevenueChart
            title="Orders by Month"
            data={data?.ordersByMonth || []}
            emptyLabel="No orders data available yet."
          />

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-white">
            <h3 className="text-lg font-semibold">Operational Summary</h3>
            <div className="mt-4 space-y-3 text-sm text-zinc-300">
              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                <span>Shipments</span>
                <span>{loading ? "..." : data?.totalShipments || 0}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                <span>Open Tickets</span>
                <span>{loading ? "..." : data?.openTickets || 0}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                <span>Products</span>
                <span>{loading ? "..." : data?.totalProducts || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <RevenueChart
          title="Order Status Breakdown"
          data={orderStatusData}
          emptyLabel="No order status data available."
        />
        <RevenueChart
          title="Shipment Status Breakdown"
          data={shipmentStatusData}
          emptyLabel="No shipment status data available."
        />
        <RevenueChart
          title="Support Status Breakdown"
          data={supportStatusData}
          emptyLabel="No support ticket data available."
        />
      </div>
    </AdminPageShell>
  );
}