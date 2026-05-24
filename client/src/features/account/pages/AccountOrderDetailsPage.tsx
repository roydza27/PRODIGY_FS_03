import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { orderService } from "../services/order.service";
import type { Order } from "../types/order.types";

import OrderDetailsBreadcrumbs from "../components/account-order-details/OrderDetailsBreadcrumbs";
import OrderDetailsHeader from "../components/account-order-details/OrderDetailsHeader";
import OrderItemsSection from "../components/account-order-details/OrderItemsSection";
import ShippingAddressCard from "../components/account-order-details/ShippingAddressCard";
import OrderSummaryCard from "../components/account-order-details/OrderSummaryCard";

export default function AccountOrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOrder = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);
        const res = await orderService.getById(id);
        setOrder(res.order);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load order");
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#111113]/95 px-4 py-6 text-white sm:px-6 lg:px-8 lg:py-10">
        <div className="mx-auto max-w-6xl rounded-3xl border border-white/10 bg-white/5 p-8 text-zinc-400">
          Loading order details...
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#111113]/95 px-4 py-6 text-white sm:px-6 lg:px-8 lg:py-10">
        <div className="mx-auto max-w-6xl space-y-4">
          <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-8 text-red-300">
            {error || "Order not found"}
          </div>
          <Button asChild className="rounded-xl bg-red-500 hover:bg-red-600">
            <Link to="/account/orders">Back to orders</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111113]/95 px-4 py-6 text-white sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <OrderDetailsBreadcrumbs orderId={order._id} />
        <OrderDetailsHeader order={order} />
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <OrderItemsSection items={order.items} />
            <ShippingAddressCard address={order.shippingAddress} />
          </div>
          <OrderSummaryCard order={order} />
        </div>
      </div>
    </div>
  );
}