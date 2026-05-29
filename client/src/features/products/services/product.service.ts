import type {
  Product,
  ProductResponse,
  ProductsResponse,
} from "../types/product.types";

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
    throw new Error(data?.message || "Something went wrong");
  }

  return data as T;
}

export type ProductReview = {
  _id: string;
  user: { _id: string; name: string };
  rating: number;
  comment: string;
  createdAt: string;
};

export type AddReviewPayload = {
  rating: number;
  comment: string;
};

export const productService = {
  getAll: () => request<ProductsResponse>("/products?limit=100&page=1"),
  getById: (id: string) => request<ProductResponse>(`/products/${id}`),

  getReviews: (id: string) =>
    request<{ success: boolean; reviews: ProductReview[] }>(
      `/products/${id}/reviews`
    ),

  getReviewState: (id: string) =>
    request<{ success: boolean; canReview: boolean }>(
      `/products/${id}/review-state`
    ),

  addReview: (id: string, payload: AddReviewPayload) =>
    request<{ success: boolean; message: string; product: Product }>(
      `/products/${id}/reviews`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    ),

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