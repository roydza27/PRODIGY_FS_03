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

export type ShipmentStatus =
  | "pending"
  | "packed"
  | "in_transit"
  | "delivered"
  | "cancelled";

export interface ShipmentOrderSnapshot {
  items: {
    productId: string;
    name: string;
    image?: string;
    price: number;
    quantity: number;
  }[];
  shippingAddress: {
    fullName: string;
    email: string;
  };
  status: string;
  total: number;
  createdAt: string;
  updatedAt: string;
}

export interface Shipment {
  _id: string;
  order: ShipmentOrderSnapshot;
  carrier: string;
  trackingNumber: string;
  eta: string;
  status: ShipmentStatus;
  createdAt: string;
  updatedAt: string;
}

type ShipmentsResponse = {
  success: boolean;
  shipments: Shipment[];
};

type ShipmentResponse = {
  success: boolean;
  shipment: Shipment;
};

export const shipmentService = {
  getAll: () => request<ShipmentsResponse>("/shipments"),
  getById: (id: string) => request<ShipmentResponse>(`/shipments/${id}`),
  updateStatus: (id: string, status: ShipmentStatus) =>
    request<ShipmentResponse>(`/shipments/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
};