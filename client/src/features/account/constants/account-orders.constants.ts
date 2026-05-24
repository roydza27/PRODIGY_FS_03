import type { OrderStatus } from "../types/order.types";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  delivered: "Delivered",
  shipped: "Shipped",
  processing: "Processing",
  paid: "Paid",
  cancelled: "Cancelled",
  pending: "Pending",
};

export const ORDER_STATUS_STYLES: Record<OrderStatus, string> = {
  delivered: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  shipped: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  processing: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  paid: "bg-cyan-500/15 text-cyan-400 border-cyan-500/20",
  cancelled: "bg-red-500/15 text-red-400 border-red-500/20",
  pending: "bg-zinc-500/15 text-zinc-300 border-zinc-500/20",
};