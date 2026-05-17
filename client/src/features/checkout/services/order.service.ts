import type { CheckoutFormData } from "../types/checkout.types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const token = sessionStorage.getItem("token");

  const res = await fetch(`${API_URL}${url}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options?.headers || {}),
    },
    ...options,
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

export const orderService = {
  createOrder: (payload: CheckoutFormData) =>
    request<{
      success: boolean;
      message?: string;
      order: { _id: string };
    }>("/orders", {
      method: "POST",
      body: JSON.stringify({
        shippingAddress: {
          fullName: payload.fullName,
          email: payload.email,
          phone: payload.phone,
          address: payload.address,
          city: payload.city,
          state: payload.state,
          postalCode: payload.postalCode,
          country: payload.country,
        },
        paymentMethod: payload.paymentMethod,
      }),
    }),
};