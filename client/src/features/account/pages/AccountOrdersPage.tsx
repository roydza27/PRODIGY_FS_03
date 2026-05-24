import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { orderService } from "../services/order.service";
import type { Order } from "../types/order.types";
import { formatPrice } from "@/features/products/utils/product.helpers";

import AccountOrdersHeader from "../components/account-orders/AccountOrdersHeader";
import AccountOrdersStatsGrid from "../components/account-orders/AccountOrdersStatsGrid";
import OrdersListSection from "../components/account-orders/OrdersListSection";

export default function AccountOrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await orderService.getAll();
        setOrders(res.orders || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const delivered = orders.filter((order) => order.status === "delivered").length;
    const inTransit = orders.filter(
      (order) => order.status === "processing" || order.status === "shipped"
    ).length;
    const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);

    return {
      totalOrders,
      delivered,
      inTransit,
      totalSpent: formatPrice(totalSpent),
    };
  }, [orders]);

  return (
    <div className="min-h-screen bg-[#111113]/95 px-4 py-6 text-white sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <AccountOrdersHeader />

        <AccountOrdersStatsGrid
          totalOrders={stats.totalOrders}
          delivered={stats.delivered}
          inTransit={stats.inTransit}
          totalSpent={stats.totalSpent}
        />

        <OrdersListSection orders={orders} loading={loading} error={error} />
      </div>
    </div>
  );
}