import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import AdminPageShell from "../components/AdminPageShell";
import OrderTable, { type AdminOrder } from "../components/OrderTable";
import type { AdminOrderStatus } from "../components/OrderStatusBadge";
import { formatPrice } from "@/features/products/utils/product.helpers";
import {
  EmptyState,
  ErrorState,
  TableSkeleton,
} from "@/shared/components/page-state";

const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");
const API_URL = API_BASE.endsWith("/api") ? API_BASE : `${API_BASE}/api`;

function getToken() {
  return sessionStorage.getItem("token") || localStorage.getItem("token");
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const token = getToken();

  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options?.headers || {}),
    },
  });

  const raw = await response.text();

  let data: any = null;
  if (raw) {
    try {
      data = JSON.parse(raw);
    } catch {
      data = { message: raw };
    }
  }

  if (!response.ok) {
    const message =
      typeof data?.message === "string"
        ? data.message
        : Array.isArray(data?.message)
          ? data.message?.[0]?.message || `Request failed (${response.status})`
          : `Request failed (${response.status})`;

    throw new Error(message);
  }

  return data as T;
}

type OrdersResponse = {
  success: boolean;
  orders?: AdminOrder[];
  data?: {
    orders?: AdminOrder[];
  };
};

type OrderUpdateResponse = {
  success: boolean;
  order?: AdminOrder;
  data?: {
    order?: AdminOrder;
  };
  message?: string;
};

function extractOrders(payload: OrdersResponse): AdminOrder[] {
  if (Array.isArray(payload.orders)) return payload.orders;
  if (Array.isArray(payload.data?.orders)) return payload.data.orders;
  return [];
}

function getCustomerLabel(order: AdminOrder) {
  const fullName = order.shippingAddress?.fullName?.trim() || "";
  const email = order.shippingAddress?.email?.trim() || "";
  return [fullName, email].filter(Boolean).join(" • ") || "Unknown customer";
}

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

      const res = await request<OrdersResponse>("/orders/admin/all");
      setOrders(extractOrders(res));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    const query = search.toLowerCase().trim();

    return orders.filter((order) => {
      const matchesStatus =
        statusFilter === "all" ? true : order.status === statusFilter;

      const customerLabel = getCustomerLabel(order).toLowerCase();
      const orderId = String(order._id || "").toLowerCase();
      const address = [
        order.shippingAddress?.address,
        order.shippingAddress?.city,
        order.shippingAddress?.state,
        order.shippingAddress?.postalCode,
        order.shippingAddress?.country,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesQuery =
        !query ||
        customerLabel.includes(query) ||
        orderId.includes(query) ||
        address.includes(query);

      return matchesStatus && matchesQuery;
    });
  }, [orders, search, statusFilter]);

  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const pending = orders.filter((o) => o.status === "pending").length;
    const inProgress = orders.filter(
      (o) => o.status === "paid" || o.status === "processing" || o.status === "shipped"
    ).length;
    const delivered = orders.filter((o) => o.status === "delivered").length;
    const revenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);

    return { totalOrders, pending, inProgress, delivered, revenue };
  }, [orders]);

  const updateStatus = async (orderId: string, status: AdminOrderStatus) => {
    try {
      setUpdatingOrderId(orderId);

      const res = await request<OrderUpdateResponse>(`/orders/${orderId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });

      const nextStatus = res.order?.status ?? res.data?.order?.status ?? status;

      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: nextStatus } : order
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
      {loading ? (
        <TableSkeleton rows={6} />
      ) : error ? (
        <ErrorState error={error} onAction={loadOrders} actionLabel="Retry" />
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