// shipment.service.ts
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function getToken() {
  return sessionStorage.getItem("token") || localStorage.getItem("token");
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const token = getToken();

  const headers = new Headers(options?.headers);

  if (!headers.has("Accept")) headers.set("Accept", "application/json");
  if (!(options?.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
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
  _id: string;
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

export type ShipmentsResponse = {
  success: boolean;
  shipments: Shipment[];
};

export type ShipmentResponse = {
  success: boolean;
  shipment: Shipment;
};

export type CreateShipmentPayload = {
  orderId: string;
  carrier: string;
  trackingNumber: string;
  eta: string;
  status?: ShipmentStatus;
  assignedToName?: string;
  assignedToRole?: string;
  assignedToPhone?: string;
  assignedNotes?: string;
};

export type UpdateShipmentPayload = Partial<
  Omit<CreateShipmentPayload, "orderId">
>;

export const shipmentService = {
  getAll: () => request<ShipmentsResponse>("/shipments"),

  getById: (id: string) => request<ShipmentResponse>(`/shipments/${id}`),

  create: (payload: CreateShipmentPayload) =>
    request<ShipmentResponse>("/shipments", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  update: (id: string, payload: UpdateShipmentPayload) =>
    request<ShipmentResponse>(`/shipments/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  updateStatus: (id: string, status: ShipmentStatus) =>
    request<ShipmentResponse>(`/shipments/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
};