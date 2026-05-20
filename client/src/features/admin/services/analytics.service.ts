import type { Product } from "@/features/products/types/product.types";

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

export type AnalyticsOrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface AnalyticsOrder {
  _id: string;
  status: AnalyticsOrderStatus;
  total: number;
  createdAt: string;
  shippingAddress?: {
    fullName: string;
    email: string;
  };
}

export interface AnalyticsShipment {
  _id: string;
  status: "pending" | "packed" | "in_transit" | "delivered" | "cancelled";
  createdAt: string;
}

export interface AnalyticsSupportTicket {
  _id: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  createdAt: string;
}

export interface AnalyticsPoint {
  label: string;
  value: number;
}

export interface AnalyticsDashboard {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  lowStockProducts: number;
  totalShipments: number;
  openTickets: number;
  ordersByMonth: AnalyticsPoint[];
  revenueByMonth: AnalyticsPoint[];
  orderStatusBreakdown: AnalyticsPoint[];
  shipmentStatusBreakdown: AnalyticsPoint[];
  supportStatusBreakdown: AnalyticsPoint[];
}

type ProductsResponse = {
  success: boolean;
  items: Product[];
};

type OrdersResponse = {
  success: boolean;
  orders: AnalyticsOrder[];
};

type ShipmentsResponse = {
  success: boolean;
  shipments: AnalyticsShipment[];
};

type SupportResponse = {
  success: boolean;
  tickets: AnalyticsSupportTicket[];
};

function monthLabel(dateStr: string) {
  return new Date(dateStr).toLocaleString("en-US", {
    month: "short",
    year: "numeric",
  });
}

function buildMonthlySeries<T extends { createdAt: string; total?: number }>(
  items: T[],
  valueKey: "count" | "total"
) {
  const map = new Map<string, number>();

  for (const item of items) {
    const label = monthLabel(item.createdAt);
    const current = map.get(label) || 0;
    map.set(label, current + (valueKey === "count" ? 1 : Number(item.total || 0)));
  }

  return Array.from(map.entries()).map(([label, value]) => ({ label, value }));
}

function buildStatusBreakdown<T extends { status: string }>(items: T[]) {
  const map = new Map<string, number>();

  for (const item of items) {
    map.set(item.status, (map.get(item.status) || 0) + 1);
  }

  return Array.from(map.entries()).map(([label, value]) => ({ label, value }));
}

export async function getAnalyticsDashboard(): Promise<AnalyticsDashboard> {
  const [productsRes, ordersRes, shipmentsRes, supportRes] = await Promise.all([
    request<ProductsResponse>("/products"),
    request<OrdersResponse>("/orders"),
    request<ShipmentsResponse>("/shipments"),
    request<SupportResponse>("/support"),
  ]);

  const products = productsRes.items || [];
  const orders = ordersRes.orders || [];
  const shipments = shipmentsRes.shipments || [];
  const tickets = supportRes.tickets || [];

  const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
  const totalCustomers = new Set(
    orders.map((order) => order.shippingAddress?.email).filter(Boolean)
  ).size;
  const lowStockProducts = products.filter(
    (product) => !product.stock || product.stock <= 5
  ).length;
  const openTickets = tickets.filter((ticket) => ticket.status === "open").length;

  return {
    totalRevenue,
    totalOrders: orders.length,
    totalProducts: products.length,
    totalCustomers,
    lowStockProducts,
    totalShipments: shipments.length,
    openTickets,
    ordersByMonth: buildMonthlySeries(orders, "count"),
    revenueByMonth: buildMonthlySeries(orders, "total"),
    orderStatusBreakdown: buildStatusBreakdown(orders),
    shipmentStatusBreakdown: buildStatusBreakdown(shipments),
    supportStatusBreakdown: buildStatusBreakdown(tickets),
  };
}