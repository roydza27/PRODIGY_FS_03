import { Button } from "@/shared/components/ui/button";
import { formatPrice } from "@/features/products/utils/product.helpers";
import OrderStatusBadge, { type AdminOrderStatus } from "./OrderStatusBadge";

export interface AdminOrderItemSnapshot {
  productId: string;
  name: string;
  image?: string;
  price: number;
  quantity: number;
}

export interface AdminShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface AdminOrder {
  _id: string;
  items: AdminOrderItemSnapshot[];
  shippingAddress: AdminShippingAddress;
  paymentMethod: "cod" | "card";
  status: AdminOrderStatus;
  subtotal: number;
  total: number;
  createdAt: string;
  updatedAt: string;
}

type Props = {
  orders: AdminOrder[];
  onStatusChange: (orderId: string, status: AdminOrderStatus) => void;
  updatingOrderId?: string | null;
};

export default function OrderTable({
  orders,
  onStatusChange,
  updatingOrderId,
}: Props) {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 text-white">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/10">
          <thead className="bg-black/20 text-left text-sm text-zinc-400">
            <tr>
              <th className="px-5 py-4 font-medium">Order</th>
              <th className="px-5 py-4 font-medium">Customer</th>
              <th className="px-5 py-4 font-medium">Items</th>
              <th className="px-5 py-4 font-medium">Total</th>
              <th className="px-5 py-4 font-medium">Status</th>
              <th className="px-5 py-4 font-medium">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/10">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-zinc-400">
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order._id}>
                  <td className="px-5 py-4">
                    <div className="space-y-1">
                      <p className="font-medium text-white">
                        #{order._id.slice(-8).toUpperCase()}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <div className="space-y-1">
                      <p className="font-medium text-white">
                        {order.shippingAddress.fullName}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {order.shippingAddress.email}
                      </p>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-sm text-zinc-300">
                    {order.items.length} item{order.items.length > 1 ? "s" : ""}
                  </td>

                  <td className="px-5 py-4 text-sm text-zinc-300">
                    {formatPrice(order.total)}
                  </td>

                  <td className="px-5 py-4">
                    <OrderStatusBadge status={order.status} />
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          onStatusChange(
                            order._id,
                            e.target.value as AdminOrderStatus
                          )
                        }
                        className="h-10 rounded-xl border border-white/10 bg-black/20 px-3 text-sm text-white outline-none"
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>

                      <Button
                        type="button"
                        disabled={updatingOrderId === order._id}
                        onClick={() => onStatusChange(order._id, order.status)}
                        className="rounded-xl bg-red-500 text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {updatingOrderId === order._id ? "Updating..." : "Update"}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}