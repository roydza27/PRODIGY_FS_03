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

export interface AdminDashboardOrderItem {
  productId: string;
  name: string;
  image?: string;
  price: number;
  quantity: number;
}

export interface AdminDashboardOrder {
  _id: string;
  user?: string;
  items: AdminDashboardOrderItem[];
  shippingAddress?: {
    fullName: string;
    email: string;
  };
  status: "pending" | "paid" | "processing" | "shipped" | "delivered" | "cancelled";
  subtotal: number;
  total: number;
  createdAt: string;
  updatedAt: string;
}

export type AdminDashboardResponse = {
  products: Product[];
  orders: AdminDashboardOrder[];
  totalRevenue: number;
  totalProducts: number;
  totalOrders: number;
  totalCustomers: number;
  activeProducts: number;
};

export async function getDashboardStats(): Promise<AdminDashboardResponse> {
  const [productsRes, ordersRes] = await Promise.all([
    request<{ success: boolean; items: Product[] }>("/products"),
    request<{ success: boolean; orders: AdminDashboardOrder[] }>("/orders"),
  ]);

  const products = productsRes.items || [];
  const orders = ordersRes.orders || [];

  const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
  const activeProducts = products.filter((product) => product.status === "active").length;
  const totalCustomers = new Set(
    orders
      .map((order) => order.shippingAddress?.email)
      .filter(Boolean)
  ).size;

  return {
    products,
    orders,
    totalRevenue,
    totalProducts: products.length,
    totalOrders: orders.length,
    totalCustomers,
    activeProducts,
  };
}