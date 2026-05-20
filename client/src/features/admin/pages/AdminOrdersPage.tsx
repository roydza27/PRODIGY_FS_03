import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import AdminPageShell from "../components/AdminPageShell";
import OrderTable, { type AdminOrder } from "../components/OrderTable";
import type { AdminOrderStatus } from "../components/OrderStatusBadge";
import { formatPrice } from "@/features/products/utils/product.helpers";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function getToken() {
  return sessionStorage.getItem("token") || localStorage.getItem("token");
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const token = getToken();

  const res = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options?.headers || {}),
    },
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const message =
      typeof data?.message === "string"
        ? data.message
        : Array.isArray(data?.message)
          ? data.message?.[0]?.message || "Something went wrong"
          : "Something went wrong";

    throw new Error(message);
  }

  return data as T;
}

type OrdersResponse = {
  success: boolean;
  orders: AdminOrder[];
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<AdminOrderStatus | "all">("all");
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await request<OrdersResponse>("/orders");
      setOrders(res.orders || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    const query = search.toLowerCase().trim();

    return orders.filter((order) => {
      const matchesStatus =
        statusFilter === "all" ? true : order.status === statusFilter;

      const customer = `${order.shippingAddress.fullName} ${order.shippingAddress.email}`.toLowerCase();
      const orderId = order._id.toLowerCase();

      const matchesQuery =
        !query || customer.includes(query) || orderId.includes(query);

      return matchesStatus && matchesQuery;
    });
  }, [orders, search, statusFilter]);

  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const pending = orders.filter((o) => o.status === "pending").length;
    const shipped = orders.filter(
      (o) => o.status === "processing" || o.status === "shipped"
    ).length;
    const revenue = orders.reduce((sum, order) => sum + order.total, 0);

    return { totalOrders, pending, shipped, revenue };
  }, [orders]);

  const updateStatus = async (orderId: string, status: AdminOrderStatus) => {
    try {
      setUpdatingOrderId(orderId);

      const res = await request<{ success: boolean; order: AdminOrder }>(
        `/orders/${orderId}/status`,
        {
          method: "PATCH",
          body: JSON.stringify({ status }),
        }
      );

      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: res.order.status } : order
        )
      );

      toast.success("Order status updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update order");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  return (
    <AdminPageShell
      title="Orders"
      description="Review purchases, manage fulfillment, and update delivery status."
      actions={
        <Button
          onClick={loadOrders}
          variant="outline"
          className="rounded-xl border-white/10 bg-transparent text-white hover:bg-white/5"
        >
          Refresh
        </Button>
      }
    >
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-white/10 bg-white/5 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">
              Total Orders
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{stats.totalOrders}</CardContent>
        </Card>

        <Card className="border-white/10 bg-white/5 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{stats.pending}</CardContent>
        </Card>

        <Card className="border-white/10 bg-white/5 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">
              In Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{stats.shipped}</CardContent>
        </Card>

        <Card className="border-white/10 bg-white/5 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">
              Revenue
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {formatPrice(stats.revenue)}
          </CardContent>
        </Card>
      </div>

      <Card className="border-white/10 bg-white/5 text-white">
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order ID, customer name, or email..."
            className="border-white/10 bg-black/20 text-white placeholder:text-zinc-500"
          />

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as AdminOrderStatus | "all")
            }
            className="h-10 rounded-xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none"
          >
            <option value="all">All statuses</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </CardContent>
      </Card>

      {loading ? (
        <TableSkeleton rows={6} />
      ) : error ? (
        <ErrorState
          error={error}
          onAction={loadOrders}
          actionLabel="Retry"
        />
      ) : filteredOrders.length === 0 ? (
        <EmptyState
          title="No orders found"
          description="There are no orders matching the current filter."
        />
      ) : (
        <OrderTable
          orders={filteredOrders}
          onStatusChange={updateStatus}
          updatingOrderId={updatingOrderId}
        />
      )}
    </AdminPageShell>
  );
}