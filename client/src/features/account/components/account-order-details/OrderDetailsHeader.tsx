import type { Order } from "../../types/order.types";
import OrderStatusBadge from "./OrderStatusBadge";

type Props = {
  order: Order;
};

export default function OrderDetailsHeader({ order }: Props) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Order Details</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Placed on {new Date(order.createdAt).toLocaleString()}
        </p>
      </div>

      <OrderStatusBadge status={order.status} />
    </div>
  );
}