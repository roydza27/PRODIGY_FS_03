import { type SupportStatus } from "../types/support.types";

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


export interface SupportTicket {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: SupportStatus;
  createdAt: string;
  updatedAt: string;
}

type SupportTicketsResponse = {
  success: boolean;
  tickets: SupportTicket[];
};

type SupportTicketResponse = {
  success: boolean;
  ticket: SupportTicket;
};

export const supportService = {
  getAll: () => request<SupportTicketsResponse>("/support"),
  getById: (id: string) => request<SupportTicketResponse>(`/support/${id}`),
  updateStatus: (id: string, status: SupportStatus) =>
    request<SupportTicketResponse>(`/support/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
};