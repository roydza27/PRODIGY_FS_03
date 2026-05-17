import type {
  Product,
  ProductResponse,
  ProductsResponse,
} from "../types/product.types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${url}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    ...options,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.message || "Something went wrong");
  }

  return data as T;
}

export const productService = {
  getAll: () => request<ProductsResponse>("/products"),
  getById: (id: string) => request<ProductResponse>(`/products/${id}`),

  create: (payload: Partial<Product>) =>
    request<ProductResponse>("/products", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  update: (id: string, payload: Partial<Product>) =>
    request<ProductResponse>(`/products/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  remove: (id: string) =>
    request<{ success: boolean; message?: string }>(`/products/${id}`, {
      method: "DELETE",
    }),
};