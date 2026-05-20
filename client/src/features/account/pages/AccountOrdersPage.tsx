import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag } from "lucide-react";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import { formatPrice } from "@/features/products/utils/product.helpers";
import { orderService } from "../services/order.service";
import type { Order } from "../types/order.types";
import { ErrorState, EmptyState, TableSkeleton } from "@/shared/components/page-state";

function getStatusClass(status: Order["status"]) {
  switch (status) {
    case "delivered":
      return "bg-emerald-500/15 text-emerald-400 border-emerald-500/20";
    case "shipped":
      return "bg-blue-500/15 text-blue-400 border-blue-500/20";
    case "processing":
      return "bg-amber-500/15 text-amber-400 border-amber-500/20";
    case "paid":
      return "bg-cyan-500/15 text-cyan-400 border-cyan-500/20";
    case "cancelled":
      return "bg-red-500/15 text-red-400 border-red-500/20";
    default:
      return "bg-zinc-500/15 text-zinc-300 border-zinc-500/20";
  }
}

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

    return { totalOrders, delivered, inTransit, totalSpent };
  }, [orders]);

  return (
    <div className="min-h-screen bg-[#111113]/95 px-4 py-6 text-white sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Orders</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Track your purchases, delivery status, and order history.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-white/10 bg-white/5 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">
                Total Orders
              </CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold">
              {stats.totalOrders}
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/5 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">
                Delivered
              </CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold">
              {stats.delivered}
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/5 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">
                In Transit
              </CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold">
              {stats.inTransit}
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/5 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">
                Total Spent
              </CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold">
              {formatPrice(stats.totalSpent)}
            </CardContent>
          </Card>
        </div>

        <Card className="border-white/10 bg-white/5 text-white">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {loading ? (
              <TableSkeleton rows={4} />
            ) : error ? (
              <ErrorState
                error={error}
                onAction={() => window.location.reload()}
                actionLabel="Retry"
              />
            ) : orders.length === 0 ? (
              <EmptyState
                title="No orders yet"
                description="Your placed orders will appear here."
                actionLabel="Browse products"
                onAction={() => navigate("/products")}
                icon={<ShoppingBag className="h-5 w-5" />}
              />
            ) : (
              orders.map((order, index) => (
                <div key={order._id}>
                  <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-black/20 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium">
                          #{order._id.slice(-8).toUpperCase()}
                        </p>
                        <Badge className={["border", getStatusClass(order.status)].join(" ")}>
                          {order.status}
                        </Badge>
                      </div>

                      <p className="text-sm text-zinc-400">
                        {new Date(order.createdAt).toLocaleDateString()} ·{" "}
                        {order.items.length} item{order.items.length > 1 ? "s" : ""}
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
                        <Link to={`/account/orders/${order._id}`}>
                          View details
                        </Link>
                      </Button>
                    </div>
                  </div>

                  {index < orders.length - 1 ? (
                    <Separator className="my-4 bg-white/10" />
                  ) : null}
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}