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
      Accept: "application/json",
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

export type AdminProductsResponse = {
  success: boolean;
  items: Product[];
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
};

export type AdminProductResponse = {
  success: boolean;
  product: Product;
};

export const adminProductService = {
  getAll: () => request<AdminProductsResponse>("/products"),
  getById: (id: string) => request<AdminProductResponse>(`/products/${id}`),

  create: (payload: Partial<Product>) =>
    request<AdminProductResponse>("/products", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  update: (id: string, payload: Partial<Product>) =>
    request<AdminProductResponse>(`/products/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  remove: (id: string) =>
    request<{ success: boolean; message?: string }>(`/products/${id}`, {
      method: "DELETE",
    }),
};