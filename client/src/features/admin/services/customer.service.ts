import type { AdminOrder } from "@/features/admin/components/OrderTable";

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

export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  orders: number;
  totalSpent: number;
  status: "active" | "new" | "vip";
  lastOrderAt?: string;
}

type OrdersResponse = {
  success: boolean;
  orders: AdminOrder[];
};

export async function getCustomers(): Promise<AdminCustomer[]> {
  const res = await request<OrdersResponse>("/orders/admin/all");
  const orders = res.orders || [];

  const customerMap = new Map<string, AdminCustomer>();

  for (const order of orders) {
    const email = order.shippingAddress?.email || "unknown@example.com";
    const name = order.shippingAddress?.fullName || "Unknown Customer";

    const existing = customerMap.get(email);

    if (existing) {
      existing.orders += 1;
      existing.totalSpent += order.total || 0;

      const currentLast = existing.lastOrderAt
        ? new Date(existing.lastOrderAt).getTime()
        : 0;
      const incoming = new Date(order.createdAt).getTime();

      if (incoming > currentLast) {
        existing.lastOrderAt = order.createdAt;
      }

      continue;
    }

    customerMap.set(email, {
      id: email,
      name,
      email,
      orders: 1,
      totalSpent: order.total || 0,
      status: "new",
      lastOrderAt: order.createdAt,
    });
  }

  const customers = Array.from(customerMap.values()).map((customer) => {
    if (customer.orders >= 5) return { ...customer, status: "vip" as const };
    if (customer.orders >= 2) return { ...customer, status: "active" as const };
    return customer;
  });

  return customers.sort((a, b) => b.totalSpent - a.totalSpent);
}