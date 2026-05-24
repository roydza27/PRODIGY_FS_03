import { Link } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import { formatPrice } from "@/features/products/utils/product.helpers";
import OrderStatusBadge from "./OrderStatusBadge";
import type { Order } from "../../types/order.types";

type Props = {
  order: Order;
  showDivider?: boolean;
};

export default function OrderListItem({ order, showDivider }: Props) {
  return (
    <div>
      <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-black/20 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-medium text-white">
              #{order._id.slice(-8).toUpperCase()}
            </p>
            <OrderStatusBadge status={order.status} />
          </div>

          <p className="text-sm text-zinc-400">
            {new Date(order.createdAt).toLocaleDateString()} · {order.items.length}{" "}
            item{order.items.length > 1 ? "s" : ""}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <p className="text-sm font-semibold text-zinc-100">
            {formatPrice(order.total)}
          </p>

          <Button
            asChild
            className="rounded-xl bg-red-500 text-white hover:bg-red-600"
          >
            <Link to={`/account/orders/${order._id}`}>View details</Link>
          </Button>
        </div>
      </div>

      {showDivider ? <Separator className="my-4 bg-white/10" /> : null}
    </div>
  );
}